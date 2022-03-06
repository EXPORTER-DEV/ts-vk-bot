export class TextParser {
    realText: string;
    realLength: number;
    constructor(text: string){
        this.realText = text.replace(/\s/gi, '');
        this.realLength = this.realText.length;
    }
}
export default async function(ctx: any, next: any){
    if(ctx.message.type !== 'message_new') return next();
    ctx.message.textParser = new TextParser(ctx.message.text);
    await next();
}