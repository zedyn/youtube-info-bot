const { Events } = require('discord.js');

const { handleInformation } = require('../utils/functions');

module.exports = {
  name: Events.ClientReady,
  once: false,
  async execute(client) {
    console.clear();
    console.log('\x1b[32m', `[+] ${client.user.tag} (${client.user.id})`);

    setInterval(async () => {
      await handleInformation(client);
    }, 15000);
  },
};
