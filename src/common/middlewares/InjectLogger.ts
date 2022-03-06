import { ILogger } from "./middlewares.interface";

export default (logger: ILogger) => async (ctx: any, next: any) => {
    ctx.logger = logger;
    await next();
}