const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const createEmbed = require("../../utils/createEmbed");
const createLog = require("../../utils/createLog");

module.exports = {
    name: "kullanici-kayit",
    description: "Kullanıcıyı haneye kaydeder",
    options: [
        {
            name: "kullanici",
            type: 6,
            description: "Kayıt edilecek kullanıcı",
            required: true
        }
    ],

    callback: async (client, interaction) => {
        const { Hane } = require("../../database/models");
        const targetUser = interaction.options.getUser("kullanici");

        const hanes = await Hane.findAll();

        // ❌ Hane yoksa
        if (!hanes.length) {
            const embed = createEmbed({
                client,
                title: "Hane Bulunamadı",
                description: "Kayıt işlemi için sistemde hiç hane yok.",
                color: "#E74C3C"
            });

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        // ✅ Hane seçim menüsü
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`hane_select_${targetUser.id}`)
            .setPlaceholder("Hane seç")
            .addOptions(
                hanes.map(h => ({
                    label: h.name,
                    value: h.id.toString()
                }))
            );

        const embed = createEmbed({
            client,
            title: "Kullanıcı Kayıt",
            description: `🏠 **${targetUser.username}** için kayıt edilecek haneyi seç`,
            thumbnail: targetUser.displayAvatarURL(),
            color: "#3498DB",
            fields: [
                {
                    name: "Kullanıcı",
                    value: `${targetUser.username}`,
                    inline: true
                },
                {
                    name: "Kullanıcı ID",
                    value: targetUser.id,
                    inline: true
                }
            ]
        });

        interaction.reply({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(menu)],
            ephemeral: true
        });

        await createLog({
                    action: `Kullanıcı kaydı başlatıldı: ${targetUser.tag} (${targetUser.id})`,
                    userId: interaction.user.id
                });
     
    }
};
