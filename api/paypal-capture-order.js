"use strict";

const {
  CURRENCY,
  PRICE,
  captureFromOrder,
  configurationReady,
  isExpectedPayment,
  methodAllowed,
  paypalRequest,
  sendJson,
  signPayload
} = require("../lib/paypal");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, "POST")) return;
  if (!configurationReady()) return sendJson(res, 503, { error: "checkout_not_configured" });
  const orderId = req.body?.orderId;
  if (typeof orderId !== "string" || !/^[A-Z0-9]{8,40}$/i.test(orderId)) {
    return sendJson(res, 400, { error: "invalid_order_id" });
  }
  try {
    try {
      await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: "POST",
        headers: { "PayPal-Request-Id": `capture-${orderId}` }
      });
    } catch (error) {
      // A browser retry can arrive after PayPal has already captured the order.
      // In that case the authoritative GET below still verifies every field.
      if (error.status !== 422) throw error;
    }
    const order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}`);
    const capture = captureFromOrder(order);
    if (!capture || !isExpectedPayment(order, capture.id)) {
      return sendJson(res, 409, { error: "payment_not_completed" });
    }
    const payerEmail = order?.payer?.email_address || "";
    const payload = {
      v: 1,
      orderId: order.id,
      captureId: capture.id,
      payerEmail,
      amount: PRICE,
      currency: CURRENCY,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
    };
    return sendJson(res, 200, {
      completed: true,
      orderId: order.id,
      captureId: capture.id,
      payerEmail,
      verificationToken: signPayload(payload)
    });
  } catch (error) {
    console.error("PayPal capture error", { status: error.status || 500 });
    return sendJson(res, 502, { error: "capture_failed" });
  }
};
