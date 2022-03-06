if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

module.exports = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    synchronize: false,
    migrationsRun: true,
    entities: [`${__dirname}/**/*.entity{.js,.ts}`],
    migrationsTableName: 'migrations_typeorm',
    migrations: [`${__dirname}/*/migration/*.js`],
    cli: {
        migrationsDir: 'src/migration'
    }
}
