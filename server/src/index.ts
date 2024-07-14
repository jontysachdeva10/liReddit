import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import cors from "cors";
import redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { AppDataSource } from "./typeorm.config";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post.resolver";
import { UserResolver } from "./resolvers/user.resolver";

const main = async () => {
  const app = express();

  // Initialize TypeORM
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  // create redis client
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  redisClient.on("error", (err) => {
    console.error("Redis client error:", err);
  });

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient as any,
        disableTouch: false,
      }),
      secret: "qwertyuiop",
      resave: false, // Recommended setting
      saveUninitialized: false, // Recommended setting
      cookie: {
        secure: __prod__, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year,
        httpOnly: true,
        sameSite: "lax", // csrf
      },
    })
  );

  async function getContext({
    req,
    res,
  }: {
    req: Request;
    res: Response;
  }): Promise<MyContext> {
    return {
      req: req as Request & { session: Express.Session },
      res,
      redisClient,
    };
  }

  // Build GraphQL schema with type-graphql
  const schema = await buildSchema({
    resolvers: [PostResolver, UserResolver],
    authChecker: ({ context }: { context: MyContext }) => {
      return !!context.req.session.userId;
    },
  });

  // Create Apollo Server instance
  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();

  // CORS options
  const corsOptions = {
    origin: "http://localhost:3000", // Specify the origin you want to allow
    credentials: true, // Allow session cookie from browser to pass through
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    apolloMiddleware(apolloServer, { context: getContext })
  );

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
