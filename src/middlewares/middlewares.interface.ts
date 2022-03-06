import * as middlewares from "../common/middlewares/middlewares.interface";
import API from "../lib/API";
import { UserEntity } from "../entity/User.entity";
import { SceneController } from "../lib/Scene";
import { Session } from "../lib/Session";
import { TextParser } from "./InjectMessageParser";

export interface CTXMessage extends middlewares.CTXMessage {
    textParser?: TextParser;
}

export interface CTX extends middlewares.CTX {
    scene?: SceneController;
    user?: UserEntity;
    session?: Session;
    api?: API;
    message: CTXMessage;
}

export interface Bot extends middlewares.Bot {
    
}