const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    name: "duyuru",
    description: "Yeni bir etkinlik duyurusu oluşturur",

    async callback(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const modal = new ModalBuilder()
            .setCustomId("duyuru_modal")
            .setTitle("Duyuru Oluştur");

        const baslik = new TextInputBuilder()
            .setCustomId("baslik")
            .setLabel("Duyuru Başlığı")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const aciklama = new TextInputBuilder()
            .setCustomId("aciklama")
            .setLabel("Duyuru Açıklaması")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const tarih = new TextInputBuilder()
            .setCustomId("tarih")
            .setLabel("Tarih (01-02-2026)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const saat = new TextInputBuilder()
            .setCustomId("saat")
            .setLabel("Saat (18:30)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const linkler = new TextInputBuilder()
            .setCustomId("linkler")
            .setLabel("Linkler (opsiyonel)")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(baslik),
            new ActionRowBuilder().addComponents(aciklama),
            new ActionRowBuilder().addComponents(tarih),
            new ActionRowBuilder().addComponents(saat),
            new ActionRowBuilder().addComponents(linkler),
        );

        await interaction.showModal(modal);
    }
};
