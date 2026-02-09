const createEmbed = require("../../utils/createEmbed");
const createLog = require("../../utils/createLog");

module.exports = {
    name: "hane-guncelle",
    description: "Hane adını değiştirir",
    options: [
        { name: "id", type: 4, description: "Güncellenecek hane ID", required: true },
        { name: "isim", type: 3, description: "Yeni hane adı", required: true }
    ],

    callback: async (client, interaction) => {
        const { Hane } = require("../../database/models");
        const id = interaction.options.getInteger("id");
        const newName = interaction.options.getString("isim");

        const hane = await Hane.findByPk(id);

        if (!hane) {
            const embed = createEmbed({
                client,
                title: "Hane Bulunamadı",
                description: `ID: ${id} ile bir hane bulunamadı ❌`,
                color: "#E74C3C"
            });
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await hane.update({ name: newName });

        const embed = createEmbed({
            client,
            title: "Hane Güncellendi",
            description: `Hane başarıyla güncellendi ✅`,
            fields: [
                { name: "Yeni Hane Adı", value: newName, inline: true },
                { name: "Hane ID", value: id.toString(), inline: true }
            ],
            color: "#2ECC71"
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
        await createLog({
    action: `Hane güncellendi: ${hane.name} → ${newName} (ID: ${hane.id})`,
    userId: interaction.user.id
});
    }
};
