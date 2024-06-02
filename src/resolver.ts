import { createPost, deletePost, getPostById, getPosts, updatePost } from "./db/posts";
import { getUsers, login, registerUser } from "./db/user";

export const resolvers = {
  Query: {
    // Post
    posts: async () => getPosts(),
    post: async (_: any, { id }: { id: number }) => getPostById(id),

    // User
    users: async () => getUsers(),
    // user: async (_: any, { username } : { username: string }) => getUserByUsername(username),
  },
  Mutation: {
    // Post
    createPost: async (_: any, { postInput }: { postInput: { title: string } }) => createPost(postInput),
    updatePost: async (_: any, { postInput, id }: { postInput: { title: string }; id: number }) => updatePost({...postInput, id }),
    deletePost: async (_: any, { id }: { id: number }) => deletePost(id),

    // User
    register: async(_: any, { userInput }: { userInput: { username: string, password: string }}) => registerUser(userInput),
    login: async(_: any, { userInput }: { userInput: { username: string, password: string }}) => login(userInput)
  },
};