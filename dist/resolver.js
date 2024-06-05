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
// resolver params => (parent, args, contextValue, info)
exports.resolvers = {
    Query: {
        // Post
        posts: (_, __, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.getPosts)({ em, req, res }); }),
        post: (_, { id }, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.getPostById)(id, { em, req, res }); }),
        // User
        users: (_, __, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, user_1.getUsers)({ em, req, res }); }),
        currentUser: (_, __, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, user_1.getCurrentUser)({ em, req, res }); }),
    },
    Mutation: {
        // Post
        createPost: (_, { postInput }, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.createPost)(postInput, { em, req, res }); }),
        updatePost: (_, { postInput, id }, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.updatePost)(Object.assign(Object.assign({}, postInput), { id }), { em, req, res }); }),
        deletePost: (_, { id }, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, posts_1.deletePost)(id, { em, req, res }); }),
        // User
        register: (_, { userInput }, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, user_1.registerUser)(userInput, { em, req, res }); }),
        login: (_, { userInput }, { em, req, res }) => __awaiter(void 0, void 0, void 0, function* () { return (0, user_1.login)(userInput, { em, req, res }); })
    },
};
