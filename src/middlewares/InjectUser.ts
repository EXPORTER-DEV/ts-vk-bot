import API from "../lib/API";
import { UserEntity } from "../entity/User.entity";
import { Connection } from "typeorm";
import { Session } from "../lib/Session";
import configuration from "../common/config/configuration";
import { UserRepository } from "../repositories/User.repository";
import { CTX } from "./middlewares.interface";
const config: any = configuration();

export default (connection: Connection, api: API) => async (ctx: CTX, next: any) => {
    if(ctx.message.type !== 'message_new') return next();
    let user: UserEntity;
    const repository = ctx.load<UserRepository>(UserRepository);
    const getUser = await repository.findOne(ctx.message.from_id);
    if(getUser === undefined){
        const loadUser = await api.getUser(ctx.message.from_id);
        if(loadUser !== false){
            let createdUser = new UserEntity();
            createdUser.firstname = loadUser.first_name;
            createdUser.lastname = loadUser.last_name;
            createdUser.id = loadUser.user_id;
            await repository.save(createdUser);
            user = createdUser;
        }
    }else{
        user = getUser;
    }
    ctx.user = user;
    ctx.session = new Session(connection, user);
    await next();
}