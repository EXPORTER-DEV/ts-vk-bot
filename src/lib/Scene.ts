/* User scene info inside session: 

user.session.scene = {
    name: String, // unique scene name
    step: Number, // index
}

*/

import logger from './../lib/Logger';

import { Bot, CTX } from "../middlewares/middlewares.interface";

export class SceneController {
    // Flag to increase ctx.session.save() when handling inside scene and single context. It makes only one ctx.session.save() after execution all handlers.
    context: boolean = false;
    private joinScene: any;
    private exitScene: any;
    private jumpItem: any;
    private moveItem: any;
    constructor(joinScene: any, exitScene: any, jumpItem: any, moveItem: any){
        this.joinScene = joinScene;
        this.exitScene = exitScene;
        this.jumpItem = jumpItem;
        this.moveItem = moveItem;
    }
    async exit(): Promise<any> {
        return this.exitScene();
    }
    async join(name: string): Promise<any> {
        return this.joinScene(name);
    }
    jump(index: number, execute?: Boolean): void
    jump(name: string, execute?: Boolean): void
    async jump(to: number | string, execute: Boolean = false){
        this.jumpItem(to, execute);
    }
    async move(increment: number = 1, execute: Boolean = false): Promise<any> {
        return this.moveItem(increment, execute);
    }
}

export enum SceneEventEnum {
    JOINED = "joined",
    EXITED = "exited",
    PAYLOAD = "payload",
}

export enum SceneHandlerTypeEnum {
    HANDLER = "handler",
    EVENT = "event",
}

export interface ISceneHandler {
    type: SceneHandlerTypeEnum;
    event?: SceneEventEnum;
    name?: string;
    handler: TSceneHandlerFunction; 
}

export type TSceneHandlerFunction = (ctx: CTX, bot?: Bot) => any | Promise<any>;

export class SceneHandler implements ISceneHandler {
    type: SceneHandlerTypeEnum;
    event?: SceneEventEnum;
    name?: string;
    handler: TSceneHandlerFunction;
    constructor(data: ISceneHandler){
        this.type = data.type;
        if(this.type === SceneHandlerTypeEnum.EVENT && data.event){
            this.event = data.event;
        }
        if(data.name !== undefined){
            this.name = data.name;
        }
        this.handler = data.handler;
    }
}

export default class Scene {
    name: string;
    scenes: SceneHandler[] = [];
    events: SceneHandler[] = [];
    constructor(name: string, ...handlers: Array<TSceneHandlerFunction | SceneHandler>){
        this.name = name;
        const length = handlers.length - 1;
        for(let i = 0; i <= length; i++){
            const handler: TSceneHandlerFunction | SceneHandler = handlers[i];
            if(handler instanceof SceneHandler){
                if(handler.type === SceneHandlerTypeEnum.EVENT){
                    if(this.events.find((event) => event.event === handler.event) === undefined){
                        this.events.push(handler);
                    }
                }else if(handler.type === SceneHandlerTypeEnum.HANDLER){
                    this.scenes.push(handler);
                }
                continue;
            }
            const sceneHandler = new SceneHandler({
                type: SceneHandlerTypeEnum.HANDLER,
                handler,
            });
            this.scenes.push(sceneHandler);
        }
        logger.debug(`Registered new scene: "${name}", with scenes(${this.scenes.length}) and events(${this.events.length}) - ${this.events.map((item) => item.event).join(", ")}. Use: \`ctx.scene.join("${this.name}")\`.`);
    }
    // Create event joined SceneHandler
    static joined(handler: TSceneHandlerFunction): SceneHandler {
        return new SceneHandler({
            type: SceneHandlerTypeEnum.EVENT,
            event: SceneEventEnum.JOINED,
            handler,
        });
    }
    // Create event exited SceneHandler
    static exited(handler: TSceneHandlerFunction): SceneHandler {
        return new SceneHandler({
            type: SceneHandlerTypeEnum.EVENT,
            event: SceneEventEnum.EXITED,
            handler,
        });
    }
    // Create event payload SceneHandler
    static payload(handler: TSceneHandlerFunction): SceneHandler {
        return new SceneHandler({
            type: SceneHandlerTypeEnum.EVENT,
            event: SceneEventEnum.PAYLOAD,
            handler,
        });
    }
    // Create named handler SceneHandler
    static named(name: string, handler: TSceneHandlerFunction): SceneHandler {
        return new SceneHandler({
            type: SceneHandlerTypeEnum.HANDLER,
            name,
            handler,
        });
    }
    getJoined(): SceneHandler | undefined {
        return this.events.find((item) => item.type === SceneHandlerTypeEnum.EVENT && item.event === SceneEventEnum.JOINED);
    }
    getExited(): SceneHandler | undefined {
        return this.events.find((item) => item.type === SceneHandlerTypeEnum.EVENT && item.event === SceneEventEnum.EXITED);
    }
    getPayload(): SceneHandler | undefined {
        return this.events.find((item) => item.type === SceneHandlerTypeEnum.EVENT && item.event === SceneEventEnum.PAYLOAD);
    }
    getHandler(step: number): SceneHandler | undefined {
        return this.scenes[step] ?? undefined;
    }
    namedHandlerIndex(name: string): Number | false {
        for(let i = 0; i < this.scenes.length; i++){
            if(this.scenes[i].name && this.scenes[i].name === name){
                return i;
            }
        }
        return false;
    }
}