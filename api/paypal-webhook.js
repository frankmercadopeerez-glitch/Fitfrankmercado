"use strict";

const { configurationReady, methodAllowed, paypalRequest, sendJson } = require("../lib/paypal");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, "POST")) return;
  if (!configurationReady() || !process.env.PAYPAL_WEBHOOK_ID) {
    return sendJson(res, 503, { error: "webhook_not_configured" });
  }
  try {
    const verification = await paypalRequest("/v1/notifications/verify-webhook-signature", {
      method: "POST",
      body: JSON.stringify({
        auth_algo: req.headers["paypal-auth-algo"],
        cert_url: req.headers["paypal-cert-url"],
        transmission_id: req.headers["paypal-transmission-id"],
        transmission_sig: req.headers["paypal-transmission-sig"],
        transmission_time: req.headers["paypal-transmission-time"],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: req.body
      })
    });
    if (verification.verification_status !== "SUCCESS") {
      return sendJson(res, 400, { error: "invalid_webhook_signature" });
    }
    console.log("Verified PayPal webhook", { id: req.body?.id, type: req.body?.event_type });
    return sendJson(res, 200, { received: true });
  } catch (error) {
    console.error("PayPal webhook verification error", { status: error.status || 500 });
    return sendJson(res, 400, { error: "webhook_verification_failed" });
  }
};
