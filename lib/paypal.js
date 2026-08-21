"use strict";

const crypto = require("node:crypto");

const PRICE = "19.00";
const CURRENCY = "USD";
const PRODUCT_CODE = "FMF-CUSTOM-4W";

function paypalBaseUrl() {
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function configurationReady() {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET &&
    process.env.PAYPAL_INTAKE_SIGNING_SECRET &&
    process.env.FORMSPREE_ENDPOINT
  );
}

async function accessToken() {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
    "utf8"
  ).toString("base64");
  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(`PayPal authentication failed (${response.status})`);
  }
  return data.access_token;
}

async function paypalRequest(path, options = {}) {
  const token = await accessToken();
  const response = await fetch(`${paypalBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`PayPal request failed (${response.status})`);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

function base64url(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function signPayload(payload) {
  const encoded = base64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", process.env.PAYPAL_INTAKE_SIGNING_SECRET)
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  const expected = crypto
    .createHmac("sha256", process.env.PAYPAL_INTAKE_SIGNING_SECRET)
    .update(encoded)
    .digest("base64url");
  const suppliedBuffer = Buffer.from(signature || "", "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function captureFromOrder(order) {
  return order?.purchase_units?.[0]?.payments?.captures?.[0] || null;
}

function isExpectedPayment(order, expectedCaptureId) {
  const purchase = order?.purchase_units?.[0];
  const capture = captureFromOrder(order);
  return Boolean(
    order?.status === "COMPLETED" &&
    capture?.status === "COMPLETED" &&
    capture?.id === expectedCaptureId &&
    capture?.amount?.currency_code === CURRENCY &&
    capture?.amount?.value === PRICE &&
    purchase?.custom_id === PRODUCT_CODE
  );
}

function sendJson(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json(payload);
}

function methodAllowed(req, res, method) {
  if (req.method === method) return true;
  res.setHeader("Allow", method);
  sendJson(res, 405, { error: "method_not_allowed" });
  return false;
}

module.exports = {
  CURRENCY,
  PRICE,
  PRODUCT_CODE,
  captureFromOrder,
  configurationReady,
  isExpectedPayment,
  methodAllowed,
  paypalRequest,
  sendJson,
  signPayload,
  verifyToken
};
