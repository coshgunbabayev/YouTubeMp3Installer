const start = async (ctx) => {
    await ctx.telegram.sendPhoto(
        ctx.chat.id,
        {
            source: "./public/image/mainPhoto.jpg"
        },
        {
            caption: "Hi, this bot is for converting Youtube videos to mp3. To get started, post a link to a Youtube video."
        });
};

module.exports = { start };