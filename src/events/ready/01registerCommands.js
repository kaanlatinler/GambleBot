const { Test_Server } = require("../../../config.json");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {
  try {
    const localCommands = await getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, Test_Server);

    for (const command of localCommands) {

      // ⚠️ Eski sistem koruması
      if (!command.name || !command.description) {
        console.log(`⏩ Skipped invalid command file`);
        continue;
      }

      const { name, description, options } = command;

      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      // 🗑 DELETE
      if (existingCommand && command.deleted) {
        await applicationCommands.delete(existingCommand.id);
        console.log(`🗑 Deleted command "${name}"`);
        continue;
      }

      // 🔁 UPDATE
      if (existingCommand) {
        if (areCommandsDifferent(existingCommand, command)) {
          await applicationCommands.edit(existingCommand.id, {
            name,
            description,
            options: options ?? []
          });
          console.log(`🔁 Edited command "${name}"`);
        }
      }
      // ➕ CREATE
      else {
        if (command.deleted) {
          console.log(`⏩ Skipped deleted command "${name}"`);
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options: options ?? []
        });
        console.log(`👍 Registered command "${name}"`);
      }
    }
  } catch (error) {
    console.error("❌ Command register error:", error);
  }
};
