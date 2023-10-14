import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname,'./migrations')
  },
  entities: [Post],
  dbName: "lireddit",
  user: 'postgres',
  password: 'admin',
  type: "postgresql",
  clientUrl: 'postgresql://postgres:admin@localhost:5432/lireddit',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
