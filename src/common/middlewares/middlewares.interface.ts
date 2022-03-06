import { Connection } from "typeorm";

export interface IPrimaryLogger {
    error: (...args: any[]) => any,
}

export type MessageType = string | number | symbol;

export interface ILogger {
    info: (message: string) => any;
    warn: (message: string) => any;
    debug: (message: string) => any;
    error: (message: string) => any;
}

export interface ILoaderItem {
    name?: string;
    object: any;
}

export type ILoaderItemType = ILoaderItem | any;

export interface CTXMessage {
    date: number;
    from_id?: number;
    peer_id?: number;
    id: number;
    text: string;
    type: string;
    payload?: Record<string, any>;
    fwd_messages?: CTXMessage[];
    [key: string | number | symbol]: any;
}

export interface CTX {
    message: CTXMessage,
    connection?: Connection;
    load?<T>(name: string | any): T,
    replyPrototype(message: MessageType, attachment?: any, markup?: Record<string, any>, sticker?: any): Promise<void>;
    reply(message: MessageType | MessageType[], attachment?: any, markup?: Record<string, any>, sticker?: any): Promise<void>;
    replyToMessage(message: MessageType | MessageType[], attachment?: any, markup?: Record<string, any>, sticker?: any): Promise<void>;
    logger?: ILogger;
    [key: string | number | symbol]: any;
}

export interface Bot {
    sendMessagePrototype(user_id: number, message: MessageType, attachment?: any, markup?: Record<string, any>, sticker?: any, message_id?: number): Promise<void>;
    sendMessagePrototype(user_id: number, args: {
        message: MessageType, 
        attachment?: any, 
        keyboard?: Record<string, any>, 
        sticker_id?: any, 
        random_id?: number,
        reply_to?: number,
        [key: string | number | symbol]: any;
    }): Promise<void>;
    sendMessage(user_id: number | number[], message: MessageType | MessageType[], attachment?: any, markup?: Record<string, any>, sticker?: any, message_id?: number): Promise<void>;
    [key: string | number | symbol]: any;
}