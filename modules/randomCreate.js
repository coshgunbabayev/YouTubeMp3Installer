const createAudioFileName = (len) => {
    let name = new String();
    for (let i = 0; i < len; i++) {
        name += String(parseInt(Math.random() * 10));
    };
    return name;
};

module.exports = { createAudioFileName };