import { MyContext } from "./types";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "./db/posts";
import { getCurrentUser, getUsers, login, registerUser } from "./db/user";

// resolver params => (parent, args, contextValue, info)

export const resolvers = {
  Query: {
    // Post
    posts: async (_: any, __: any, { em, req, res }: MyContext) => getPosts({ em, req, res }),
    post: async (_: any, { id }: { id: number }, { em, req, res }: MyContext) => getPostById(id, { em, req, res }),

    // User
    users: async (_: any, __: any, { em, req, res }: MyContext) => getUsers({ em, req, res }),
    currentUser: async (_: any, __:any, { em, req, res }: MyContext) => getCurrentUser({ em, req, res }),
  },
  Mutation: {
    // Post
    createPost: async (_: any, { postInput }: { postInput: { title: string } }, { em, req, res }: MyContext) => createPost(postInput, { em, req, res }),
    updatePost: async (_: any, { postInput, id }: { postInput: { title: string }; id: number }, { em, req, res }: MyContext) => updatePost({...postInput, id }, { em, req, res }),
    deletePost: async (_: any, { id }: { id: number }, { em, req, res }: MyContext) => deletePost(id, { em, req, res }),

    // User
    register: async(_: any, { userInput }: { userInput: { username: string, password: string }}, { em, req, res }: MyContext) => registerUser(userInput, { em, req, res }),
    login: async(_: any, { userInput }: { userInput: { username: string, password: string }}, { em, req, res }: MyContext ) => login(userInput, { em, req, res })
  },
};