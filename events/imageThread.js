const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.channel.id !== '1355225994046476579' || message.author.bot) return;

        if (!message.attachments.size) {
            return message.delete();
        }

        const thread = await message.startThread({ name: `Discussion - ${message.author.username}` });
        await message.react('👍');

        const filter = (reaction, user) => reaction.emoji.name === '👍' && !user.bot;
        const collector = message.createReactionCollector({ filter, time: 86400000 });

        collector.on('collect', async (reaction) => {
            if (reaction.count >= 6) {
                const hallOfShame = message.guild.channels.cache.get('1328642870176907266');
                if (hallOfShame) {
                    hallOfShame.send(`Submitted by <@${message.author.id}>:\n${message.content}\n${message.attachments.first()?.url}`);
                }
                collector.stop();
            }
        });
    }
};
