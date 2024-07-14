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
const typeorm_config_1 = require("../typeorm.config");
function getPosts(limit, cursor) {
    return __awaiter(this, void 0, void 0, function* () {
        // const posts = await Post.find();
        // return posts;
        const realLimit = Math.min(50, limit);
        const qb = typeorm_config_1.AppDataSource.getRepository(Post_1.Post)
            .createQueryBuilder("posts")
            .orderBy('"createdAt"', "DESC")
            .take(realLimit);
        if (cursor) {
            const cursorDate = new Date(cursor);
            if (isNaN(cursorDate.getTime())) {
                throw new Error(`Invalid cursor date: ${cursor}`);
            }
            qb.where('"createdAt" < :cursor', { cursor: cursorDate });
        }
        const posts = yield qb.getMany();
        return posts;
    });
}
exports.getPosts = getPosts;
function getPostById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield Post_1.Post.findOneBy({ id });
        return post;
    });
}
exports.getPostById = getPostById;
function createPost(_a, _b) {
    return __awaiter(this, arguments, void 0, function* ({ title, text }, { req }) {
        return Post_1.Post.create({ title, text, authorId: req.session.userId }).save();
    });
}
exports.createPost = createPost;
function updatePost(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, title, text }) {
        const post = yield Post_1.Post.findOneBy({ id });
        if (!post) {
            return null;
        }
        yield Post_1.Post.update({ id }, { title, text });
        return post;
    });
}
exports.updatePost = updatePost;
function deletePost(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return Post_1.Post.delete(id);
    });
}
exports.deletePost = deletePost;
