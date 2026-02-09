const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    name: "kayit-form",
    description: "Kayıt formunu doldurmanızı sağlar",

    async callback(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const modal = new ModalBuilder()
            .setCustomId("kayit_modal1")
            .setTitle("Kayıt Formu (1/2)");

        const name = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Adınız")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const lastname = new TextInputBuilder()
            .setCustomId("lastname")
            .setLabel("Soyadınız")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const age = new TextInputBuilder()
            .setCustomId("age")
            .setLabel("Yaşınız")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

       

        modal.addComponents(
            new ActionRowBuilder().addComponents(name),
            new ActionRowBuilder().addComponents(lastname),
            new ActionRowBuilder().addComponents(age),
        );

        await interaction.showModal(modal);
    }
};
