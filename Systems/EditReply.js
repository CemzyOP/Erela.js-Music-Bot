const { EmbedBuilder, CommandInteraction } = require("discord.js")

/**
 * @param {CommandInteraction} interaction - client interaction from Command Interaction
 * @param {*} emoji - emoji for the reply
 * @param {String} description - description for the reply
 */
function EditReply(interaction, emoji, description) {



}
function InsertEmbed(interaction, emoji, description) {

    interaction.editReply({
        embeds: [
            embed2
        ]
    })

}
module.exports = EditReply