const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType  } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const colors = require("../../Structures/configuration.json")
const Player = require("../../Structures/Handlers/Player")
const Reply = require("../../Systems/EditReply")

module.exports = {
    name: "pause",
    description: "Pause a song",
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

        if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return interaction.reply("<:warning:1079415457716641854> You need to be in same voice call as me to play a song")
        if(player.playing) {
            player.pause(true)
            return interaction.reply("You succesfully paused a song") 
        } else {
            interaction.reply("<:warning:1079415457716641854> No song to pause")
        }

        
    }
 }