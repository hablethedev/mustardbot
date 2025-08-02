const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Map();

function loadCommands(dir = path.join(__dirname, 'commands')) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            loadCommands(fullPath);
        } else if (file.name.endsWith('.js')) {
            const command = require(fullPath);
            if (command.name && command.execute) {
                client.commands.set(command.name, command);
                console.log(`[LOAD] Command loaded: ${command.name}`);
            }
        }
    }
}

loadCommands();

const devRoles = [
    '1401229080031924374',
    '1401231015397298277',
    '1401227837825876078',
];

client.once('ready', () => {
    console.log(`[SUCCESS] Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('mm!') || message.author.bot) return;

    const args = message.content.slice(3).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) {
        return message.reply('Command not found.');
    }

    if (command.category === 'dev') {
        if (!message.member.roles.cache.some(role => devRoles.includes(role.id))) {
            return message.reply('You don\'t have permission to use this command!!!!!!!!!!!!!!!!!!!!');
        }
    }

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error("[ERROR] " + error);
        message.reply('There was an error executing that command!!!!!!!!!!!!!!!!!!!!!');
    }
});

client.login(process.env.TOKEN);
