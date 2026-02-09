const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const createEmbed = require("../../utils/createEmbed");
const createLog = require("../../utils/createLog");

module.exports = {
    name: "kayit-ticket",
    description: "Kayıt ticketi oluşturur",
    callback: async(client, interaction) => {
        const embed = createEmbed({
            client,
            title: "⚔️ Prusya Krallığı – Orduya Katılım",
            description: `👑 Prusya Krallığı sizi selamlar.

Bannerlord ordusuna katılmak isteyen asker adayları,
aşağıdaki buton ile resmî kayıt dosyanızı başlatabilirsiniz.

⚠️ Disiplin ve sadakat esastır.
Prusya Askerî Kayıt Bürosu
`,
thumbnail: "https://cdn.discordapp.com/attachments/1461325957964103711/1470203601069539338/tenor.gif?ex=698b1a0d&is=6989c88d&hm=bf9fc03e37d295aea6112ccfbaf2b282280a7733e454f9bf86d777f731f50ca3&",
            color: "#3498DB"
        });

        const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("ticket_kayit")
                    .setLabel("🎖️ Orduya Katıl")
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });

        await createLog({
            action: `Kayıt ticketi oluşturuldu.`,
            userId: interaction.user.id
        });
    }
};
