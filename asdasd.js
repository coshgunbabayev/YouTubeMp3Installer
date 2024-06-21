const { Telegraf } = require('telegraf');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const bot = new Telegraf('YOUR_BOT_TOKEN');

bot.start((ctx) => ctx.reply('Merhaba! YouTube videosunun MP3\'üne dönüştürmek için /convert komutunu kullanın.'));

bot.command('convert', async (ctx) => {
  try {
    const youtubeUrl = 'YOUTUBE_VIDEO_URL'; // YouTube video URL'si
    const videoInfo = await ytdl.getInfo(youtubeUrl);
    const videoTitle = videoInfo.videoDetails.title;

    // İlk olarak en yüksek ses kalitesini arayın
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });

    // Dosya adını oluştur
    const fileName = `video_${Date.now()}.mp4`;
    const filePath = `./${fileName}`;

    // Videoyu indir
    const videoStream = ytdl.downloadFromInfo(videoInfo, { format: audioFormat });
    videoStream.pipe(fs.createWriteStream(filePath));

    // Video indirme başlatıldı mesajı gönder
    const message = await ctx.reply(`YouTube video indiriliyor: ${videoTitle}`);

    // Videonun uzunluğunu alın
    const videoLengthSeconds = Math.floor(videoInfo.videoDetails.lengthSeconds);

    // İlerleme durumunu her saniyede bir güncelle
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress <= 100) {
        ctx.telegram.editMessageText(
          ctx.chat.id,
          message.message_id,
          null,
          `YouTube video indiriliyor: ${videoTitle}\n%${currentProgress}`
        );
      }
    }, videoLengthSeconds * 100); // Toplam ilerleme süresini saniye cinsinden belirtin

    // Videonun dönüşüm işlemi
    videoStream.on('end', () => {
      clearInterval(progressInterval); // İlerleme durumu güncellemeyi durdur
      ctx.telegram.editMessageText(
        ctx.chat.id,
        message.message_id,
        null,
        `YouTube video başarıyla indirildi: ${videoTitle}\nDönüştürülüyor...`
      );

      // Videoyu MP3'e dönüştür
      ffmpeg(filePath)
        .toFormat('mp3')
        .on('end', () => {
          ctx.telegram.editMessageText(
            ctx.chat.id,
            message.message_id,
            null,
            `YouTube video başarıyla MP3 formatına dönüştürüldü: ${videoTitle}`
          );

          // MP3 dosyasını silmek için (isteğe bağlı)
          fs.unlinkSync(filePath);
        })
        .save(`${fileName}.mp3`);
    });
  } catch (error) {
    console.error('Dönüştürme hatası:', error);
    ctx.reply('YouTube video dönüştürülürken bir hata oluştu.');
  }
});

bot.launch().then(() => {
  console.log('Bot çalışıyor.');
}).catch((error) => {
  console.error('Bot başlatılırken hata oluştu:', error);
});
