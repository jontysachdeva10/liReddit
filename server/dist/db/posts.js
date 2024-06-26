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
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getPosts = void 0;
const Post_1 = require("../entities/Post");
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ em }) {
        const posts = yield em.find(Post_1.Post, {});
        yield sleep(3000);
        return posts;
    });
}
exports.getPosts = getPosts;
function getPostById(id_1, _a) {
    return __awaiter(this, arguments, void 0, function* (id, { em }) {
        const post = yield em.findOne(Post_1.Post, { id });
        return post;
    });
}
exports.getPostById = getPostById;
function createPost(_a, _b) {
    return __awaiter(this, arguments, void 0, function* ({ title }, { em }) {
        const newPost = new Post_1.Post();
        newPost.title = title;
        yield em.persistAndFlush(newPost);
        return newPost;
    });
}
exports.createPost = createPost;
function updatePost(_a, _b) {
    return __awaiter(this, arguments, void 0, function* ({ id, title }, { em }) {
        const post = yield em.findOne(Post_1.Post, { id });
        if (!post) {
            return null;
        }
        post.title = title;
        yield em.flush();
        return post;
    });
}
exports.updatePost = updatePost;
function deletePost(id_1, _a) {
    return __awaiter(this, arguments, void 0, function* (id, { em }) {
        const post = yield em.findOne(Post_1.Post, { id });
        if (!post) {
            return null;
        }
        yield em.removeAndFlush(post);
        return post;
    });
}
exports.deletePost = deletePost;
