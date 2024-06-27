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
        posts: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { em, req, res, redisClient }) { return (0, posts_1.getPosts)({ em, req, res, redisClient }); }),
        post: (_2, _b, _c) => __awaiter(void 0, [_2, _b, _c], void 0, function* (_, { id }, { em, req, res, redisClient }) { return (0, posts_1.getPostById)(id, { em, req, res, redisClient }); }),
        // User
        users: (_3, __2, _d) => __awaiter(void 0, [_3, __2, _d], void 0, function* (_, __, { em, req, res, redisClient }) { return (0, user_1.getUsers)({ em, req, res, redisClient }); }),
        currentUser: (_4, __3, _e) => __awaiter(void 0, [_4, __3, _e], void 0, function* (_, __, { em, req, res, redisClient }) { return (0, user_1.getCurrentUser)({ em, req, res, redisClient }); }),
    },
    Mutation: {
        // Post
        createPost: (_5, _f, _g) => __awaiter(void 0, [_5, _f, _g], void 0, function* (_, { postInput }, { em, req, res, redisClient }) { return (0, posts_1.createPost)(postInput, { em, req, res, redisClient }); }),
        updatePost: (_6, _h, _j) => __awaiter(void 0, [_6, _h, _j], void 0, function* (_, { postInput, id }, { em, req, res, redisClient }) { return (0, posts_1.updatePost)(Object.assign(Object.assign({}, postInput), { id }), { em, req, res, redisClient }); }),
        deletePost: (_7, _k, _l) => __awaiter(void 0, [_7, _k, _l], void 0, function* (_, { id }, { em, req, res, redisClient }) { return (0, posts_1.deletePost)(id, { em, req, res, redisClient }); }),
        // User
        register: (_8, _m, _o) => __awaiter(void 0, [_8, _m, _o], void 0, function* (_, { userInput }, { em, req, res, redisClient }) { return (0, user_1.registerUser)(userInput, { em, req, res, redisClient }); }),
        login: (_9, _p, _q) => __awaiter(void 0, [_9, _p, _q], void 0, function* (_, { usernameOrEmail, password }, { em, req, res, redisClient }) { return (0, user_1.login)({ usernameOrEmail, password }, { em, req, res, redisClient }); }),
        logout: (_10, __4, _r) => __awaiter(void 0, [_10, __4, _r], void 0, function* (_, __, { em, req, res, redisClient }) { return (0, user_1.logout)({ em, req, res, redisClient }); }),
        forgotPassword: (_11, _s, _t) => __awaiter(void 0, [_11, _s, _t], void 0, function* (_, { email }, { em, req, res, redisClient }) { return (0, user_1.forgotPassword)({ email }, { em, req, res, redisClient }); }),
        changePassword: (_12, _u, _v) => __awaiter(void 0, [_12, _u, _v], void 0, function* (_, { token, newPassword }, { em, req, res, redisClient }) { return (0, user_1.changePassword)({ token, newPassword }, { em, req, res, redisClient }); })
    },
};
