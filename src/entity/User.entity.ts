import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany} from "typeorm";

@Entity()
export class UserEntity {

    @Column({unique: true, primary: true})
    id: number;

    @Column({default: 0, type: 'tinyint'})
    rank: number;

    @Column({nullable: false})
    firstname: string;

    @Column({nullable: false})
    lastname: string;

    @Column({nullable: true, type: 'text'})
    session: string;

    @Column({type: 'double'})
    created_at: number;

    @Column({type: 'double'})
    updated_at: number;

    @BeforeInsert()
    setCreatedAt(){
        this.created_at = Date.now();
        this.updated_at = Date.now();
    }

    @BeforeUpdate()
    setUpdatedAt(){
        this.updated_at = Date.now();
    }

}