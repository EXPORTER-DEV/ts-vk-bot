import API from "../lib/API";

export default (api: API) => async (ctx: any, next: any) => {
    if(ctx.message.type !== 'message_new') return next();
    ctx.api = api;
    await next();
}