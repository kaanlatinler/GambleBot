
module.exports = {
    name: "ping",
    description: "Replies with Pong!",
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
    }
}