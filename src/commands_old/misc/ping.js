
module.exports = {
    name: "ping",
    description: "Replies with Pong!",
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const sent = await interaction.fetchReply();
        const roundTrip = sent.createdTimestamp - interaction.createdTimestamp;
        const wsPing = client.ws.ping;

        await interaction.editReply(
            `🏓 Pong!\n` +
            `Bot gecikmesi: ${roundTrip}ms\n` +
            `WebSocket: ${wsPing}ms`
        );
    }
};
