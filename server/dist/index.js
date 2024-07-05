"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const typeorm_config_1 = require("./typeorm.config");
const type_graphql_1 = require("type-graphql");
const post_resolver_1 = require("./resolvers/post.resolver");
const user_resolver_1 = require("./resolvers/user.resolver");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // Initialize TypeORM
    yield typeorm_config_1.AppDataSource.initialize();
    // create redis client
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redisClient = ioredis_1.default.createClient();
    redisClient.on("error", (err) => {
        console.error("Redis client error:", err);
    });
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redisClient,
            disableTouch: false,
        }),
        secret: "qwertyuiop",
        resave: false, // Recommended setting
        saveUninitialized: false, // Recommended setting
        cookie: {
            secure: constants_1.__prod__, // Set to true if using HTTPS
            maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year,
            httpOnly: true,
            sameSite: "lax", // csrf
        },
    }));
    function getContext(_a) {
        return __awaiter(this, arguments, void 0, function* ({ req, res, }) {
            return {
                req: req,
                res,
                redisClient,
            };
        });
    }
    // Build GraphQL schema with type-graphql
    const schema = yield (0, type_graphql_1.buildSchema)({
        resolvers: [post_resolver_1.PostResolver, user_resolver_1.UserResolver],
        authChecker: ({ context }) => {
            return !!context.req.session.userId;
        },
    });
    // Create Apollo Server instance
    const apolloServer = new server_1.ApolloServer({
        schema,
    });
    yield apolloServer.start();
    // CORS options
    const corsOptions = {
        origin: "http://localhost:3000", // Specify the origin you want to allow
        credentials: true, // Allow session cookie from browser to pass through
    };
    app.use("/graphql", (0, cors_1.default)(corsOptions), express_1.default.json(), (0, express4_1.expressMiddleware)(apolloServer, { context: getContext }));
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    });
});
main().catch((err) => {
    console.error(err);
});
