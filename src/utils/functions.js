const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

const youtube = require('yt-channel-info');

module.exports.handleInformation = handleInformation;

async function handleInformation(client) {
  const channel = await client.channels.fetch(process.env.INFORMATION_CHANNEL);

  if (!channel) {
    return console.log(
      '\x1b[31m',
      `[!] Information channel is not found, please check .env file.`
    );
  }

  const channelId = process.env.CHANNEL_ID;
  const channelIdType = process.env.CHANNEL_TYPE;

  const attachment = new AttachmentBuilder(
    `${process.cwd()}/src/assets/youtube.gif`
  );

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setThumbnail('attachment://youtube.gif');

  await youtube
    .getChannelInfo({ channelId, channelIdType })
    .then((response) => {
      embed.setURL(response.authorUrl);
      embed.setTitle(response.author);
      embed.setFooter({
        iconURL: 'https://cdn3.emoji.gg/emojis/5596-youtube-logo.png',
        text: response.subscriberText,
      });
    });

  await youtube
    .getChannelVideos({ channelId, channelIdType, sortBy: 'newest' })
    .then((response) => {
      if (response.items[0]) {
        embed.addFields({
          name: `Last video (${response.items[0].publishedText})`,
          value: `[${response.items[0].title}](https://www.youtube.com/watch?v=${response.items[0].videoId})`,
        });
      }
    });

  await youtube
    .getChannelVideos({ channelId, channelIdType, sortBy: 'popular' })
    .then((response) => {
      if (response.items[0]) {
        response.items.sort((a, b) => b.viewCount - a.viewCount);

        embed.addFields({
          name: `Popular video (${response.items[0].viewCountText})`,
          value: `[${response.items[0].title}](https://www.youtube.com/watch?v=${response.items[0].videoId})`,
        });
      }
    });

  await youtube
    .getChannelStats({ channelId, channelIdType })
    .then((response) => {
      if (response) {
        embed.setDescription(
          `・ Joined to [YouTube](https://youtube.com) at **<t:${Math.floor(
            response.joinedDate / 1000
          )}:R>**` +
            '\n\n' +
            `・ Total **${response.viewCount}** views`
        );
      }
    });

  await channel.messages.fetch();

  if (channel.lastMessage && channel.lastMessage.author.id == client.user.id) {
    const message = await channel.messages.cache.find(
      (m) => m.author.id == client.user.id
    );
    return await message.edit({
      embeds: [embed],
      files: [attachment],
    });
  } else {
    return await channel.send({
      embeds: [embed],
      files: [attachment],
    });
  }
}
