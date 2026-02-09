const createEmbed = require("../../utils/createEmbed");
const createLog = require("../../utils/createLog");

module.exports = {
    name: "hane-ekle",
    description: "Yeni bir hane oluşturur",
    options: [
        {
            name: "isim",
            type: 3,
            description: "Hane adı",
            required: true
        },
        {
            name: "icon",
            type: 3,
            description: "Hane ikonu (emoji ID veya unicode)",
            required: true
        }
    ],

    callback: async (client, interaction) => {
        const { Hane } = require("../../database/models");
        const name = interaction.options.getString("isim");
        const icon = interaction.options.getString("icon");



        const [hane, created] = await Hane.findOrCreate({
            where: { name, icon }
        });

        if (!created) {
            const embed = createEmbed({
                client,
                title: "Hane Zaten Var",
                description: `**${name}** adlı hane zaten mevcut.`,
                color: "#E74C3C"
            });

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        /* ===== ROL OLUŞTUR ===== */
        await interaction.guild.roles.create({
            name: name,
            color: "Random",
            reason: "Yeni hane oluşturuldu"
        });

        const formatHaneIcon = (icon) => {
    if (!icon) return "Yok";

    // Custom emoji ID ise
    if (/^\d+$/.test(icon)) {
        return `<:icon:${icon}>`; // isim önemli değil
    }

    // Unicode emoji ise
    return icon;
};


        const embed = createEmbed({
            client,
            title: "Hane Oluşturuldu",
            description: "Yeni bir hane başarıyla oluşturuldu 🏠",
            fields: [
                { name: "Hane Adı", value: hane.name, inline: true },
                {name: "Hane İkonu", value: formatHaneIcon(hane.icon), inline: true },
                { name: "Hane ID", value: hane.id.toString(), inline: true }
            ]
        });

            await 

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

        await createLog({
            action: `Hane eklendi: ${name} (ID: ${hane.id})`,
            userId: interaction.user.id
        });
    }
};
