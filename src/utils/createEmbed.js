const { EmbedBuilder } = require("discord.js");

module.exports = ({
    client,
    title,
    description = "",
    color = "#2ECC71",
    thumbnail = null,
    fields = [],
    footer = "Developed by Orion",
    author = true
}) => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTimestamp();

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);

    // AUTHOR (opsiyonel)
    if (author && client?.user) {
        embed.setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        });
    }

    // THUMBNAIL
    if (typeof thumbnail === "string") {
        embed.setThumbnail(thumbnail);
    }

    // FIELDS (string garanti)
    if (Array.isArray(fields) && fields.length > 0) {
        embed.addFields(
            fields.map(f => ({
                name: String(f.name),
                value: String(f.value),
                inline: Boolean(f.inline)
            }))
        );
    }

    // FOOTER
    if (footer && client?.user) {
        embed.setFooter({
            text: footer,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        });
    }

    return embed;
};
