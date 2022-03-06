import { Connection } from "typeorm";
import configuration from "../config/configuration";
const config: any = configuration();

export default (connection: Connection) => async (ctx: any, next: any) => {
    if(ctx.message.type !== 'message_new') return next();
    ctx.connection = connection;
    await next();
}