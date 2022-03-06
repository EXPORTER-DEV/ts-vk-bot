import { CTX, ILoaderItem, ILogger } from "./middlewares.interface";

const store = {};
export default (logger: ILogger) => (...items: ILoaderItem[] | any[]) => () => {
    for(const item of items){
        if(item.name === undefined){
            let object: Object;
            if(item.object !== undefined){
                object = item.object;
            }else{
                object = item;
                item.object = object;
            }
            if(object.constructor?.name !== undefined){
                item.name = object.constructor?.name;
            }else{
                throw new Error(`Failed to init loader with item.`);
            }
        }
        logger.debug(`Registered loader item with name: ${item.name}`);
        store[item.name] = item.object;
    }
    return async (ctx: CTX, next: any) => {
        ctx.load = <T>(name: string | any): T => {
            if(typeof name !== 'string'){
                if(name.name === undefined){
                    throw new Error(`Failed to load item.`);
                }
                name = name.name;
            }
            if(store[name] !== undefined){
                return store[name] as T;
            }else{
                throw new Error(`Undefined loader item ${name}, please check correctly registered loader item.`);
            }
        }
        await next();
    }
}