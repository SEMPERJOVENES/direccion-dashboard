export default async function handler(req, res) {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    return res.status(503).json({ error: "Stripe no configurado" });
  }

  try {
    const response = await fetch(
      "https://api.stripe.com/v1/balance_transactions?limit=100",
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Stripe API error" });
    }

    const data = await response.json();

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.status(200).json({ transactions: data.data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
