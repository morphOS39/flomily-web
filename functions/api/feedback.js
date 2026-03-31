export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { email, good, bad, wish } = body;

    if (!good && !bad && !wish) {
      return new Response(JSON.stringify({ error: "Mindestens ein Feld ausfüllen" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build Telegram message
    const lines = [
      `🙏 Neues Beta-Feedback!`,
      `📧 ${email || "unbekannt"}`,
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
    const token = context.env.VEGA_BOT_TOKEN;
    const chatId = context.env.VEGA_CHAT_ID;

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
