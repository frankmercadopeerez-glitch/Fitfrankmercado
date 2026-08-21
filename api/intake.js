"use strict";

const {
  configurationReady,
  isExpectedPayment,
  methodAllowed,
  paypalRequest,
  sendJson,
  verifyToken
} = require("../lib/paypal");

const REQUIRED_FIELDS = [
  "full_name", "email", "country_timezone", "primary_goal", "goal_context",
  "age", "height", "current_weight", "daily_activity", "training_experience",
  "training_location", "equipment_available", "days_per_week", "minutes_per_session",
  "schedule_and_training_windows", "screen_symptoms", "screen_clearance",
  "screen_clinical_scope", "adult_confirmation", "privacy_consent", "plan_language"
];

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, "POST")) return;
  if (!configurationReady()) return sendJson(res, 503, { error: "intake_not_configured" });

  const body = req.body || {};
  const serializedLength = Buffer.byteLength(JSON.stringify(body), "utf8");
  if (serializedLength > 40000) return sendJson(res, 413, { error: "submission_too_large" });

  const token = verifyToken(body.payment_verification_token);
  if (!token || token.orderId !== body.paypal_order_id || token.captureId !== body.paypal_capture_id) {
    return sendJson(res, 403, { error: "payment_verification_required" });
  }
  const missing = REQUIRED_FIELDS.filter((field) => !String(body[field] || "").trim());
  if (missing.length) return sendJson(res, 400, { error: "missing_fields", fields: missing });

  try {
    const order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(token.orderId)}`, { method: "GET" });
    if (!isExpectedPayment(order, token.captureId)) {
      return sendJson(res, 403, { error: "payment_not_completed" });
    }

    const forwarded = {
      ...body,
      payment_verification_token: undefined,
      payment_status: "VERIFIED_BY_SERVER",
      verified_order_id: token.orderId,
      verified_capture_id: token.captureId,
      verified_amount: `${token.amount} ${token.currency}`,
      paypal_payer_email: token.payerEmail || body.paypal_payer_email || "not provided",
      _subject: body.language === "Español"
        ? `[PAGO VERIFICADO] Plan personalizado - ${body.full_name}`
        : `[PAYMENT VERIFIED] Custom plan - ${body.full_name}`
    };
    delete forwarded.payment_verification_token;

    const response = await fetch(process.env.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(forwarded)
    });
    if (!response.ok) throw new Error(`Formspree forwarding failed (${response.status})`);
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Verified intake forwarding error", { message: error.message });
    return sendJson(res, 502, { error: "submission_failed" });
  }
};
