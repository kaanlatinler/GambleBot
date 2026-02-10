const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { User,Hane } = require("../../database/models");
const createEmbed = require("../../utils/createEmbed");

const {logChannel} = require("../../../config.json").channels;
const {moderatorRoles} = require("../../../config.json").roles;

module.exports = async (client, interaction) => {

    /* ================= DUYURU ================= */
    if (interaction.isModalSubmit() && interaction.customId === "duyuru_modal") {
        return handleDuyuruModal(client, interaction);
    }

    /* =============== KAYIT MODAL 1 =============== */
    if (interaction.isModalSubmit() && interaction.customId === "kayit_modal1") {
        return handleKayitModal1(client, interaction);
    }

    /* =============== DEVAM BUTONU =============== */
    if (interaction.isButton() && interaction.customId === "kayit_devam") {
        return handleKayitDevam(client, interaction);
    }

    /* =============== KAYIT MODAL 2 =============== */
    if (interaction.isModalSubmit() && interaction.customId === "kayit_modal2") {
        return handleKayitModal2(client, interaction);
    }

    /* =============== İSİM DEĞİŞTİRME MODAL =============== */
    if (interaction.isModalSubmit() && interaction.customId.startsWith("nameChangeModal_")) {
        const firstKey = Object.keys(client.tempUserData)[0];
        const userId = client.tempUserData[firstKey].id;
        return changeNameModal(client, interaction, userId);
}

};

/* ================= DUYURU ================= */

async function handleDuyuruModal(client, interaction) {

    const embed = createEmbed({
        client,
        title: interaction.fields.getTextInputValue("baslik"),
        description: interaction.fields.getTextInputValue("aciklama"),
        thumbnail: interaction.user.displayAvatarURL({ dynamic: true }),
        fields: [
            { name: "📅 Tarih", value: interaction.fields.getTextInputValue("tarih"), inline: true },
            { name: "⏰ Saat", value: interaction.fields.getTextInputValue("saat"), inline: true },
            { name: "🔗 Linkler", value: interaction.fields.getTextInputValue("linkler") || "Yok", inline: false }
        ],
        color: "#5865F2",
        footer: `Duyuru Oluşturan: ${interaction.user.username}`
    });

    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: "✅ Duyuru gönderildi.", ephemeral: true });
}

/* ================= KAYIT MODAL 1 ================= */

async function handleKayitModal1(client, interaction) {

    const exists = await User.findOne({
        where: { discord_id: interaction.user.id }
    });

    if (exists) {
        const embed = createEmbed({
            client,
            title: "❌ Kayıt Hatası",
            description: "Zaten kayıtlısın.",
            thumbnail: interaction.user.displayAvatarURL({ dynamic: true }),
            color: "#E74C3C"
        });

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    client.tempKayitData ??= {};
    client.tempKayitData[interaction.user.id] = {
        name: interaction.fields.getTextInputValue("name"),
        lastname: interaction.fields.getTextInputValue("lastname"),
        age: interaction.fields.getTextInputValue("age"),
        steamOrEpicId: interaction.fields.getTextInputValue("steam_epic"),
        referencesUsers: interaction.fields.getTextInputValue("referencesUsers")
    };

    // 🔐 SADECE RAKAM KONTROLÜ
    if (!/^\d+$/.test(client.tempKayitData[interaction.user.id].steamOrEpicId)) {
        return interaction.reply({
            content: "❌ Steam / Epic ID **sadece rakamlardan oluşmalıdır**.",
            ephemeral: true
        });
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("kayit_devam")
            .setLabel("Devam Et")
            .setStyle(ButtonStyle.Primary)
    );

    const embed = createEmbed({
        client,
        title: "✅ İlk Adım Tamamlandı",
        description: "Devam etmek için aşağıdaki butona bas.",
        thumbnail: interaction.user.displayAvatarURL({ dynamic: true }),
        color: "#2ECC71"
    });

    return interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    });
}

/* ================= BUTON → MODAL 2 ================= */

async function handleKayitDevam(client, interaction) {

    const modal = new ModalBuilder()
        .setCustomId("kayit_modal2")
        .setTitle("Kayıt Formu (2/2)");

    modal.addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId("bannerlord_hours")
                .setLabel("Bannerlord Saati")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId("bannerlord_name")
                .setLabel("Oyun İçi İsim")
                .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId("old_servers")
                .setLabel("Eski Sunucular")
                .setStyle(TextInputStyle.Paragraph)
        )
    );

    // Modal gösterme
    return interaction.showModal(modal);
}

/* ================= MODAL 2 SUBMIT ================= */

async function handleKayitModal2(client, interaction) {

    const data = client.tempKayitData[interaction.user.id];
    if (!data) return;

    await User.create({
        discord_id: interaction.user.id,
        username: interaction.user.username,
        name: data.name,
        lastname: data.lastname,
        age: data.age,
        bannerlord_hours: interaction.fields.getTextInputValue("bannerlord_hours"),
        bannerlord_name: interaction.fields.getTextInputValue("bannerlord_name"),
        old_servers: interaction.fields.getTextInputValue("old_servers"),
        steamOrEpicId: data.steamOrEpicId,
        referencesUsers: data.referencesUsers
    });

    delete client.tempKayitData[interaction.user.id];

    const embed = createEmbed({
        client,
        title: "🎉 Kayıt Tamamlandı",
        description: "Başarıyla kayıt oldun.",
        thumbnail: interaction.user.displayAvatarURL({ dynamic: true }),
        color: "#2ECC71",
        footer: `Kayıt Eden: ${interaction.user.username}`
    });

    const infoEmbed = createEmbed({
        client,
        title: "Yeni Kayıt Oldu",
        description: `${interaction.user} adlı kullanıcı kayıt oldu.`,
        thumbnail: interaction.user.displayAvatarURL({ dynamic: true }),
        fields: [
            { name: "🙍‍♂️ Ad Soyad", value: `${data.name} ${data.lastname}`, inline: true },
            { name: "⏰ Yaş", value: data.age, inline: true },
            { name: "⚔️ Bannerlord Saati", value: interaction.fields.getTextInputValue("bannerlord_hours") || "Yok", inline: false },
            { name: "🛡️ Oyun İçi İsim", value: interaction.fields.getTextInputValue("bannerlord_name") || "Yok", inline: false },
            { name: "🏰 Eski Sunucular", value: interaction.fields.getTextInputValue("old_servers") || "Yok", inline: false },
            { name: "🎮 Steam/Epic ID", value: data.steamOrEpicId || "Yok", inline: false },
            { name: "📋 Referanslar", value: data.referencesUsers || "Yok", inline: false }
        ],
        color: "#3498DB"
    });

    const hanes = await Hane.findAll();
    
    const row = new ActionRowBuilder().addComponents(
        ...hanes.map(hane =>
            new ButtonBuilder()
                .setCustomId(`assign_hane_${hane.id}`)
                .setEmoji(`${hane.icon}`)
                .setStyle(ButtonStyle.Primary))
    );

   await client.channels.cache.get(logChannel).send({
    embeds: [infoEmbed],
});

    return interaction.reply({ embeds: [infoEmbed], components: [row], ephemeral: false });
}

async function changeNameModal(client, interaction, userId) {
    let newName = interaction.fields.getTextInputValue("name").trim();

    newName = `🗡《 Ⅵ 》 ${newName}`

    const member = await interaction.guild.members.fetch(userId);

    await member.setNickname(newName).catch(()=>{});

    return interaction.reply({
        content: `✅ İsim başarıyla "${newName}" olarak değiştirildi.`,
        ephemeral: true
    });
}