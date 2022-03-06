import { UserEntity } from "../entity/User.entity";
import { Connection, Repository } from "typeorm";

export class Session {
    private connection: Connection;
    private repository: Repository<UserEntity>;
    private user: UserEntity;
    private session: Record<string, any> = {};
    constructor(connection: Connection, user: UserEntity){
        this.connection = connection;
        this.repository = connection.getRepository(UserEntity);
        this.user = user;

        let session: Record<string, any> = {};
        try {
            session = JSON.parse(user.session);
        }catch(e){}
        if(session === null){
            session = {};
        }
        this.session = session;
    }
    set value(value: Object){
        if(value instanceof Object){
            this.session = value;
            // this.save();
        }
    }
    get value(): any {
        return this.session;
    }
    async save(): Promise<boolean> {
        const user = await this.repository.findOne({where: {id: this.user.id}});
        user.session = JSON.stringify(this.session);
        try {
            await this.repository.save(user);
            this.user = user;
            return true;
        }catch(e){
            return false;
        }
    }
}