if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

import "reflect-metadata";
/* VK Bot: */
const VkBot = require('node-vk-bot-api');
/* Logger: */
import logger from './lib/Logger';
/* Core middlewares: */
import CatchErrors from "./common/middlewares/CatchErrors";
import InjectConnection from "./common/middlewares/InjectConnection";
import InjectPayloadJSON from "./common/middlewares/InjectPayloadJSON";
import InjectMessaging from "./common/middlewares/InjectMessaging";
import InjectLogger from "./common/middlewares/InjectLogger";
/* Custom middlewares */
import InjectUser from "./middlewares/InjectUser";
import InjectScene from "./middlewares/InjectScene";
import injectAPI from "./middlewares/InjectAPI";
import InjectMessageParser from "./middlewares/InjectMessageParser";
/* Database: */
import { createConnection, getConnection, getConnectionOptions } from "typeorm";
import { UserEntity } from "./entity/User.entity";
/* Config and VK API: */
import configuration from './common/config/configuration';
import api from './lib/API';
/* Scenes: */
import { HomeScene } from "./scenes/Home.scene";
/* Import constants: */
import { Scenes } from "./constants";
import InjectLoader from "./common/middlewares/InjectLoader";
import { UserRepository } from "./repositories/User.repository";
import InjectCommands from "./middlewares/InjectCommands";
import { ChatNLPScene } from "./scenes/ChatNLP.scene";
import { WebsiteAvailabilityScene } from "./scenes/WebsiteAvailability.scene";

const config: any = configuration();
const API = new api(config.apiToken);

// Init VkBot
const bot = new VkBot({
	token: config.apiToken,
});

// Starter function:
const main = async () => {
	const database = await getConnectionOptions();
	logger.info(`Using mysql config: ${JSON.stringify({...database})}`);
	try {
		await createConnection({
			...database,
			logging: true,
		});
		logger.info('Database connection has been established successfully.');
	}catch(e){
		logger.error(`Failed to connect database: ${e.stack}`);
		throw Error('Failed to connect database.');
	}

	const connection = getConnection();

	const userRepository = await connection.getRepository(UserEntity);
	const userRepositoryHandler = new UserRepository(userRepository);

	/* Core middleware: */
	bot.use(CatchErrors(logger));
	bot.use(InjectLogger(logger));
	bot.use(InjectLoader(logger)(
		{
			name: "userRepository",
			object: userRepository,
		},
		userRepositoryHandler,
	)());
	bot.use(InjectPayloadJSON);
	bot.use(InjectCommands);
	bot.use(InjectMessaging(bot));
	bot.use(InjectConnection(connection));
	/* Custom middlewares: */
	bot.use(injectAPI(API));
	bot.use(InjectMessageParser);
	bot.use(InjectUser(connection, API));
	bot.use(InjectScene(bot)(HomeScene, ChatNLPScene, WebsiteAvailabilityScene));

	bot.command(['/start', Scenes.HOME, Scenes.START], async (ctx) => {
		await ctx.scene.join("home");
	});

	bot.command(Scenes.CHAT_NLP, async (ctx) => {
		await ctx.scene.join("chat_nlp");
	});

	bot.command(Scenes.WEBSITE_AVAILABILITY, async (ctx) => {
		await ctx.scene.join("website_availability");
	});

	bot.startPolling();
}

main();