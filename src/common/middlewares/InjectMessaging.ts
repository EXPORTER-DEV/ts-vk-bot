import { isNumber } from "class-validator";
import { Bot, CTX, MessageType } from "./middlewares.interface";

const normalizeMessage = (message: MessageType): string => {
    return message.toString().replace(/([^\n\S]){2,}/gim, ' ').replace(/^\s/gim, "\n");
}

export default (bot: Bot) => {
    // Old as prototype:
    bot.sendMessagePrototype = bot.sendMessage as any;
    return async (ctx: CTX, next: any) => {
        if(ctx.message.type !== 'message_new') return next();
        bot.sendMessage = async (user_id: number | number[], message: MessageType | MessageType[], attachment?: any, markup?: Record<string, any>, sticker?: any, message_id?: number): Promise<void> => {
            if(user_id instanceof Array){
                const queue: Promise<void>[] = [];
                for(let user of user_id){
                    queue.push(bot.sendMessage(user, message, attachment, markup, sticker, message_id));
                }
                await Promise.all(queue);
            }else if(isNumber(user_id)){
                if(message instanceof Array){
                    const length = message.length - 1;
                    for(let i = 0; i <= length; i++){
                        if(i === length){
                            await bot.sendMessage(user_id, message[i], attachment, markup, sticker, message_id);
                        }else{
                            await bot.sendMessage(user_id, message[i]);
                        }
                    }
                }else{
                    message = normalizeMessage(message);
                    await bot.sendMessagePrototype(
                        user_id, 
                        message, 
                        attachment, 
                        markup, 
                        sticker, 
                        message_id ?? Math.random()
                    );
                }
            }
        }
        ctx.reply = async (message: MessageType | MessageType[], attachment?, markup?, sticker?): Promise<void> => {
            if(message instanceof Array){
                const length = message.length - 1;
                for(let i = 0; i <= length; i++){
                    if(i === length){
                        await ctx.reply(message[i], attachment, markup, sticker);
                    }else{
                        await ctx.reply(message[i])
                    }
                }
            }else{
                message = normalizeMessage(message);
                // Bot args: id, message, attachment, keyboard, sticker, randomId
                await bot.sendMessagePrototype(
                    ctx.message.peer_id ?? ctx.message.from_id, 
                    message, 
                    attachment,
                    markup,
                    sticker,
                    Math.random(),
                );
            }
        }
        ctx.replyToMessage = async (message: MessageType | MessageType[], attachment?, markup?, sticker?): Promise<void> => {
            if(message instanceof Array){
                const length = message.length - 1;
                for(let i = 0; i <= length; i++){
                    if(i === length){
                        await ctx.replyToMessage(message[i], attachment, markup, sticker);
                    }else{
                        await ctx.replyToMessage(message[i])
                    }
                }
            }else{
                message = normalizeMessage(message);
                // Bot args: id, {message, attachment, keyboard, sticker, randomId}
                await bot.sendMessagePrototype(
                    ctx.message.peer_id ?? ctx.message.from_id, 
                    {
                        message: message, 
                        attachment: attachment,
                        keyboard: markup,
                        sticker_id: sticker,
                        random_id: Math.random(),
                        forward: JSON.stringify({
                            peer_id: ctx.message.peer_id,
                            conversation_message_ids: [ctx.message.conversation_message_id],
                            is_reply: true,
                        }),
                    }
                );
            }
        }
        //
        await next();
    }
}