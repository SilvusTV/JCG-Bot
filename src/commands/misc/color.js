const {PermissionFlagsBits, ApplicationCommandOptionType, AttachmentBuilder} = require('discord.js');
const {createCanvas} = require('canvas');
const fs = require('fs');

module.exports = {
    name: 'color',
    category: 'utils',
    ownerOnly: false,
    usage: 'color [hex color]',
    examples: ['color #FFEE45'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    description: 'Afficher une couleur et et la convertir en autre systeme de couleur',
    options: [
        {
            name: 'couleur',
            description: 'Afficher votre couleur en HEX et la convertir',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        let color = interaction.options.getString('couleur')
        if (color && !color.startsWith('#')) {
            color = '#' + color;
        }
        const filePath = __dirname + `./../../../color/${color}.png`;
        if (!fs.existsSync(filePath)) {
            // Créer une image de couleur de 100x100 pixels.
            const image = createColorImage(color + 'ff');
            // Enregistrer l'image dans un fichier PNG.
            const out = fs.createWriteStream(__dirname + `./../../../color/${color}.png`);
            const stream = image.createPNGStream();
            stream.pipe(out);
            out.on('finish', () => {
                console.log('L\'image a été enregistrée.');
                embed()
            });
        }else {
            embed()
        }

        function embed() {
            const hsl = hexToHsl(color)
            const rgb = hexToRgb(color)
            const hsv = hexToHsv(color)
            const cmyk = hexToCmyk(color)

            const file = new AttachmentBuilder(__dirname + `./../../../color/${color}.png`);

            const embedQuestion = {
                color: 0xFFEE45,
                title: `${color}`,
                url: `https://www.google.com/search?q=%23${color.slice(1)}`,
                image: {
                    url: `attachment://${color}.png`
                },
                description: `La couleur : \`${color}\` correspond également à :\n------`,
                fields: [
                    {
                        name: 'HSL',
                        value: `\`${hsl}\``,
                        inline: true
                    },
                    {
                        name: 'RGB',
                        value: `\`${rgb}\``,
                        inline: true
                    },
                    {
                        name: '------',
                        value: ` `,
                    },
                    {
                        name: 'HSV',
                        value: `\`${hsv}\``,
                        inline: true
                    },
                    {
                        name: 'CMYK',
                        value: `\`${cmyk}\``,
                        inline: true
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
            };
            interaction.reply({content: null, embeds: [embedQuestion], files: [file], ephemeral: false  })
        }
    }
};


const createColorImage = (hex) => {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, 100, 100);
    }
    return canvas;
};

function hexToHsl(hexCode) {
    // Convertir la couleur hexadécimale en décimal.
    const r = parseInt(hexCode.slice(1, 3), 16) / 255;
    const g = parseInt(hexCode.slice(3, 5), 16) / 255;
    const b = parseInt(hexCode.slice(5, 7), 16) / 255;

    // Trouver la valeur minimale et maximale pour la couleur.
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    // Calculer la luminosité de la couleur.
    let lightness = (cmax + cmin) / 2;

    // Si la couleur est grise, sa saturation est de 0.
    if (delta === 0) {
        return {
            hue: 0,
            saturation: 0,
            lightness: lightness,
        };
    }

    // Calculer la saturation de la couleur.
    let saturation = delta / (1 - Math.abs(2 * lightness - 1));

    // Trouver l'angle de teinte de la couleur.
    let hue;
    switch (cmax) {
        case r:
            hue = ((g - b) / delta) % 6;
            break;
        case g:
            hue = (b - r) / delta + 2;
            break;
        case b:
            hue = (r - g) / delta + 4;
            break;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) {
        hue += 360;
    }
    return `${hue}°,${Math.round(saturation * 100)}%,${Math.round(lightness * 100)}%`;
}

function hexToRgb(hexCode) {
    // Convertir la couleur hexadécimale en décimal.
    const r = parseInt(hexCode.slice(1, 3), 16);
    const g = parseInt(hexCode.slice(3, 5), 16);
    const b = parseInt(hexCode.slice(5, 7), 16);

    return `${r},${g},${b}`;
}

function hexToHsv(hexCode) {
    // Convertir la couleur hexadécimale en décimal.
    const r = parseInt(hexCode.slice(1, 3), 16) / 255;
    const g = parseInt(hexCode.slice(3, 5), 16) / 255;
    const b = parseInt(hexCode.slice(5, 7), 16) / 255;

    // Trouver la valeur minimale et maximale pour la couleur.
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    // Trouver la valeur de saturation de la couleur.
    let saturation = 0;
    if (cmax !== 0) {
        saturation = delta / cmax;
    }

    // Trouver l'angle de teinte de la couleur.
    let hue = 0;
    if (delta !== 0) {
        switch (cmax) {
            case r:
                hue = ((g - b) / delta) % 6;
                break;
            case g:
                hue = (b - r) / delta + 2;
                break;
            case b:
                hue = (r - g) / delta + 4;
                break;
        }
    }
    hue = Math.round(hue * 60);
    if (hue < 0) {
        hue += 360;
    }

    // Calculer la valeur de valeur de la couleur.
    let value = Math.round(cmax * 100);

    return `${hue}°,${Math.round(saturation * 100)}%,${value}%`;
}

function hexToCmyk(hexCode) {
    // Convertir la couleur hexadécimale en décimal.
    const r = parseInt(hexCode.slice(1, 3), 16) / 255;
    const g = parseInt(hexCode.slice(3, 5), 16) / 255;
    const b = parseInt(hexCode.slice(5, 7), 16) / 255;

    // Trouver les valeurs de cyan, magenta, jaune et noir de la couleur.
    const k = Math.min(1 - r, 1 - g, 1 - b);
    const c = k === 1 ? 0 : Math.round(((1 - r - k) / (1 - k)) * 100);
    const m = k === 1 ? 0 : Math.round(((1 - g - k) / (1 - k)) * 100);
    const y = k === 1 ? 0 : Math.round(((1 - b - k) / (1 - k)) * 100);

    return `${c}%,${m}%,${y}%,${Math.round(k * 100)}%`;
}