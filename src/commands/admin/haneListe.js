const createEmbed = require("../../utils/createEmbed");
const createLog = require("../../utils/createLog");

module.exports = {
    name: "hane-liste",
    description: "Tüm haneleri listeler",

    callback: async (client, interaction) => {
        const { Hane } = require("../../database/models");

        const hanes = await Hane.findAll();

        if (!hanes.length) {
            const embed = createEmbed({
                client,
                title: "Hane Bulunamadı",
                description: "Sistemde hiç hane yok ❌",
                color: "#E74C3C"
            });
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const fields = hanes.map(h => ({
            name: `🏠 ${h.name}`,
            value: `ID: ${h.id}`,
            inline: true
        }));

        const embed = createEmbed({
            client,
            title: "Hane Listesi",
            description: `Sistemde toplam **${hanes.length}** hane var`,
            fields,
            color: "#3498DB"
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
        await createLog({
            action: `Hane listelendi (Toplam: ${hanes.length})`,
            userId: interaction.user.id
        });
    }
};
