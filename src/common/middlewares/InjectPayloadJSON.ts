export default async function(ctx: any, next: any){
    let payload: any = {};
    try {
        payload = JSON.parse(ctx.message.payload);
    }catch(e){}
    ctx.message.payload = payload;
    await next();
}