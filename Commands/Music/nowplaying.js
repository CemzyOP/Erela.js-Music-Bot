const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType  } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const colors = require("../../Structures/configuration.json")
const Player = require("../../Structures/Handlers/Player")
const Reply = require("../../Systems/EditReply")
const humanizeDuration = require("humanize-duration");

module.exports = {
    name: "nowplaying",
    description: "Check what is current song that is playing",
    category: "Music",
         
     
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { guild, member} = interaction
        const Manager = client.player
        const player = Manager.players.get(guild.id)

        if (!player.queue.current)
        return interaction.reply("<:warning:1079415457716641854> There is no song being played currently")
        let res;
        const VC = member.voice.channel

        if (!VC) return interaction.reply("<:warning:1079415457716641854> You need to be in a voice channel to use this command.");
        const nowplayingembed = new EmbedBuilder()
        .setTitle(`[${player.queue.current.title}]`)
        .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
        .setURL(player.queue.current.uri)
        .addFields(
            { name: '⌛ Duration', value: `${humanizeDuration(player.queue.current.duration)}`, inline: true },
            { name: '💯 Song Author', value: `${player.queue.current.author}`, inline: true },
            { name: '🔂 Queue Size', value: `${player.queue.length} Songs`, inline: true },

        )
            .setColor(colors.bot_color)
          interaction.reply({embeds: [nowplayingembed]})
        
    }
 }