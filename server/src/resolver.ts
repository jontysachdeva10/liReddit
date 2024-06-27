import { MyContext } from "./types";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "./db/posts";
import { changePassword, forgotPassword, getCurrentUser, getUsers, login, logout, registerUser } from "./db/user";

// resolver params => (parent, args, contextValue, info)

export const resolvers = {
  Query: {
    // Post
    posts: async (_: any, __: any, { em, req, res, redisClient }: MyContext) => getPosts({ em, req, res, redisClient }),
    post: async (_: any, { id }: { id: number }, { em, req, res, redisClient }: MyContext) => getPostById(id, { em, req, res, redisClient }),

    // User
    users: async (_: any, __: any, { em, req, res, redisClient }: MyContext) => getUsers({ em, req, res, redisClient }),
    currentUser: async (_: any, __:any, { em, req, res, redisClient }: MyContext) => getCurrentUser({ em, req, res, redisClient }),
  },
  Mutation: {
    // Post
    createPost: async (_: any, { postInput }: { postInput: { title: string } }, { em, req, res, redisClient }: MyContext) => createPost(postInput, { em, req, res, redisClient }),
    updatePost: async (_: any, { postInput, id }: { postInput: { title: string }; id: number }, { em, req, res, redisClient }: MyContext) => updatePost({...postInput, id }, { em, req, res, redisClient }),
    deletePost: async (_: any, { id }: { id: number }, { em, req, res, redisClient }: MyContext) => deletePost(id, { em, req, res, redisClient }),

    // User
    register: async(_: any, { userInput }: { userInput: { username: string, email: string, password: string }}, { em, req, res, redisClient }: MyContext) => registerUser(userInput, { em, req, res, redisClient }),
    login: async(_: any, { usernameOrEmail, password }: {usernameOrEmail: string, password: string}, { em, req, res, redisClient }: MyContext ) => login({ usernameOrEmail, password }, { em, req, res, redisClient }),
    logout: async(_:any, __:any, {em, req, res, redisClient}: MyContext) => logout({em, req, res, redisClient}),
    forgotPassword: async(_:any, { email }: { email: string }, {em, req, res, redisClient}: MyContext) => forgotPassword({ email }, { em, req, res, redisClient }),
    changePassword: async(_:any, { token, newPassword }: { token: string, newPassword: string }, { em, req, res, redisClient }: MyContext) => changePassword({ token, newPassword }, { em, req, res, redisClient })
  },
};