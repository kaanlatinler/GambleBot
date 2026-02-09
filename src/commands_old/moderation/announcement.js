// src/commands/admin/duyuru.js
const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = {
  name: 'duyuru',
  description: 'Yeni bir etkinlik duyurusu oluşturur',

  callback: async (client, interaction) => {
    try {
      const modal = new ModalBuilder()
        .setCustomId('announcement_step_1')
        .setTitle('Duyuru 1/2');

      const titleInput = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('Başlık')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const descInput = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Açıklama')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(descInput)
      );

      await interaction.showModal(modal);
    } catch (err) {
      console.error('❌ Duyuru komutu hata:', err);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Modal açılamadı.',
          ephemeral: true
        });
      }
    }
  }
};
