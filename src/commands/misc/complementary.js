const {PermissionFlagsBits, ApplicationCommandOptionType, AttachmentBuilder} = require('discord.js');
const tinycolor = require("tinycolor2");

module.exports = {
    name: 'complementary',
    category: 'utils',
    ownerOnly: false,
    usage: 'complementary [number] [hex color]',
    examples: ['complementaire 1 #FFEE45', 'complementaire 10 FFEE45'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    description: 'Afficher une couleur et et la convertir en autre systeme de couleur',
    options: [
        {
            name: 'complementaire',
            description: 'nombre de couleur complémentaire compris entre 1 et 10',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'couleur',
            description: 'Afficher votre couleur en HEX et la convertir',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        // Check le nombre de couleur complémentaire
        const complementaire = interaction.options.getNumber('complementaire');
        if (complementaire > 10 || complementaire <= 0) return interaction.reply({content: 'Le \`NOMBRE\` doit être inférieur ou égal à 10 et supérieur à 0.', ephemeral: true});

        let color = interaction.options.getString('couleur')
        if (color && !color.startsWith('#')) {
            color = '#' + color;
        }
        const allComplementaire = compleCalculator(complementaire, color)

        let fieldsList = []
        for (i = allComplementaire.length; i !== 0; i--) {
            fieldsList.push({
                name: `Couleur complémentaire ${i}`,
                value: `\`${allComplementaire[i - 1].color}\`\n------`,
                inline: false
            })
        }
        fieldsList.push({
            name: `Tips`,
            value: `N'oubliez pas que si vous voulez plus de details sur une couleur vous pouvez faire \`/color\` ! 🙂 `,
            inline: false
        })

        const embed = {
            color: 0xFFEE45,
            title: `Couleur(s) Complémentaire(s)`,

            description: `La liste de(s) ${complementaire} couleur(s) complèmentaire(s) de \`${color}\` :\n------`,
            fields: fieldsList,
            timestamp: new Date(),
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };
        interaction.reply({content: null, embeds: [embed], ephemeral: false})
    }
};

function rotateHue(hex, degrees) {
    const color = tinycolor(hex);
    // Ajoute l'angle de rotation à la valeur de teinte.
    const newColor = color.spin(degrees);
    // Convertit la couleur en couleur HEX.
    return newColor.toHex();
}

function compleCalculator(number, color) {
    const rotate = 360 / (number + 1);
    let allCompletary = [];
    for (i = number; i !== 0; i--) {
        color = rotateHue(color, rotate)
        allCompletary.push({color: color});
    }
    return allCompletary;
}
