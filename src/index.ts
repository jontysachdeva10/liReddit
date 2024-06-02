import { __prod__ } from "./constants";
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from "./resolver";
import { readFile } from "fs/promises";
import cors from 'cors';

const main = async () => {
    const app = express();

    const typeDefs = await readFile('./src/schema.graphql', 'utf8');

    const apolloServer = new ApolloServer({typeDefs, resolvers});

    await apolloServer.start();

    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(apolloServer));

    app.listen(3000, () =>{
        console.log('Server started on localhost:3000');
    });
};

main().catch(err => {
    console.error(err);
})