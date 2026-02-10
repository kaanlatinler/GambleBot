const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const createEmbed = require("../../utils/createEmbed");
const createLog = require("../../utils/createLog");
const {
  Hane,
  Ticket,
  TicketTranscript,
  User,
} = require("../../database/models");
const { ValidationErrorItemOrigin } = require("sequelize");
const { ticketCategory } = require("../../../config.json").categories;
const { moderatorRoles, defaultRoles } = require("../../../config.json").roles;
const { logChannel } = require("../../../config.json").channels;

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  /* ================== TICKET OLUŞTUR ================== */
  if (interaction.customId === "ticket_kayit") {
    const user = interaction.user;

    let ticketNo = await Ticket.count();
    const existingTicket = await Ticket.findOne({
      where: { discordId: user.id, status: 1 },
    });

    if (existingTicket) {
      let embed = createEmbed({
        client,
        title: "❌ Zaten Açık Bir Ticketin Var",
        description:
          "Aynı anda sadece **1 adet kayıt ticketi** açabilirsin.\n\nLütfen mevcut ticketini kapat.",
        color: "#E74C3C",
        thumbnail: interaction.user.displayAvatarURL(),
      });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    await createLog({
      action: `Ticket oluşturuldu: ${interaction.user.tag} (${interaction.user.id})`,
      userId: interaction.user.id,
    });

    const guild = interaction.guild;

    const MOD_ROLE_IDS = moderatorRoles; // 🔴 DEĞİŞTİR
    const CATEGORY_ID = ticketCategory; // 🔴 DEĞİŞTİR

    const modRoles = MOD_ROLE_IDS.map((roleId) =>
      guild.roles.cache.get(roleId),
    ).filter((role) => role !== undefined);
    if (modRoles.length === 0) {
      return interaction.reply({
        content: "❌ Yetkili rol bulunamadı.",
        ephemeral: true,
      });
    }

    const channel = await guild.channels.create({
      name: `kayit-${ticketNo}`.toLowerCase(),
      type: ChannelType.GuildText,
      parent: CATEGORY_ID,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        ...modRoles.map((role) => ({
          id: role.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        })),
      ],
    });
    const gateGuard = guild.roles.cache.get(moderatorRoles[0]);
    embed = createEmbed({
      client,
      title: "⚔️ Prusya Krallığı – Kayıt Dosyası",
      description: `
👑 **Hoş geldin ${user}**

Bu kanal senin **resmî kayıt dosyandır**.

📌 Lütfen aşağıdaki bilgileri eksiksiz doldur:
• Ad – Soyad
• Yaş
• Bannerlord saat
• Oyun içi isim
• Daha önce bulunduğun sunucular

🛡️  Yetkili: <@&${gateGuard.id}> .
        `,
      thumbnail: user.displayAvatarURL(),
      color: "#3498DB",
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("kayit_modal_open")
        .setLabel("📝 Kayıt Ol")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel("🔒 Ticket Kapat")
        .setStyle(ButtonStyle.Danger),
    );

    await channel.send({
      embeds: [embed],
      allowedMentions: { roles: moderatorRoles },
      components: [row],
    });

    ticketNo += 1;

    await Ticket.create({
      ticketNo: ticketNo,
      discordId: user.id,
      status: 1,
      channelId: channel.id,
      created_at: new Date(),
    });

    return interaction.reply({
      content: `✅ Ticket oluşturuldu: ${channel}`,
      ephemeral: true,
    });
  }

  /* ================== KAYIT MODAL AÇ ================== */
  if (interaction.customId === "kayit_modal_open") {
    const modal = new ModalBuilder()
      .setCustomId("kayit_modal1")
      .setTitle("Kayıt Formu (1/2)");

    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("name")
          .setLabel("Ad")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("lastname")
          .setLabel("Soyad")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("age")
          .setLabel("Yaş")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("steam_epic")
          .setLabel("Steam ID veya Epic ID")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("referencesUsers")
          .setLabel("Referans İsimleri (varsa)")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false),
      ),
    );
    //steam id veya epic
    //referans isim

    return interaction.showModal(modal);
  }

  /** Transcript Button */

  if (interaction.customId === "transcript_button") {
    /* ===== YETKİ KONTROL ===== */
    if (
      !interaction.member.roles.cache.some((role) =>
        moderatorRoles.includes(role.id),
      )
    ) {
      return interaction.reply({
        content: "❌ Bu işlemi gerçekleştirmek için yetkiniz yok.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    /* ===== MESAJLARI ÇEK ===== */
    let messages = [];
    let lastId;

    while (true) {
      const fetched = await interaction.channel.messages.fetch({
        limit: 100,
        before: lastId,
      });

      if (fetched.size === 0) break;

      messages.push(...fetched.values());
      lastId = fetched.last().id;
    }

    messages = messages.reverse();

    /* ===== TRANSCRIPT METNİ ===== */
    const transcriptText = messages
      .map(
        (m) =>
          `[${m.createdAt.toLocaleString("tr-TR")}] ${m.author.tag}: ${m.content || "[Embed / Dosya]"}`,
      )
      .join("\n");

    /* ===== TXT DOSYA ===== */
    const buffer = Buffer.from(transcriptText, "utf-8");

    /* ===== TICKET BUL ===== */
    const ticket = await Ticket.findOne({
      where: { channelId: interaction.channel.id, status:1 },
    });


    /* ===== DB KAYIT ===== */
    await TicketTranscript.create({
      ticketId: ticket?.id || null,
      createdBy: interaction.user.id,
      content: transcriptText,
    });

    /* ===== LOG KANALI ===== */
    const logCh = interaction.guild.channels.cache.get(logChannel);
    if (!logCh) {
      return interaction.editReply("❌ Log kanalı bulunamadı.");
    }

    /* ===== EMBED ===== */
    const embed = createEmbed({
      client,
      title: "📄 Ticket Transcript",
      description: `
📌 **Kanal:** ${interaction.channel.name}
👤 **Oluşturan:** ${interaction.user}
🕒 **Tarih:** <t:${Math.floor(Date.now() / 1000)}:F>

📨 **Toplam Mesaj:** ${messages.length}
📎 **Transcript:** TXT dosyası eklendi
        `,
      color: "#95A5A6",
      thumbnail: interaction.guild.iconURL(),
    });

    /* ===== GÖNDER ===== */
    await logCh.send({
      embeds: [embed],
      files: [
        {
          attachment: buffer,
          name: `transcript-${interaction.channel.name}.txt`,
        },
      ],
    });

    return interaction.editReply(
      "✅ Transcript başarıyla oluşturuldu ve gönderildi.",
    );
  }

  /* ================== TICKET KAPAT ================== */
  if (interaction.customId === "ticket_close") {
    if (
      !interaction.member.roles.cache.some((role) =>
        moderatorRoles.includes(role.id),
      )
    ) {
      return interaction.reply({
        content: "❌ Bu işlemi gerçekleştirmek için yetkiniz yok.",
        ephemeral: true,
      });
    }

    await Ticket.update(
      { status: 0, closed_at: new Date() },
      { where: { discordId: interaction.user.id, status: 1 } },
    );
    await createLog({
      action: `Ticket kapatıldı: ${interaction.user.tag} (${interaction.user.id})`,
      userId: interaction.user.id,
    });

    const embed = createEmbed({
      client,
      title: "🔒 Ticket Kapatıldı",
      description: `
✅ Ticket başarıyla kapatıldı.
👑 Prusya Krallığı'na katıldığın için teşekkürler!`,
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("transcript_button")
        .setLabel("🗒️ Transcript")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`delete_ticket_button_${interaction.channel.id}`)
        .setLabel("🗑️ Ticket Sil")
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.channel.send({ embeds: [embed], components: [row] });

    // await interaction.reply({
    //     content: "🔒 Ticket 5 saniye içinde kapatılıyor...",
    //     ephemeral: true
    // });

    // setTimeout(() => {
    //     interaction.channel.delete().catch(() => {});
    // }, 5000);
  }

  /* ================== TICKET SİL ================== */
  if (interaction.customId.startsWith("delete_ticket_button_")) {
    /* === YETKİ KONTROL === */
    if (
      !interaction.member.roles.cache.some((role) =>
        moderatorRoles.includes(role.id),
      )
    ) {
      return interaction.reply({
        content: "❌ Bu işlemi gerçekleştirmek için yetkiniz yok.",
        ephemeral: true,
      });
    }

    /* === BU KANALA AİT TICKET === */
    const ticket = await Ticket.findOne({
      where: { channelId: interaction.channel.id },
    });

    if (!ticket) {
      return interaction.reply({
        content: "❌ Bu kanal bir ticket ile eşleşmiyor.",
        ephemeral: true,
      });
    }

    /* === AÇIK MI? === */
    if (ticket.status === 1) {
      return interaction.reply({
        content: "❌ Ticket kapatılmadan silinemez.",
        ephemeral: true,
      });
    }

    /* === TRANSCRIPT VAR MI? === */
    const transcript = await TicketTranscript.findOne({
      where: { ticketId: ticket.id },
    });

    if (!transcript) {
      return interaction.reply({
        content: "❌ Ticket silinmeden önce transcript oluşturulmalıdır.",
        ephemeral: true,
      });
    }

    /* === SİL === */
    await interaction.reply({
      content: "🗑️ Ticket 5 saniye içinde siliniyor...",
      ephemeral: true,
    });

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);
  }

  /* ============================= */
  /* HANE BUTONLARI */
  /* ============================= */
  if (!interaction.customId.startsWith("assign_hane_")) return;

  if (
    !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
  ) {
    return interaction.reply({
      content: "❌ Bu işlemi gerçekleştirmek için yetkiniz yok.",
      ephemeral: true,
    });
  }

//   await interaction.deferReply({ ephemeral: true });

  const haneId = interaction.customId.split("_")[2];

  /* ===== HANE ===== */
  const hane = await Hane.findByPk(haneId);
  if (!hane) {
    return interaction.editReply({ content: "❌ Hane bulunamadı." });
  }

  /* ===== TICKET ===== */
  const ticket = await Ticket.findOne({
    where: { channelId: interaction.channel.id, status: 1 },
  });

  if (!ticket) {
    return interaction.editReply({
      content: "❌ Bu kanal bir ticket ile ilişkilendirilemedi.",
    });
  }

  /* ===== TICKET SAHİBİ ===== */
  const targetMember = await interaction.guild.members.fetch(ticket.discordId);

  /* ===== ROL ===== */
  const role = interaction.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === hane.name.toLowerCase(),
  );

  if (!role) {
    return interaction.editReply({
      content: `❌ **${hane.name}** adlı rol bulunamadı.`,
    });
  }

  /* ===== BOT ===== */
  const botMember = await interaction.guild.members.fetch(
    interaction.client.user.id,
  );

  /* ===== ESKİ HANE ROLLERİNİ KALDIR ===== */
  const allHanes = await Hane.findAll();
  const haneRoleNames = allHanes.map((h) => h.name.toLowerCase());

  const rolesToRemove = targetMember.roles.cache.filter(
    (r) =>
      haneRoleNames.includes(r.name.toLowerCase()) &&
      r.position < botMember.roles.highest.position,
  );

  if (rolesToRemove.size) {
    await targetMember.roles.remove(rolesToRemove);
  }

  const rolesToRemove2 = targetMember.roles.cache
    .filter(role => role.id !== interaction.guild.id); // @everyone hariç

await targetMember.roles.remove(rolesToRemove2);

  /* ===== YENİ ROLLER ===== */
  await targetMember.roles.add(defaultRoles);
  await targetMember.roles.add(role);

  /* ===== DB ===== */
  await User.upsert({
    discord_id: targetMember.id,
    username: targetMember.user.username,
    hane_id: hane.id,
  });

  client.tempUserData ??= {};

client.tempUserData[targetMember.id] = {
  name: targetMember.user.username,
  steamOrEpicId: null,
  id: targetMember.id,
};


  const modal = new ModalBuilder()
  .setCustomId(`nameChangeModal_`)
  .setTitle("İsim Değişikliği");


    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("name")
          .setLabel("Ad")
          .setStyle(TextInputStyle.Short)
          .setRequired(true),
      )
    );
    //steam id veya epic
    //referans isim

    return interaction.showModal(modal);
  
};
