const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const EditReply = require("../../Systems/EditReply")
const {readdirSync} = require("fs");
const colors = require("../../Structures/configuration.json")

module.exports = {
    name: "help",
    description: "Shows list of commands",
    category: "General",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const {member} = interaction;

        let categories = [];
    
        readdirSync("./Commands/").forEach((dir) => {
          const commands = readdirSync(`./Commands/${dir}/`).filter((file) =>
            file.endsWith(".js")
          );
    
          const cmds = commands.map((command) => {
            let file = require(`../../Commands/${dir}/${command}`);
    
            if (!file.name) return "No command name.";
    
            let name = file.name.replace(".js", "");
            let description = file.description;
    
            return `\`${name}\` `;
          });
    
          let data = new Object();
    
          data = {
            name: `${dir.charAt(0).toUpperCase() + dir.slice(1)}:`,
            value: cmds.length === 0 ? "In progress." : cmds.join(" "),
          };
    
          categories.push(data);
        });
    
        const embed = new EmbedBuilder()
          .setTitle("List of commands")
          .addFields(categories)
          .setColor(colors.bot_color)
          .setFooter({text: `Requested By ${member.user.tag}`});
        return interaction.reply({embeds: [embed]});
      },
    };