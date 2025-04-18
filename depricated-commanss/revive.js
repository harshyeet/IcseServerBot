const { SlashCommandBuilder } = require('discord.js');
const Database = require('../database');

const cooldown = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('revive')
        .setDescription('Ping the revive chat role'),

    async execute(interaction) {
        const userId = interaction.user.id;
        console.log('User ID:', userId); // Debugging log

        const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');
        console.log('Is Admin:', isAdmin); // Debugging log

        let trustedUsers;

        try {
            trustedUsers = await Database.getTrustedUsers();
            console.log('Trusted users:', trustedUsers); // Debugging log
        } catch (error) {
            console.error('Error fetching trusted users:', error);
            return interaction.reply({ content: 'An error occurred while checking permissions.', ephemeral: true });
        }

        if (!isAdmin && (!trustedUsers || !trustedUsers.includes(userId))) {
            console.log('Permission denied for user:', userId); // Debugging log
            return interaction.reply({ content: 'You are not allowed to use this command.', ephemeral: true });
        }

        const lastUsed = cooldown.get('revive') || 0;
        const now = Date.now();
        console.log('Cooldown check:', { lastUsed, now }); // Debugging log

        if (!isAdmin && now - lastUsed < 1.5 * 60 * 60 * 1000) {
            console.log('Command on cooldown for user:', userId); // Debugging log
            return interaction.reply({ content: 'This command is on cooldown.', ephemeral: true });
        }

        cooldown.set('revive', now);
        console.log('Cooldown set for revive command'); // Debugging log

        await interaction.reply({
            content: '<@&1348626799311192074> Revive chat!',
            allowedMentions: { roles: ['1348626799311192074'] }
        });

        setTimeout(() => {
            cooldown.delete('revive');
            console.log('Cooldown cleared for revive command'); // Debugging log
        }, 1.5 * 60 * 60 * 1000);
    }
};
