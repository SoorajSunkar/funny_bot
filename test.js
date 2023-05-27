const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const bot = new TelegramBot('AAGQmGYX7OR86XmInSW54onFfuorVtPHPmg', { polling: true });

// Replace 'CHANNEL_USERNAME' with the username of the channel (e.g., @your_channel)
const channelUsername = 'https://t.me/xxxxdfdkfkdmk3';

// Replace 'MESSAGE_LINK' with the URL of the channel post
const messageLink = 'https://t.me/Videos_funny_memes_gifs_english/1055';

// Extract the channel username and message ID from the message link
const regex = /https?:\/\/t\.me\/([a-zA-Z0-9_]+)\/(\d+)/;
const match = messageLink.match(regex);

if (match) {
  const channel = match[1];
  const messageId = match[2];

  // Forward the message to the bot
  bot.forwardMessage(channel, channelUsername, messageId)
    .then((forwardedMsg) => {
      console.log('Message forwarded successfully');
    })
    .catch((error) => {
      console.error('Error forwarding message:', error);
    });
} else {
  console.error('Invalid message link');
}
