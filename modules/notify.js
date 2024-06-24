const writeCtx = (ctx, next) => {
    console.log("from:", ctx.from.first_name, "message:", ctx.message.text);
    next();
};

module.exports = { writeCtx };