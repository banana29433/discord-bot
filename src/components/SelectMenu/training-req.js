const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
  customId: "training-req",
  type: "select",
  /**
   *
   * @param {DiscordBot} client
   * @param {import("discord.js").AnySelectMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    const selectedIds = interaction.values;
    const message = interaction.message;
    const userMention = `<@${interaction.user.id}>`;
    const embed = message.embeds[0];

    const guild = interaction.guild;
    const member = await guild.members.fetch(interaction.user.id);

    // training ID -> training name
    const trainings = {
      "req-st": "Standard Training",
      "req-ct": "Combat Training",
      "req-ce": "Cadet Exam",
      "req-co": "Cadet Orientation",
    };

    // training ID -> role ID
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

      let valueLines = field.value
        .split("\n")
        .filter((line) => line.trim() !== "");
      const userInList = valueLines.includes(userMention);
      const isSelected = selectedIds.includes(id);
      const role = guild.roles.cache.get(trainingRoles[id]);

      if (isSelected && !userInList) {
        valueLines.push(userMention);
        field.name = field.name.replace(/\(\d+\)/, `(${valueLines.length})`);
        field.value = valueLines.join("\n");

        if (role) member.roles.add(role).catch(console.error);

      } else if (!isSelected && userInList) {
        valueLines = valueLines.filter((line) => line !== userMention);
        field.name = field.name.replace(/\(\d+\)/, `(${valueLines.length})`);
        field.value = valueLines.length ? valueLines.join("\n") : "";

        if (role) member.roles.remove(role).catch(console.error);
      }
    });

    await message.edit({ embeds: [embed] });

    await interaction.reply({
      content: `Your training subscriptions and roles have been updated.`,
      ephemeral: true,
    });
  },
}).toJSON();
