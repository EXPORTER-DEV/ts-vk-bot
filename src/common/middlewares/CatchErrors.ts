import { IPrimaryLogger } from "./middlewares.interface";

export default (logger: IPrimaryLogger) => async (ctx: any, next: any) => {
    try {
        await next();
    }catch(e){
        logger.error(`Got error while handling message: ${e.stack}`);
    }
}