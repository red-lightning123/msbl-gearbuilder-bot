const BOT_TOKEN = /* your bot token here */;
const GUILD_ID = /* your guild ID here */;
const CLIENT_ID = /* your client ID here */;

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const gearrulesCommand = new SlashCommandBuilder()
	.setName('gearrules')
	.setDescription('Manual for /gear');
const gearCommand = new SlashCommandBuilder()
	.setName('gear')
	.setDescription('Gear Build Constructor')
	.addIntegerOption(option => option
		.setName('strength')
		.setDescription('Desired strength stat')
		.setRequired(true)
		)
	.addIntegerOption(option => option
		.setName('speed')
		.setDescription('Desired speed stat')
		.setRequired(true)
		)
	.addIntegerOption(option => option
		.setName('shooting')
		.setDescription('Desired shooting stat')
		.setRequired(true)
		)
	.addIntegerOption(option => option
		.setName('passing')
		.setDescription('Desired passing stat')
		.setRequired(true)
		)
	.addIntegerOption(option => option
		.setName('technique')
		.setDescription('Desired technique stat')
		.setRequired(true)
		)
	.addStringOption(option => option
		.setName('character')
		.setDescription('Character name')
		.setRequired(true)
		);

const commands = [
	gearrulesCommand,
	gearCommand
];

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

const fs = require('fs');
const MultiMap = require('multimap');

var gearsetsJson = fs.readFileSync('gearsets.json', 'utf-8');
const gearsetsArray = JSON.parse(gearsetsJson);
const gearsetsMMap = new MultiMap();
gearsetsArray.forEach(e => { gearsetsMMap.set(e["stats"], e["gear_selection"]); });

var charactersJson = fs.readFileSync('characters.json', 'utf-8');
const charactersArray = JSON.parse(charactersJson);
const charactersMap = new Map();
charactersArray.forEach(e => { charactersMap.set(e["name"], e["stats"]) });

function findGear(strength, speed, shooting, passing, technique, characterName) {
	const characterStats = charactersMap.get(characterName.toUpperCase());
	const characterStrength = characterStats[0];
	const characterSpeed = characterStats[1];
	const characterShooting = characterStats[2];
	const characterPassing = characterStats[3];
	const characterTechnique = characterStats[4];
	const deltaStatList = (strength - characterStrength) + ", " + (speed - characterSpeed) + ", " + (shooting - characterShooting) + ", " + (passing - characterPassing) + ", " + (technique - characterTechnique);
	return gearsetsMMap.get(deltaStatList);
}

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}. Ready.`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'gearrules') {
		await interaction.reply(
`The Basics

So, to start, you need to understand an important principle about gear: every single piece of gear increases one stat by 2 and decreases 1 stat by 2. There are 5 sets of gear, each set increases the same stat, and each piece in the set decreases a different stat. This means EVERY individual piece of gear that could exist under these restrictions, exists. The catch is that they're restricted to 1 gear type - you cant wear 2 helmets or 2 boots, so you have to get creative. So to start creating a build, you'll need to first decide your stats. Just go through every stat and pick a number that you want to have. Of course, there are restrictions:

Main Rules

1. Your total should be 63. Every character's base stats total to 63, and gear adds the same points it subtracts, so you must have 63 total points.
2. Each stat's base value is either even or odd for each character, and since you can only change one by jumps of 2, it has to stay that way.
3. You should not change any one stat too far off from it's base value - trying to do so would require you to equip multiple pieces of the same set, which restricts you heavily by requiring your subtractions to be heavily spread out across every stat.

To construct a build, input the command /gear followed by your desired character and stats using Discord's UI.`);
	}
	if (interaction.commandName === "gear") {
		const desiredStats = new Map();
		interaction.options.data.forEach(option => { desiredStats.set(option["name"], option["value"]); });
		const strength = desiredStats.get("strength");
		const speed = desiredStats.get("speed");
		const shooting = desiredStats.get("shooting");
		const passing = desiredStats.get("passing");
		const technique = desiredStats.get("technique");
		const characterName = desiredStats.get("character");
		var reply = "";
		if (charactersMap.has(characterName.toUpperCase())) {
			const gearCombinations = findGear(strength, speed, shooting, passing, technique, characterName);
			if (gearCombinations === undefined) {
				reply = "No gear combination was found for the desired stats and character. You might have broken a rule - make sure to check the rules using /gearrules!";
			} else if (gearCombinations.length === 1) {
				reply = `Your desired set is: ${gearCombinations[0]}`;
			} else {
				reply = "There are multiple gear sets that fit your criteria!\n";
				var setNumber = 1;
				gearCombinations.forEach(e => { reply += `Set no. ${setNumber} is: ${e}\n`; ++setNumber; });
			}
		} else {
			reply = `${characterName} is not in the game... not yet anyways!`;
		}
		await interaction.reply(reply);
	}
	console.log(`Handled /${interaction.commandName} command.`);
});

client.login(BOT_TOKEN);
