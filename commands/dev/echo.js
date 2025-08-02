module.exports = {
    name: 'echo',
    category: 'dev',
    execute(message, args) {
        if (args.length === 0) {
            return message.reply('you need to say something');
        }

        const textToEcho = args.join(' ');
        message.channel.send(textToEcho);
    }
};
