const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename_to_v')
        .setDescription('Replaces the first letter of everyone\'s nickname with V'),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) {
            return interaction.reply({ content: 'You need the "Manage Nicknames" permission to use this command.', ephemeral: true });
        }

        const members = await interaction.guild.members.fetch();

        let count = 0;
        for (const [_, member] of members) {
            if (!member.manageable || member.user.bot) continue; // Skip bots and unmanageable members

            const oldNick = member.nickname || member.user.username;
            const newNick = 'V' + oldNick.slice(1);

            if (newNick !== oldNick) {
                try {
                    await member.setNickname(newNick);
                    count++;
                } catch (error) {
                    console.error(`Could not change nickname for ${member.user.tag}:`, error);
                }
            }
        }

        await interaction.reply(`Renamed ${count} members successfully!`);
    }
};