const wa = require("@open-wa/wa-automate");
const moment = require("moment-timezone");
const { timezone } = require('./config.js');

const start = async (bot) => {
    console.log(`[READY] ${moment.tz(timezone).format()} => The sticker bot has been booted up!`);
    // Force-curr session
    bot.onStateChanged((state) => {
        console.log("[StateChange] StateChanged status:", state);
        if (state === "CONFLICT") bot.forceRefocus();
    });
    // Message handler
    bot.onMessage(async (message) => {
        // Hello world
        if (message.body === "#hi" || message.body === "#hai" || message.body === "#halo" || message.body === "#hello") {
            console.log(`[DEBUG] [runCmd] ${moment.tz(timezone).format()} => Someone has used 'hi' command: ${message.from} ( ${message.sender.pushname} | ${message.chat.name} )`);
            bot.sendText(message.from, `Hi *${message.sender.pushname}*, if you want to make a sticker instantly, please send/quote some image attachments with caption \`\`\`#sticker\`\`\``);
        };
        // Attachment using #sticker
        if (message.type === "image" && message.caption === "#sticker") {
            console.log(`[DEBUG] [create] ${moment.tz(timezone).format()} => Someone has just created a new sticker by attaching: ${message.from} ( ${message.sender.pushname} | ${message.chat.name} )`);
            const mediaData = await wa.decryptMedia(message);
            const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString("base64")}`;
            bot.sendImageAsSticker(message.from, imageBase64);
        };
        // Quoted attachment using #sticker
        if (message.quotedMsg && message.quotedMsg.type === "image" && message.body === "#sticker") {
            console.log(`[DEBUG] [create] ${moment.tz(timezone).format()} => Someone has just created a new sticker by quoting: ${message.from} ( ${message.sender.pushname} | ${message.chat.name} )`);
            const mediaData = await wa.decryptMedia(message.quotedMsg);
            const imageBase64 = `data:${message.quotedMsg.mimetype};base64,${mediaData.toString("base64")}`;
            bot.sendImageAsSticker(message.from, imageBase64);
        };
    });
};

// Start the bot
wa.create()
    .then((bot) => start(bot))
    .catch((error) => console.log(error));
