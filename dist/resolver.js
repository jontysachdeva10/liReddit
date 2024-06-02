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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const posts_1 = require("./db/posts");
const user_1 = require("./db/user");
exports.resolvers = {
    Query: {
        // Post
        posts: () => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.getPosts)(); }),
        post: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.getPostById)(id); }),
        // User
        users: () => __awaiter(void 0, void 0, void 0, function* () { return (0, user_1.getUsers)(); }),
        // user: async (_: any, { username } : { username: string }) => getUserByUsername(username),
    },
    Mutation: {
        // Post
        createPost: (_, { postInput }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.createPost)(postInput); }),
        updatePost: (_, { postInput, id }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.updatePost)(Object.assign(Object.assign({}, postInput), { id })); }),
        deletePost: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.deletePost)(id); }),
        // User
        register: (_, { userInput }) => __awaiter(void 0, void 0, void 0, function* () { return (0, user_1.registerUser)(userInput); }),
        login: (_, { userInput }) => __awaiter(void 0, void 0, void 0, function* () { return (0, user_1.login)(userInput); })
    },
};
