const Markup = require('node-vk-bot-api/lib/markup.js');

export const Keyboard = (buttons: any[], options?: Record<string, any>) => Markup.keyboard([...buttons], options);