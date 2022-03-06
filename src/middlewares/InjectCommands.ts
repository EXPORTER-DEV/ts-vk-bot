import { Commands } from "../constants";

export default async function(ctx: any, next: any){
    if(ctx.message.type !== 'message_new') return next();
    if(ctx.message.text && Commands[ctx.message.text.toLowerCase()] !== undefined){
        if(ctx.message.payload.cmd === undefined){
            ctx.message.payload.cmd = Commands[ctx.message.text.toLowerCase()];
        }
    }
    await next();
}