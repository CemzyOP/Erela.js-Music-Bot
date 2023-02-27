const { Client } = require("discord.js")
const ms = require("ms")
const mongoose = require('mongoose');

module.exports = {
    name: "ready",

    /**
    * @param {Client} client
    */
    async execute(client) {

        const { user, ws } = client

        client.player.init(user.id)

        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
        console.log('Connected to DB.');

        console.log(`${user.tag} is now online!`)

        setInterval(() => {

            const ping = ws.ping

            user.setActivity({
                name: `Ping: ${ping} ms`,
                type: 3,
            })

        }, ms("5s"))

    }
}