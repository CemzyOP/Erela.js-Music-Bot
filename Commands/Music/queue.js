const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType  } = require("discord.js")
const colors = require("../../Structures/configuration.json")
const Player = require("../../Structures/Handlers/Player")
const humanizeDuration = require("humanize-duration");
const { NormalPage } = require('../../Structures/PageQueue.js');

module.exports = {
    name: "queue",
    description: "Queue",
    category: "Music",
    options: [
        {
                 name: "number",
                 description: 'Put song or url',
                 required: true,
                 type: ApplicationCommandOptionType.Number
            
        }        
        ],
     
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const pagenumber = interaction.options.get('number');

        const { guild, member} = interaction

        const Manager = client.player
        const player = Manager.players.get(guild.id)

		if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

		const song = player.queue.current;
		const qduration = `${humanizeDuration(player.queue.duration)}`;
        const thumbnail = `https://img.youtube.com/vi/${song.identifier}/hqdefault.jpg`;

		let pagesNum = Math.ceil(player.queue.length / 10);
		if(pagesNum === 0) pagesNum = 1;

		const songStrings = [];
		for (let i = 0; i < player.queue.length; i++) {
			const song = player.queue[i];
			songStrings.push(
				`**${i + 1}.** [${song.title}](${song.uri}) \`[${humanizeDuration(song.duration)}]\` • ${song.requester}
				`);
		}

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = songStrings.slice(i * 10, i * 10 + 10).join('');

			const embed = new EmbedBuilder()
                .setAuthor({ name: `Queue - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(thumbnail)
                     .setColor(colors.bot_color)
				.setDescription(`*Currently Playing*\n*[${song.title}](${song.uri})* \`[${humanizeDuration(song.duration)}]\` • ${song.requester}\n\n*Rest of queue*:${str == '' ? '  Nothing' : '\n' + str}`) //Page • ${i + 1}/${pagesNum} | ${player.queue.length} • Song | ${qduration} • Total duration
				.setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${player.queue.length} • Song/s | ${qduration} • Total Duration` });
			pages.push(embed);
		}

		if (!pagenumber[0]) {
			if (pages.length == pagesNum && player.queue.length > 10) NormalPage(client, interaction, pages, 60000, player.queue.length, qduration);
			else return interaction.reply({ embeds: [pages[0]] });
		}
		else {
			if (isNaN(pagenumber[0])) return interaction.reply(`Please enter a number!`);
			if (pagenumber[0] > pagesNum) return interaction.reply(`There are only ${pagesNum} pages available!`);
			const pageNum = pagenumber[0] == 0 ? 1 : pagenumber[0] - 1;
			return interaction.reply({ embeds: [pages[pageNum]] });
		}
	}
};