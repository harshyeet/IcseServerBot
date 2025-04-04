const { SlashCommandBuilder } = require('discord.js');
const Database = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trust')
        .setDescription('Add a user to the trusted list for /revive')
        .addUserOption(option => option.setName('user').setDescription('User to trust').setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return;
        const user = interaction.options.getUser('user');
        
        await Database.addTrustedUser(user.id);
        await interaction.reply({ content: `<@${user.id}> is now trusted for /revive.`, ephemeral: true });
    }
};
