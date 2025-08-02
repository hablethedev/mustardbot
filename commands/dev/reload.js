const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'reload',
    category: 'dev',
    async execute(message, args, client) {
        const commandFolder = path.join(__dirname, '..');

        try {
            let count = 0;
            client.commands.clear();

            function reloadCommands(dir) {
                const files = fs.readdirSync(dir, { withFileTypes: true });
                for (const file of files) {
                    const fullPath = path.join(dir, file.name);
                    if (file.isDirectory()) {
                        reloadCommands(fullPath);
                    } else if (file.name.endsWith('.js')) {
                        delete require.cache[require.resolve(fullPath)];
                        const command = require(fullPath);
                        if (command.name && command.execute) {
                            client.commands.set(command.name, command);
                            count++;
                        }
                    }
                }
            }

            reloadCommands(commandFolder);
            message.reply(`Reloaded ${count} commands!!!!!!!!!!!!!!!!`);
        } catch (err) {
            console.error(err);
            message.reply('wtf did you do this time it didn\'t work');
        }
    }
};
