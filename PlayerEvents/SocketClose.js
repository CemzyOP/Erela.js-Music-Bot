const { Client } = require("discord.js")
const { Node } = require("erela.js")
module.exports = {
    name: 'socketClose',
    
    /**
     * @param {Player} player
     * @param {WebSocket} payload
     * @param {Client} client
     */

    async execute(player, payload, client) {
        await player.destroy()
    }
}