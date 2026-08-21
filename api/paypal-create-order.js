"use strict";

const crypto = require("node:crypto");
const {
  CURRENCY,
  PRICE,
  PRODUCT_CODE,
  configurationReady,
  methodAllowed,
  paypalRequest,
  sendJson
} = require("../lib/paypal");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, "POST")) return;
  if (!configurationReady()) return sendJson(res, 503, { error: "checkout_not_configured" });
  try {
    const order = await paypalRequest("/v2/checkout/orders", {
      method: "POST",
      headers: { "PayPal-Request-Id": crypto.randomUUID() },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          custom_id: PRODUCT_CODE,
          description: "Personalized 4-week training plan",
          amount: { currency_code: CURRENCY, value: PRICE }
        }]
      })
    });
    return sendJson(res, 201, { id: order.id });
  } catch (error) {
    console.error("PayPal create order error", { status: error.status || 500 });
    return sendJson(res, 502, { error: "order_creation_failed" });
  }
};
