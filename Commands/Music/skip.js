const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType  } = require("discord.js")
const colors = require("../../Structures/configuration.json")
const Player = require("../../Structures/Handlers/Player")
module.exports = {
    name: "skip",
    description: "Skip a song",
    category: "Music",
         
     
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { guild, member} = interaction
        const Manager = client.player
        const player = Manager.players.get(guild.id)

        if(!player) return interaction.reply("There is no song going on?", true)

        const VC = member.voice.channel
        if(!VC) return interaction.reply("<:warning:1079415457716641854> You need to be in voice call")

        if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return interaction.reply("You need to be in same voice call as me to play a song")
        await player.stop()
        interaction.reply("<:warning:1079415457716641854> The song has been skipped")
    }
 }