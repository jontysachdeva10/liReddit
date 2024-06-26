import { MyContext } from "../types";
import { Post } from "../entities/Post";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function getPosts({ em }: MyContext) {
  const posts = await em.find(Post, {});
  await sleep(3000);
  return posts;
}

export async function getPostById(id: number, { em }: MyContext) {
  const post = await em.findOne(Post, { id });
  return post;
}

export async function createPost({ title }: { title: string }, { em }: MyContext ) {
    const newPost = new Post();
    newPost.title = title;
    await em.persistAndFlush(newPost);
    return newPost;
}

export async function updatePost({ id, title }: { id: number; title: string }, { em }: MyContext) {
  const post = await em.findOne(Post, { id });

  if(!post) {
    return null;
  }

  post.title = title;
  await em.flush();
  return post;
}

export async function deletePost(id: number, { em }: MyContext) {
  const post = await em.findOne(Post, { id });

  if(!post) {
    return null;
  }

  await em.removeAndFlush(post);
  return post;
}