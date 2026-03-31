async function verifyToken(email, token, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(email));
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  return expected === token;
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { email, token, good, bad, wish } = body;

    // Verify HMAC token
    const secret = context.env.FEEDBACK_SECRET;
    if (!email || !token || !secret || !(await verifyToken(email, token, secret))) {
      return new Response(JSON.stringify({ error: "Ungültiger Link" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!good && !bad && !wish) {
      return new Response(JSON.stringify({ error: "Mindestens ein Feld ausfüllen" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build Telegram message
    const lines = [
      `🙏 Neues Beta-Feedback!`,
      `📧 ${email}`,
      ``,
      `✅ Was lief gut:`,
      good || "—",
      ``,
      `❌ Was nicht:`,
      bad || "—",
      ``,
      `💡 Was fehlt:`,
      wish || "—",
    ];
    const text = lines.join("\n");

    // Send to VEGA Telegram bot
    const botToken = context.env.VEGA_BOT_TOKEN;
    const chatId = context.env.VEGA_CHAT_ID;

    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://flomily.de",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://flomily.de",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
