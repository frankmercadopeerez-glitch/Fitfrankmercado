"use strict";

const { CURRENCY, PRICE, configurationReady, methodAllowed, sendJson } = require("../lib/paypal");

module.exports = async function handler(req, res) {
  if (!methodAllowed(req, res, "GET")) return;
  const enabled = configurationReady();
  return sendJson(res, 200, {
    enabled,
    clientId: enabled ? process.env.PAYPAL_CLIENT_ID : null,
    currency: CURRENCY,
    amount: PRICE,
    mode: process.env.PAYPAL_MODE === "live" ? "live" : "sandbox"
  });
};
