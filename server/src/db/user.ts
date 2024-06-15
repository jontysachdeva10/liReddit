import { MyContext } from "../types";
import { User } from "../entities/User";
import * as argon2 from 'argon2';

export async function registerUser({ username, password}: { username: string, password: string}, { em, req }: MyContext) {

    const hashedPassword = await argon2.hash(password)

    const newUser = new User();
    newUser.username = username;
    newUser.password = hashedPassword;

    try {
        await em.persistAndFlush(newUser);
    } catch (err: any) {
        if(err.code === '23505') {
            return {
                error: {
                    code: 'ALREADY_EXIST',
                    message: 'Username is already taken.'
                }
            }
        }
        console.error(err.message);
    }

    // store user id session, this will set cookie on the user & keep them logged in
    req.session.userId = newUser.id;
    
    return {
        user: newUser
    }
}

export async function getUsers({ em }: MyContext): Promise<User[]> {
    const users = await em.find(User, {});
    return users;
}

export async function getCurrentUser({ em, req }: MyContext) {
    // User not logged in
    if(!req.session.userId) return null;
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
}

export async function login({ username, password}: { username: string, password: string}, { em, req }: MyContext) {
    const user = await em.findOne(User, { username });

    if(!user) {
        return {
            user: null,
            error: {
                code: 'NOT_FOUND',
                message: `No user with username ${username}.`
            }
        }
    }

    const validatePassword = await argon2.verify(user.password, password);
    if(!validatePassword) {
        return {
            user: null,
            error: {
                code: 'INVALID_PASSWORD',
                message: `No user with username ${username}.`
            }
        }
    }

    // store user id in the session
    req.session.userId = user.id;

    return {
        user,
        error: null
    };
}