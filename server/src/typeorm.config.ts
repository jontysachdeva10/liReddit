import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "lireddit2",
  synchronize: true, // Disable in production
  logging: false,
  migrations: [path.join(__dirname, './migrations/*')],
  entities: [Post, User], // Add all your entities here
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
