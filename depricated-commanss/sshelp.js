const { SlashCommandBuilder } = require('discord.js');

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sshelp')
        .setDescription('Pings the Social Science Helper role'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const cooldownTime = 15 * 60 * 1000;
        
        if (cooldowns.has(userId)) {
            const expiration = cooldowns.get(userId);
            if (Date.now() < expiration) {
                return interaction.reply({ content: 'You can use this command again later.', ephemeral: true });
            }
        }

        cooldowns.set(userId, Date.now() + cooldownTime);
        setTimeout(() => cooldowns.delete(userId), cooldownTime);

        await interaction.reply({
            content: '<@&1355220935619252284> SST helper needed!',
            allowedMentions: { roles: ['1355220935619252284'] }});
        }
};
