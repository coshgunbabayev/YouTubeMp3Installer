function isYouTubeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;
        return hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'youtu.be';
    } catch (err) {
        return false;
    };
};

module.exports = { isYouTubeUrl };