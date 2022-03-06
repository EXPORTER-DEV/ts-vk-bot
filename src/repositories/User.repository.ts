import { plainToClass } from "class-transformer";
import { UserEntity } from "../entity/User.entity";
import { Repository } from "typeorm";
import { TimeUnits } from "../common/utils/TimeUnits";

export class UserRepository {
    private userRepository: Repository<UserEntity>;
    constructor(userRepository: Repository<UserEntity>){
        this.userRepository = userRepository;
    }
    findOne(user_id: number): Promise<UserEntity | undefined>{
        return this.userRepository.findOne({
            where: {
                id: user_id
            },
        });
    }
    find(options?: Record<string, any>): Promise<UserEntity[]>{
        return this.userRepository.find(options);
    }
    save(user: UserEntity): Promise<UserEntity>{
        user = plainToClass(UserEntity, user);
        return this.userRepository.save(user);
    }
}