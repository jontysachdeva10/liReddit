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
function getPosts({ em }) {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = yield em.find(Post_1.Post, {});
        return posts;
    });
}
exports.getPosts = getPosts;
function getPostById(id, { em }) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield em.findOne(Post_1.Post, { id });
        return post;
    });
}
exports.getPostById = getPostById;
function createPost({ title }, { em }) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPost = new Post_1.Post();
        newPost.title = title;
        yield em.persistAndFlush(newPost);
        return newPost;
    });
}
exports.createPost = createPost;
function updatePost({ id, title }, { em }) {
    return __awaiter(this, void 0, void 0, function* () {
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
function deletePost(id, { em }) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield em.findOne(Post_1.Post, { id });
        if (!post) {
            return null;
        }
        yield em.removeAndFlush(post);
        return post;
    });
}
exports.deletePost = deletePost;
