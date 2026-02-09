const { EmbedBuilder } = require("discord.js");
const createLog = require("../../utils/createLog");
const {defaultRoles} = require("../../../config.json").roles;

module.exports = async (client, interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (!interaction.customId.startsWith("hane_select_")) return;

    const { User, Hane } = require("../../database/models");

    const targetUserId = interaction.customId.split("_")[2];
    const selectedHaneId = interaction.values[0];

    const member = await interaction.guild.members.fetch(targetUserId);
    const targetUser = member.user;

    
    const hane = await Hane.findByPk(selectedHaneId);

    const [userData, created] = await User.findOrCreate({
        where: { discord_id: targetUserId },
        defaults: {
            username: targetUser.username,
            hane_id: hane.id
        }
    });

    const rolesToRemove = member.roles.cache
    .filter(role => role.id !== interaction.guild.id); // @everyone hariç

// await member.roles.remove(rolesToRemove);


    const role = interaction.guild.roles.cache.find(
    r => r.name.toLowerCase() === hane.name.toLowerCase()
);


    if (!created) {
        await userData.update({ hane_id: hane.id });
    }

       await createLog({
    action: created
        ? `Kullanıcı kayıt edildi: ${targetUser.username} (Hane: ${hane.name})`
        : `Kullanıcı hane güncellendi: ${targetUser.username} → ${hane.name}`,
    userId: interaction.user.id
});

    await member.roles.add(defaultRoles);
    await member.roles.add(role);

    // 🔥 REGISTER STİLİ EMBED
    const embed = new EmbedBuilder()
        .setColor(created ? "#2ECC71" : "#F1C40F")
        .setTitle(created ? "Registered" : "Registration Updated")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setDescription(
            created
                ? "You have been successfully registered! 🎉"
                : "User registration has been successfully updated! ✨"
        )
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
            { name: "Username", value: targetUser.username, inline: true },
            { name: "Hane", value: hane.name, inline: true }
        )
        .setTimestamp()
        .setFooter({
            text: "Developed by Orion",
            iconURL: client.user.displayAvatarURL()
        });

    await interaction.update({
        embeds: [embed],
        components: []
    });
};
