const { Client, Partials, Collection } = require("discord.js")
const ms = require("ms")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
require("dotenv").config()
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials
const nodes = require("../Systems/Nodes")
const { Manager } = require("erela.js")
const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "users", "roles"] },
    rest: { timeout: ms("1m") }
})
const { player } = require("../Commands/Music/play")
client.commands = new Collection()

const Handlers = ["Events", "Errors", "Commands", "Player"]
client.player = new Manager({
    nodes,
    send: (id, payload) => {
        let guild = client.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)
    }
})

client.on("raw", (d) => client.player.updateVoiceState(d))
client.on('voiceStateUpdate', async (oldState, newState) => {
    const player = client.player?.players.get(newState.guild.id);
    if (!player) return;
        
    if (!newState.guild.members.cache.get(client.user.id).voice.channelId) { 
        player.destroy();
    }
    
    if (newState.channelId && newState.channel.type == 13 && newState.guild.members.me.voice.suppress) {
        if (newState.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak) || (newState.channel && newState.channel.permissionsFor(nS.guild.members.me).has(PermissionsBitField.Flags.Speak))) {
            await delay(2000);
            newState.guild.members.me.voice.setSuppressed(false);
        }
    }
    
    if (oldState.id === client.user.id) return;
    if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return;
    
    if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
        if (oldState.guild.members.me.voice?.channel && oldState.guild.members.me.voice.channel.members.filter((m) => !m.user.bot).size === 0) {
            await delay(10 * 1000); 
            const vcMembers = oldState.guild.members.me.voice.channel?.members.size;
            if (!vcMembers || vcMembers === 1) {
                if(!player) return;
                console.log("Bot disconnected from voice due to inactivity of people")
                await player.destroy();
            }
        }
    }
});

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
Handlers.forEach(handler => {

    require(`./Handlers/${handler}`)(client, PG, Ascii)

})

module.exports = client

client.login(process.env.DISCORD_TOKEN)