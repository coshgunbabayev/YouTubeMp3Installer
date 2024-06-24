const ytdl = require('ytdl-core');
const fs = require('fs');

const { createAudioFileName } = require("../modules/randomCreate");

const youtube = async (ctx) => {
    console.log("start")
    const videoInfo = await ytdl.getInfo(ctx.message.text);
    const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');

    if (audioFormats.length === 0) {
        return ctx.reply("An error occurred while sending the MP3 file.");
    };

    const bestAudioFormat = audioFormats[0];
    const size = bestAudioFormat.contentLength;
    if (size) {
        let sizeInMB = size / (1024 * 1024);
        if (sizeInMB > 15) {
            return ctx.reply("This video is over the size limit, try another YouTube link")
        };
    } else {
        return ctx.reply("Try another YouTube link");
    };

    const filePath = `./public/audio/${createAudioFileName(40)}.mp3`;
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
};

module.exports = { youtube };