// packages
const { Telegraf } = require("telegraf");
require("dotenv").config();
const validator = require("validator");
const ytdl = require('ytdl-core');
const fs = require('fs');

//modules
const { writeCtx } = require("./modules/notify");
const { isYouTubeUrl } = require("./modules/url");

// controllers
const { start } = require("./controllers/commandController");
const { youtube } = require("./controllers/mp3Controller");

const bot = new Telegraf(process.env.TOKEN);

bot.start(writeCtx, start);

bot.on("message", writeCtx, async (ctx) => {
    if (!validator.isURL(ctx.message.text)) {
        return ctx.reply("This is not link");
    };

    if (isYouTubeUrl(ctx.message.text)) {
        youtube(ctx);
    } else {
        return ctx.reply("This is not current link");
    };
});

bot.launch((err) => {
    if (err) {
        return console.log("Bot -_-")
    }
    console.log("Bot starting...");
});

require("express")().listen(process.env.PORT, () => {
    console.log("server is listening on port", process.env.PORT);
});