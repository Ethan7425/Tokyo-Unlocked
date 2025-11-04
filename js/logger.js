import { config } from './config.js';

export const logger = {
  log(message, ...args) {
    console.log(`[LOG] ${message}`, ...args);
  },

  error(message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  },

  warn(message, ...args) {
    console.warn(`[WARN] ${message}`, ...args);
  },

  async sendError(message, details = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      message,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('[ERROR]', errorData);

    if (config.discord.webhookUrl) {
      try {
        await fetch(config.discord.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            embeds: [{
              title: '🚨 Error Report',
              description: message,
              color: 0xff0000,
              fields: [
                {
                  name: 'Details',
                  value: JSON.stringify(details, null, 2).substring(0, 1000)
                },
                {
                  name: 'Timestamp',
                  value: errorData.timestamp
                }
              ]
            }]
          })
        });
      } catch (webhookError) {
        console.error('[ERROR] Failed to send error to Discord:', webhookError);
      }
    }
  }
};
