const { ChatInputCommandInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'cleartrainings',
        description: 'Remove all training roles from every member in the server.',
        type: 1,
        options: []
    },
    options: {
        cooldown: 60000 // 1 min cooldown for example
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const guild = interaction.guild;
        if (!guild) return interaction.reply({ content: "This command must be used in a server.", ephemeral: true });

        // Training role IDs to remove
        const trainingRoleIds = [
            "1391424764652032082",
            "1391424775066484796",
            "1391424782523826327",
            "1391424789905805313"
        ];

        await interaction.reply({ content: `Starting removal of training roles...`, ephemeral: true });

        const members = await guild.members.fetch(); // fetch all members (careful with large servers)

        let checked = 0;
        for (const member of members.values()) {
            checked++;

            // Remove all training roles the member has
            const rolesToRemove = trainingRoleIds.filter(roleId => member.roles.cache.has(roleId));
            if (rolesToRemove.length) {
                await member.roles.remove(rolesToRemove).catch(() => { /* ignore errors */ });
            }

            // Update status every 20 checked members
            if (checked % 20 === 0 || checked === members.size) {
                await interaction.editReply({
                    content: `Removing training roles... (${checked}/${members.size} members checked)`
                });
            }
        }

        await interaction.editReply({
            content: `Done! Checked ${checked} members and removed training roles where applicable.`
        });
    }
}).toJSON();
