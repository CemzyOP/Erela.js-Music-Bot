const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType  } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const colors = require("../../Structures/configuration.json")
const Player = require("../../Structures/Handlers/Player")
const Reply = require("../../Systems/EditReply")
const humanizeDuration = require("humanize-duration");

module.exports = {
    name: "loop",
    description: "Loop song",
    category: "Music",
         
     
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { guild, member} = interaction
        const Manager = client.player
        const player = Manager.players.get(guild.id)


        const VC = member.voice.channel
        if(!VC) return interaction.reply("<:warning:1079415457716641854> You need to be in voice call")

        if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return interaction.reply("You need to be in same voice call as me to play a song")
        if(!player || !player.queue.current) return interaction.reply("<:warning:1079415457716641854 There is no song going on?")
        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
        interaction.reply(`<:loop:1079417199623675924>  Loop is **${trackRepeat}** for the current song`)
    }
};