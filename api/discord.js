import { verifyKey } from "discord-interactions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];

  let body = "";
  await new Promise((resolve) => {
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", resolve);
  });

  if (!signature || !timestamp) {
    return res.status(401).send("Missing signature headers");
  }

  let isValid = false;
  try {
    isValid = verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
  } catch (err) {
    return res.status(401).send("Signature verification error");
  }
  if (!isValid) {
    return res.status(401).send("Invalid request signature");
  }

  let json;
  try {
    json = JSON.parse(body);
  } catch {
    return res.status(400).send("Bad Request");
  }

  if (json.type === 1) {
    return res.json({ type: 1 });
  }

  // Optional: reply to /verify slash command for manual test
  if (json.type === 2 && json.data && json.data.name === "verify") {
    return res.json({
      type: 4,
      data: { content: "✅ Discord verification endpoint is working on Vercel!" }
    });
  }

  return res.status(400).send("Unhandled interaction");
}
