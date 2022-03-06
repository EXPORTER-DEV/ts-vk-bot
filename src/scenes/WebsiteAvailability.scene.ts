import { Keyboards } from "../keyboard/Keyboards";
import Scene from "../lib/Scene";
import axios, { AxiosResponse } from "axios";

export const WebsiteAvailabilityScene = new Scene("website_availability", 
    Scene.joined(async (ctx) => {
        await ctx.reply(
            `Для того, чтобы проверить доступность сайта, пришли ссылку на него.`,
            null,
            Keyboards.CANCEL
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
            const match = ctx.message.text.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gim);
            if(match !== null){
                let url = match[0];
                await ctx.reply(`Начинаю попытку загрузить ресурс: ${url} ...`);
                if(url.startsWith('http') === false){
                    url = `https://${url}`;
                }
                const start = Date.now();
                const timeout = 15000;
                const result: false | AxiosResponse = await axios({url, timeout}).then((res) => res).catch(e => false);
                if(result !== false){
                    ctx.reply(
                        `Статус ${result.status} (${result.statusText})
                        Время загрузки: ${Date.now() - start} мс.
                        `
                    );
                    return ctx.scene.exit();
                }else{
                    return ctx.reply(
                        `Не удалось загрузить ресурс: ${url} (время загрузки: ${Date.now() - start} мс.)
                        Установленный таймаут: ${timeout} мс.
                        `,
                        null,
                        Keyboards.CANCEL
                    );
                }
            }
        }
        await ctx.reply(
            `Я не нашёл ссылку в сообщении.`,
            null,
            Keyboards.CANCEL
        );
    },
);