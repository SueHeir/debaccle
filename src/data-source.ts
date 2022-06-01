
import "reflect-metadata"
import { DataSource } from "typeorm"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    logging: true,
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "lireddit",
    
    // authMechanism:"DEFAULT",
    // authSource: "admin",
    synchronize: true,
    // useUnifiedTopology: true,
    entities: [__dirname + "./dist/entity/*.js"],
    migrations: [__dirname + "./dist/migrations/*.js"],
})
