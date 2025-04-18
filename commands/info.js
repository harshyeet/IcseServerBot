const os = require('os');
const { SlashCommandBuilder } = require('discord.js');

function formatUptime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Shows bot stats like ping, uptime, RAM, storage, etc.'),

    async execute(interaction, client) {
        const ping = client.ws.ping;
        const uptime = formatUptime(process.uptime());
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
        const totalMem = os.totalmem() / 1024 / 1024;
        const cpuCount = os.cpus().length;

        await interaction.reply({
            embeds: [{
                title: '📊 Bot Info',
                color: 0x00ff99,
                fields: [
                    { name: '📶 Ping', value: `${ping}ms`, inline: true },
                    { name: '⏱ Uptime', value: uptime, inline: true },
                    { name: '🧠 RAM (Used)', value: `${memoryUsage.toFixed(2)} MB`, inline: true },
                    { name: '💾 RAM (Total)', value: `${totalMem.toFixed(2)} MB`, inline: true },
                    { name: '💿 CPU Cores', value: `${cpuCount}`, inline: true }
                ],
                timestamp: new Date()
            }]
        });
    }
};
