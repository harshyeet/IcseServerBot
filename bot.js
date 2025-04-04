require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const database = require('./database'); 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.database = database; 
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    const activities = [
        { name: 'with your mom', type: 0 },
        { name: 'in BTW spam', type: 5 }, 
        { name: 'Gay Sex', type: 1, url: 'https://www.twitch.tv/caseoh_' },
        { name: 'you procrastinate', type: 3 },
        { name: 'with Varun', type: 0 }, 
        { name: 'Bhojpuri Songs', type: 2 } 
    ];

    function changeActivity() {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.name, { type: activity.type, url: activity.url });
    }

    changeActivity();
    setInterval(changeActivity, Math.floor(Math.random() * (480000 - 300000) + 300000)); // Change every 5-8 minutes
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
    }
});

client.on('threadCreate', async (thread) => {
    const tagRoleMap = {
        '1355415208197357668': '1355220862583836854',
        '1355415290879414333': '1355220908553404516',
        '1355415483293241434': '1355220935619252284',
        '1355415387289948212': '1355225619536810016',
        '1355416344119611525': '1355220973493817466'
    };

    if (thread.appliedTags.length > 1) {
        try {
            await thread.delete();
            const user = await client.users.fetch(thread.ownerId);
            if (user) {
                await user.send("Your post was deleted because you selected more than one tag. Please create a new post with only one tag.");
            }
        } catch (error) {
            console.error("Failed to delete thread or DM user:", error);
        }
        return;
    }

    const appliedTag = thread.appliedTags.find(tag => tagRoleMap[tag]);
    if (appliedTag) {
        const roleId = tagRoleMap[appliedTag];
        try {
            await thread.send({
                content: `<@&${roleId}> Help needed!`,
                allowedMentions: { roles: [roleId] } 
            });
        } catch (error) {
            console.error("Failed to send role mention in thread:", error);
        }
    }
});

client.login(process.env.TOKEN);
