const { SlashCommandBuilder } = require('discord.js');
const Database = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untrust')
        .setDescription('Remove a user from the trusted list for /revive')
        .addUserOption(option => option.setName('user').setDescription('User to untrust').setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return;
        const user = interaction.options.getUser('user');
        
        await Database.removeTrustedUser(user.id);
        await interaction.reply({ content: `<@${user.id}> is no longer trusted for /revive.`, ephemeral: true });
    }
};
