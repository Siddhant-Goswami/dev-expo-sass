export const sendLogToDiscord = async (content: string) => {
  try {
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_ERROR_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      throw new Error('🔴 Missing Discord error Webhook URL');
    }

    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        content,
        flags: 4096,
      }),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to send Discord message: ${res.status}, ${res.statusText}!`,
      );
    }

    return {
      response: res,
      success: true,
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
      response: null,
      success: false,
    };
  }
};
