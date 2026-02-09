const createEmbed = require("../../utils/createEmbed");

module.exports = {
    name: "hane-sil",
    description: "Hane siler",
    options: [
        { name: "id", type: 4, description: "Silinecek hane ID", required: true }
    ],

    callback: async (client, interaction) => {
        const { Hane } = require("../../database/models");
        const id = interaction.options.getInteger("id");

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

        await hane.destroy();

        const embed = createEmbed({
            client,
            title: "Hane Silindi",
            description: `Hane başarıyla silindi ✅`,
            fields: [
                { name: "Silinen Hane", value: hane.name, inline: true },
                { name: "Hane ID", value: id.toString(), inline: true }
            ],
            color: "#F1C40F"
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
       await createLog({
           action: `Hane silindi: ${hane.name} (ID: ${hane.id})`,
           userId: interaction.user.id
       });
    }
};
