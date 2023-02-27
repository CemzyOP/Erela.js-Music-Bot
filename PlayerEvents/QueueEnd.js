const { Client } = require("discord.js")
const { Player } = require("../Structures")
module.exports = {
    name: 'queueEnd',
    
    /**
     * @param {Player} player
     * @param {Client} client
     */
    async execute(player, track, type, client) {
        await player.destroy()
    }
}