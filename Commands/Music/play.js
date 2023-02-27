const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType  } = require("discord.js")
const colors = require("../../Structures/configuration.json")
const Player = require("../../Structures/Handlers/Player")
const humanizeDuration = require("humanize-duration");

module.exports = {
    name: "play",
    description: "Play a song",
    category: "Music",
    botPerms: ["Connect", "Speak"],
    options: [
        { 
                 name: "query",
                 description: 'Put song or url',
                 required: true,
                type: 3
            
        }        
        ],
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
      const { options, guild, member, channel, user } = interaction;
      const query = options.getString("query");
      const Erela = client.player;
      const VC = member.voice.channel;
      const filterPlugin = require("erela.js-filters")

      if (!VC) return interaction.reply("<:warning:1079415457716641854> You need to be in a voice channel to use this command.");
      if (guild.members.me.voice.channel && VC.id !== guild.members.me.voice.channelId) return interaction.reply("You need to be in the same voice channel as me to use this command.");
    
      const player = Erela.create({
        guild: guild.id,
        voiceChannel: member.voice.channel.id,
        textChannel: channel.id,
        selfDeafen: true,
        plugins: [
          // Initiate the plugin
          new filterPlugin({ name: "nightcore" })
        ]
      });
    
      try {
        await player.connect();
      } catch (error) {
        console.log(error);
        return interaction.reply("<:error:1079415464654016684> Failed to join voice channel.");
      }
    
      let res;
      try {
        res = await player.search(query, user);
        if (res.loadType === "LOAD_FAILED") {
          if (!player.queue.current) player.destroy();
          return interaction.reply("<:error:1079415464654016684> Loading track failed, try again.");
        } else if (res.loadType === "NO_MATCHES") {
          if (!player.queue.current) player.destroy();
          return interaction.reply("<:error:1079415464654016684> Couldn't find a match for the song you requested.");
        } else if (res.loadType === "PLAYLIST_LOADED") {
          player.queue.add(res.tracks);
          if (!player.playing && !player.paused) await player.play();
    
          const embedplaylistload = new EmbedBuilder()
            .setColor(colors.bot_color)
            .setDescription(`**<:play:1079415445045641226>  Queued • [${res.playlist.name}](${query})** \ (${res.tracks.length} tracks) ${res.tracks[0].requester}`);
    
          return interaction.reply({ embeds: [embedplaylistload] });
        } else if (["TRACK_LOADED", "SEARCH_RESULT"].includes(res.loadType)) {
          player.queue.add(res.tracks[0]);
          if (!player.playing && !player.paused) await player.play();
    
          const embedtracksearchresult = new EmbedBuilder()
                  .setDescription(`**<:play:1079415445045641226> Queued • [${res.tracks[0].title}](${res.tracks[0].uri}) \•  Duration: ${humanizeDuration(res.tracks[0].duration)} • ${res.tracks[0].requester}**`)
                  .setColor(colors.bot_color);
              return interaction.reply({ embeds: [embedtracksearchresult] });
          }
      } catch (error) {
          console.log(error);
      }
  }
}