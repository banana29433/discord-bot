const { ButtonInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
  customId: 'req-clear',
  type: 'button',
  /**
   * 
   * @param {DiscordBot} client 
   * @param {ButtonInteraction} interaction 
   */
  run: async (client, interaction) => {
    const message = interaction.message;
    const userMention = `<@${interaction.user.id}>`;
    const embed = message.embeds[0];
    const guild = interaction.guild;
    const member = await guild.members.fetch(interaction.user.id);

    const trainings = {
      "req-st": "Standard Training",
      "req-ct": "Combat Training",
      "req-ce": "Cadet Exam",
      "req-co": "Cadet Orientation",
    };

    // Map training ID -> role ID
    const trainingRoles = {
      "req-st": "1391424764652032082",
      "req-ct": "1391424775066484796",
      "req-ce": "1391424782523826327",
      "req-co": "1391424789905805313",
    };

    const fieldKeys = Object.keys(trainings);

    fieldKeys.forEach((id, index) => {
      const field = embed.fields[index];
      if (!field) return;

      let valueLines = field.value.split('\n').filter(line => line.trim() !== '');
      const userInList = valueLines.includes(userMention);

      if (userInList) {
        valueLines = valueLines.filter(line => line !== userMention);
        field.value = valueLines.length ? valueLines.join('\n') : '';

        // update count in title
        field.name = field.name.replace(/\(\d+\)/, `(${valueLines.length})`);
      }
    });

    // Remove all training roles
    for (const roleId of Object.values(trainingRoles)) {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId).catch(console.error);
      }
    }

    await message.edit({
      embeds: [embed]
    });

    await interaction.reply({
      content: 'You have been removed from all training requests and roles.',
      ephemeral: true
    });
  }
}).toJSON();
