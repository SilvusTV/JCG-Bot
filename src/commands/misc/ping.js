const {EmbedBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    name: 'ping',
    category: 'utils',
    ownerOnly: false,
    usage: 'ping',
    examples: ['ping'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    description: 'Connaitre la latence du bot.',
    callback: async (client, interaction) => {
        const tryPong = await interaction.reply({content: "Attention, pong imminent...", fetchReply: true});
        const embedQuestion = {
            color: 0xFFEE45,
            title: '🏓 Pong!',
            url: 'https://www.speedtest.net/run',
            thumbnail: {
                url: 'https://cdn.discordapp.com/avatars/1096778666131853313/f52fbb7e94b9899f4bbb49bb49c10eb0.webp',
            },
            fields: [
                {
                    name: 'Latence API',
                    value: `\`\`\`${client.ws.ping}ms\`\`\``,
                    inline: true
                },
                {
                    name: 'Latence BOT',
                    value: `\`\`\`${tryPong.createdTimestamp - interaction.createdTimestamp}ms\`\`\``,
                    inline: true
                }
            ],
            timestamp: new Date(),
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        interaction.editReply({content: null, embeds: [embedQuestion]})
    }
};
