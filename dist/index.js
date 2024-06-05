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
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const resolver_1 = require("./resolver");
const promises_1 = require("fs/promises");
const cors_1 = __importDefault(require("cors"));
const redis_1 = __importDefault(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // Initialize MikroORM
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    yield orm.getMigrator().up();
    const em = orm.em.fork();
    // create redis client
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redisClient = redis_1.default.createClient();
    redisClient.on('error', (err) => {
        console.error('Redis client error:', err);
    });
    app.use((0, express_session_1.default)({
        name: 'qid',
        store: new RedisStore({ client: redisClient, disableTouch: false }),
        secret: 'qwertyuiop',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: constants_1.__prod__,
            maxAge: 1000 * 60 * 60 * 24 * 365 * 1,
            httpOnly: true,
            sameSite: 'lax' // csrf
        },
    }));
    // Read GraphQL type definitions from file
    const typeDefs = yield (0, promises_1.readFile)('./src/schema.graphql', 'utf8');
    function getContext({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return { em, req: req, res };
        });
    }
    // Create Apollo Server instance
    const apolloServer = new server_1.ApolloServer({
        typeDefs,
        resolvers: resolver_1.resolvers
    });
    yield apolloServer.start();
    app.use('/graphql', (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(apolloServer, { context: getContext }));
    app.listen(3000, () => {
        console.log('Server started on localhost:3000');
    });
});
main().catch(err => {
    console.error(err);
});
