const Markup = require('node-vk-bot-api/lib/markup.js');


/* 

    Markup.button({
        action: {
        type: 'open_link',
        link: 'https://google.com',
        label: 'Open Google',
        payload: JSON.stringify({
            url: 'https://google.com',
        }),
        },
        color: 'default',
    }) 
    | OR |
    Markup.button(label, color, payload)

*/

type TButtonColors = "primary" | "secondary" | "negative" | "positive" | "default";
type TButtonCustomActionTypes = "text" | "open_link" | "location" | "vkpay" | "open_app" | "callback";
interface IButtonCustom {
    action: {
        type: TButtonCustomActionTypes,
        link?: string,
        label: string,
        payload?: Record<string, any>,
    },
    color: TButtonColors,
}
//
function button(label: string, color: TButtonColors, payload?: Record<string, any>): any;
function button(options: IButtonCustom);
function button(...args: any[]){
    // If args >= 2 || <= 3, expect TButtonDefault
    if(args.length >= 2 && args.length <= 3){
        return Markup.button(...args);
    }else if(args.length === 1 && typeof args[0] === "object"){
        return Markup.button(args[0]);
    }
}
//
export const Button = button;