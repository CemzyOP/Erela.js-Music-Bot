const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

const NormalPage = async (client, interaction, pages, timeout, queueLength, queueDuration) => {
  if (!interaction.channel) throw new Error('Channel is inaccessible.');
  if (!pages) throw new Error('Pages are not given.');

  const row1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('back')
        .setLabel('⬅')
        .setStyle(2),
    );
  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡')
        .setStyle(2),
    );
  const row = [row1, row2];

  let page = 0;
  const curPage = await interaction.reply({
    embeds: [
      pages[page].setFooter({
        text: `Page • ${page + 1}/${pages.length} | ${queueLength} • Song/s | ${queueDuration} • Total Duration`,
      }),
    ],
    components: row,
    allowedMentions: { repliedUser: false },
  });
  if (pages.length == 0) return;

  const filter = (i) => i.user.id === interaction.user.id;
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: timeout });

  collector.on('collect', async (i) => {
    if (!i.deferred) await i.deferUpdate();
    if (i.customId === 'back') {
      page = page > 0 ? --page : pages.length - 1;
    } else if (i.customId === 'next') {
      page = page + 1 < pages.length ? ++page : 0;
    }
    await interaction.editReply({
      embeds: [
        pages[page].setFooter({
          text: `Page • ${page + 1}/${pages.length} | ${queueLength} • Song/s | ${queueDuration} • Total Duration`,
        }),
      ],
      components: row,
    });
  });
  collector.on('end', async () => {
    const disabled = new ActionRowBuilder().addComponents(
      row1.components[0].setDisabled(true),
      row2.components[0].setDisabled(true),
    );
    await interaction.editReply({ components: [disabled] });
  });
  return curPage;
};

module.exports = { NormalPage };
