import { Post } from "../entities/Post";
import { initializeMikroORM } from "./mikroOrmSetup";

export async function getPosts(): Promise<Post[]> {
  const em = await initializeMikroORM();
  const posts =  await em.find(Post, {});
  return posts;
}

export async function getPostById(id: number): Promise<Post | null> {
  const em = await initializeMikroORM();
  const post = await em.findOne(Post, { id });
  return post;
}

export async function createPost({ title }: { title: string } ): Promise<Post> {
    const em = await initializeMikroORM();
    const newPost = new Post();
    newPost.title = title;
    await em.persistAndFlush(newPost);
    return newPost;
}

export async function updatePost({ id, title }: { id: number; title: string }): Promise<Post | null> {
  const em = await initializeMikroORM();
  const post = await em.findOne(Post, { id });

  if(!post) {
    return null;
  }

  post.title = title;
  await em.flush();
  return post;
}

export async function deletePost(id: number): Promise<Post | null> {
  const em = await initializeMikroORM();
  const post = await em.findOne(Post, { id });

  if(!post) {
    return null;
  }

  await em.removeAndFlush(post);
  return post;
}