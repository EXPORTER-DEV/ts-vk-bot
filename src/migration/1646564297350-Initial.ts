import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1646564297350 implements MigrationInterface {
    name = 'Initial1646564297350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_entity\` (\`id\` int NOT NULL, \`rank\` tinyint NOT NULL DEFAULT '0', \`firstname\` varchar(255) NOT NULL, \`lastname\` varchar(255) NOT NULL, \`session\` text NULL, \`created_at\` double NOT NULL, \`updated_at\` double NOT NULL, UNIQUE INDEX \`IDX_b54f8ea623b17094db7667d820\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b54f8ea623b17094db7667d820\` ON \`user_entity\``);
        await queryRunner.query(`DROP TABLE \`user_entity\``);
    }

}
