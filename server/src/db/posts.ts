import { Post } from "../entities/Post";
import { AppDataSource } from "../typeorm.config";
import { MyContext } from "../types";

type InputType = {
  title: string,
  text: string
}

export async function getPosts(
  limit: number,
  cursor: string | null
): Promise<Post[]> {
  // const posts = await Post.find();
  // return posts;
  const realLimit = Math.min(50, limit);
  const qb = AppDataSource.getRepository(Post)
    .createQueryBuilder("posts")
    .orderBy('"createdAt"', "DESC")
    .take(realLimit)

    if(cursor) {
      const cursorDate = new Date(cursor);
      if (isNaN(cursorDate.getTime())) {
        throw new Error(`Invalid cursor date: ${cursor}`);
      }
      qb.where('"createdAt" < :cursor', { cursor: cursorDate })
    }

    const posts = await qb.getMany();
    return posts;
}

export async function getPostById(id: number): Promise<Post | null> {
  const post = await Post.findOneBy({ id });
  return post;
}

export async function createPost({ title, text }: InputType, { req }: MyContext): Promise<Post> {
  return Post.create({ title , text, authorId: req.session.userId }).save();
}

export async function updatePost({
  id,
  title,
  text
}: {
  id: number;
  title: string;
  text: string;
}): Promise<Post | null> {
  const post = await Post.findOneBy({ id });

  if (!post) {
    return null;
  }

  await Post.update({ id }, { title, text });
  return post;
}

export async function deletePost(id: number) {
  return Post.delete(id);
}
