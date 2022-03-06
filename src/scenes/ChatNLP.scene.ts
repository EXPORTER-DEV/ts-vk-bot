import configuration from "../common/config/configuration";
import { ChatNLPData, ChatNLPIntents } from "../data/ChatNLP.data";
import { Keyboards } from "../keyboard/Keyboards";
import Scene from "../lib/Scene";

const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['ru'], forceNER: true, nlu: { useNoneFeature: false, log: false }, threshold: 0.5 });
if(configuration().isProduction){
    manager.load();
}else{
    for(const [intent, value] of Object.entries(ChatNLPData)){
        for(const processing of value.processing){
            manager.addDocument('ru', processing, intent);
        }
        for(const answer of value.answers){
            manager.addAnswer('ru', intent, answer);
        }
    }
    manager.save();
}

manager.train();


export const ChatNLPScene = new Scene("chat_nlp", 
    Scene.joined(async (ctx) => {
        await ctx.reply([
            `Я умею следующее:
            1) Сложить числа: «1 + 1», «Сколько будет 1 плюс 5?»;
            2) Умножить числа: «1 * 1», «Сколько 1 умножить на 5?»;
            3) Перевести рубли в доллары: «Сколько будет 500 рублей в долларах?»;
            4) Перевести доллары в рубли: «Сколько будет 100 долларов в рублях?»;
            Могу поддержать диалог)
            `,
            `Спрашивай, что тебя интересует :)`],
            null,
            Keyboards.CANCEL,
        );
    }),
    Scene.exited(async (ctx) => {
        await ctx.scene.join("home");
    }),
    Scene.payload(async(ctx) => {
        if(ctx.message.payload){
            if(ctx.message.payload.cmd === "cancel"){
                await ctx.scene.exit();
                return true;
            }
        }
    }),
    async (ctx) => {
        if(ctx.message.textParser.realLength > 0){
            const response = await manager.process('ru', ctx.message.text);
            let answer: string | false = false;
            if(response.answer !== undefined){
                switch(response.intent){
                    case ChatNLPIntents.CURRENCY_USD_RUB:
                        answer = await ChatNLPData[ChatNLPIntents.CURRENCY_USD_RUB].handler(response);
                        break;
                    case ChatNLPIntents.CURRENCY_RUB_USD: 
                        answer = await ChatNLPData[ChatNLPIntents.CURRENCY_RUB_USD].handler(response);
                        break;
                    case ChatNLPIntents.NUMBERS_SUM: {
                        answer = await ChatNLPData[ChatNLPIntents.NUMBERS_SUM].handler(response);
                        break;
                    }
                    case ChatNLPIntents.NUMBERS_MULTIPLE: {
                        answer = await ChatNLPData[ChatNLPIntents.NUMBERS_MULTIPLE].handler(response);
                        break;
                    }
                    default:
                        answer = response.answer;
                }
            }
            if(answer === false){
                await ctx.reply('Я не совсем тебя понял.', null, Keyboards.CANCEL);
            }else{
                await ctx.reply(answer, null, Keyboards.CANCEL);
            }
        }
    },
);