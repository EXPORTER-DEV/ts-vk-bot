import { Keyboards } from "../keyboard/Keyboards";
import Scene from "../lib/Scene";

export const HomeScene = new Scene("home", 
    Scene.joined(async (ctx) => {
        const isGreeting = ctx.session.value.greeting === undefined;
        if(isGreeting){
            await ctx.reply(
                `Привет, ${ctx.user.firstname}!
                Выбери необходимую категорию в меню 🏘`, 
                null,
                Keyboards.MAIN_MENU(ctx.user),
            );
        }else{
            await ctx.reply(
                `Выбери необходимую категорию в меню 🏘`, 
                null,
                Keyboards.MAIN_MENU(ctx.user),
            );
        }
        if(isGreeting){
            ctx.session.value.greeting = Date.now();
        }
        return ctx.scene.exit();
    })
);