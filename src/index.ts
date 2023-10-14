import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
    // connect to DB
    const orm = await MikroORM.init(mikroConfig);
    
    // Run migrations automatically
    await orm.getMigrator().up();

    const emFork = orm.em.fork();
    // To add the data
    const post = emFork.create(Post, {
        title: 'My first post.',
        createdAt: "",
        updatedAt: ""
    });
    await emFork.persistAndFlush(post);

    // To find the data
    const posts = await emFork.find(Post, {});
    console.log('Post', posts);
    
};

main().catch(err => {
    console.error(err);
})