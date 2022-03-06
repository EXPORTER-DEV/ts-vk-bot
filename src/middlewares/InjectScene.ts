import { isNumber } from "class-validator";
import Scene, { SceneController, SceneHandler } from "../lib/Scene";
import { Bot, CTX } from "./middlewares.interface";

export default (bot: Bot) => (...scenes: Scene[]) => async (ctx: CTX, next: any) => {
    if(ctx.message.type !== 'message_new') return next();
    const saveContextSession = async (): Promise<void> => {
        if(!ctx.scene.context){
            await ctx.session.save();
        }
    }
    const findScene = (name): Scene | false => {
        const scene = scenes.find((item) => item.name === name);
        if(scene !== undefined) return scene;
        return false;
    }
    const exitScene = async (): Promise<void> => {
        if(ctx.session.value.scene !== undefined){
            const scene = findScene(ctx.session.value.scene.name);
            ctx.session.value.scene = undefined;
            await saveContextSession();
            if(scene){
                const exit = scene.getExited();
                if(exit){
                    await exit.handler(ctx, bot);
                    ctx.logger.info(`User #${ctx.user.id} exited scene: ${scene.name}`);
                }
            }
        }
    }
    const joinScene = async (name): Promise<Boolean> => {
        // When initiated joinScene and user has active another scene, init onExit event:
        if(ctx.session.value.scene !== undefined){
            const scene = findScene(ctx.session.value.scene.name);
            if(scene){
                const exit = scene.getExited();
                if(exit){
                    ctx.logger.info(`User #${ctx.user.id} exited scene: ${ctx.session.value.scene.name}`);
                    await exit.handler(ctx, bot);
                }
            }
        }
        const scene = findScene(name);
        if(scene){
            ctx.session.value.scene = {
                position: 0,
                name: name,
            };
            await saveContextSession();
            const join = scene.getJoined();
            if(join){
                await join.handler(ctx, bot);
            }
            ctx.logger.info(`User #${ctx.user.id} joined scene: ${name}`);
            return true;
        }
        ctx.logger.warn(`Failed to join unregistered scene: ${name}, user #${ctx.user.id}. Scene should be registered with InjectScene function inside its arguments.`);
        return false;
    }
    const moveItem = async (increment: number, execute: Boolean = false): Promise<void> => {
        if(ctx.session.value.scene !== undefined){
            const scene = findScene(ctx.session.value.scene.name);
            if(scene){
                const position = ctx.session.value.scene.position + increment;
                const item: SceneHandler | undefined = scene.getHandler(position);
                if(item !== undefined){
                    await jumpItem(position, execute);
                }
            }
        }
    }
    const jumpItem = async (index: string | number, execute: Boolean = false): Promise<void> => {
        if(ctx.session.value.scene !== undefined){
            const scene = findScene(ctx.session.value.scene.name);
            if(scene){
                if(isNumber(index)){
                    const item: SceneHandler | undefined = scene.getHandler(index as number);
                    if(item !== undefined){
                        ctx.session.value.scene.position = index;
                        await saveContextSession();
                        if(execute){
                            await item.handler(ctx, bot);
                        }
                    }
                }else{
                    const position: Number | false = scene.namedHandlerIndex(index as string);
                    if(position !== false){
                        ctx.session.value.scene.position = position;
                        await saveContextSession();
                        if(execute){
                            const item: SceneHandler | false = scene.getHandler(position as number);
                            if(execute){
                                await item.handler(ctx, bot);
                            }
                        }
                    }
                }
            }
        }
    }
    ctx.scene = new SceneController(joinScene, exitScene, jumpItem, moveItem);
    if(ctx.session && ctx.session.value.scene !== undefined){
        const scene = findScene(ctx.session.value.scene.name);
        if(scene !== false){
            ctx.scene.context = true;
            const onPayload = scene.getPayload();
            let canHandleScene: boolean = true;
            if(ctx.message.payload && onPayload !== undefined){
                // If return true of onPayload handler or ctx.session.value.scene === undefined, then save session, then skip iteration:
                const execution = await onPayload.handler(ctx);
                if(execution === true || ctx.session.value.scene === undefined){
                    canHandleScene = false;
                }
            }
            if(canHandleScene){
                const item: SceneHandler | undefined = scene.getHandler(ctx.session.value.scene.position);
                if(item !== undefined){
                    // ctx.session.value.scene.position += 1;
                    await item.handler(ctx, bot);
                }else{
                    await exitScene();
                }
            }
        }else{
            ctx.session.value.scene = undefined;
        }
        await ctx.session.save();
        return;
    }
    await next();
}