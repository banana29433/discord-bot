// Creates requests embed and components
const { ChatInputCommandInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'create-embed',
        description: 'lol',
        type: 1,
        options: []
    },
    options: {
        cooldown: 0,  
    },

    /**
     * @param {DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        await interaction.reply({
            content: '',
            ephemeral: false,
            embeds: [
                {
                    title: 'Training Requests',
                    color: 0x242429,
                    description: 'This board show who\'s requesting what trainings currently. To request trainings, navigate to the dropdown below and select the trainings you\'d like to attend. Once you\'ve chosen what trainings to request, you\'ll be given the role(s) for that trainings and will be added to the board under the trainings you requested. You can unsubscribe from trainings by unselecting them from the dropdown or pressing the red "clear" button.\n\n__Please note__:\n> - If you can no longer attend the trainings you\'ve subscribed to, please unsubsribe to them. Failure to attend a training you requested could result in disciplinary action.\n> - Do not request trainings you cannot attend (e.g. Juniors requesting Cadet trainings).\n> - Seniors may periodically clear requests if there is a build up of inactive ones. If you\'re still available when this happens, you\'ll have to resubscribe.',
                    fields: [
                        { name: 'Standard Training (0)', value: '', inline: false },
                        { name: 'Combat Training (0)', value: '', inline: false },
                        { name: 'Cadet Exam (0)', value: '', inline: false },
                        { name: 'Cadet Orientation (0)', value: '', inline: false }
                    ]
                }
            ],
            components: [
                {
                    type: 1,
                    components: [{
                        type: 3, // String Select Menu
                        custom_id: 'training-req',
                        placeholder: 'No trainings selected',
                        min_values: 0,
                        max_values: 4,
                        options: [
                            { label: 'Standard Training', value: 'req-st' },
                            { label: 'Combat Training', value: 'req-ct' },
                            { label: 'Cadet Exam', value: 'req-ce' },
                            { label: 'Cadet Orientation', value: 'req-co' }
                        ]
                    }]
                },
                {
                    type: 1,
                    components: [{
                        type: 2, // Button
                        custom_id: 'req-clear',
                        label: 'Clear',
                        style: 4
                    }]
                }
            ]
        });
    }
}).toJSON();
