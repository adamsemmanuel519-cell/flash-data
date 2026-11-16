const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });
  const merchantId = (process.env.MTN_MERCHANT_ID || "").trim();
  const merchantName = (process.env.MTN_MERCHANT_NAME || "").trim();
  if (!merchantId || !merchantName) {
    return json(503, { error: "MTN MoMoPay merchant details have not been configured. Please contact the administrator." });
  }
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  const orderReference = `FDGH-${Date.now()}-${suffix}`;
  return json(200, { amount: 10, merchantId, merchantName, orderReference });
};
