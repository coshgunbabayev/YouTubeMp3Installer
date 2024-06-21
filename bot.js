const { Telegraf } = require("telegraf");
require("dotenv").config();
const validator = require("validator");
const ytdl = require('ytdl-core');
const fs = require('fs');
const { isYouTubeUrl } = require("./modules/url");
const { createAudioFileName } = require("./modules/randomCreate");

const bot = new Telegraf(process.env.TOKEN);

bot.on("message", async (ctx) => {
    console.log("message from:", ctx.from.first_name);
    if (!validator.isURL(ctx.message.text)) {
        return ctx.reply("This is not link");
    };

    if (!isYouTubeUrl(ctx.message.text)) {
        return ctx.reply("This is not YouTube link");
    };

    const filePath = `./audio/${createAudioFileName(40)}.mp3`;
    let message = await ctx.reply("Downloading...");

    ytdl(ctx.message.text, {
        filter: "audioonly",
        format: "mp3",
    })
        .on("error", () => {
            ctx.reply("Try another YouTube link");
        })
        .pipe(fs.createWriteStream(filePath))
        .on("finish", async () => {
            try {
                await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
                message = await ctx.reply("Sedding...");
                await ctx.telegram.sendAudio(ctx.chat.id, { source: filePath });
                await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
            } catch (err) {
                ctx.reply("An error occurred while sending the MP3 file.");
            } finally {
                fs.unlink(filePath, (err) => {
                    if (err) { console.log("err"); }
                });
            };
        });
});

bot.launch((err) => {
    if (err) {
        return console.log("Bot -_-")
    }
    console.log("Bot starting...");
});
