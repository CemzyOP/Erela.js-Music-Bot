const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType, MessageActionRow, MessageButton  } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const colors = require("../../Structures/configuration.json")
const Player = require("../../Structures/Handlers/Player")
const Reply = require("../../Systems/EditReply")
module.exports = {
    name: "resume",
    description: "Resume a song",
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

        if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return interaction.reply("You need to be in same voice call as me to play a song")
        if(player.paused) {
            player.pause(false)
            interaction.reply("You succesfully resumed song") 
        } else {
            interaction.reply("<:warning:1079415457716641854> No song to resume")
        }

        
    }
 }