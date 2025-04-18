const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rotate')
        .setDescription('Rotates the roles Meth Cook and Skibidi')
        .setDefaultMemberPermissions(0),
    
    async execute(interaction) {
        if (interaction.user.id !== '1350041920705007657') return;

        const guild = interaction.guild;
        const methCook = guild.roles.cache.get('1343106209347145820');
        const skibidi = guild.roles.cache.get('1353413967044939938');

        if (!methCook || !skibidi) {
            return interaction.reply({ content: 'Roles not found.', ephemeral: true });
        }

        try {
            const methPosition = methCook.position;
            const skibidiPosition = skibidi.position;

            await methCook.setPosition(skibidiPosition);
            await skibidi.setPosition(methPosition);

            await interaction.reply({ content: 'Roles rotated successfully!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to rotate roles.', ephemeral: true });
        }
    }
};
