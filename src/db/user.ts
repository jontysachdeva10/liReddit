import { User } from "../entities/User";
import { initializeMikroORM } from "./mikroOrmSetup";
import * as argon2 from 'argon2';

export async function registerUser({ username, password}: { username: string, password: string}) {
    const em = await initializeMikroORM();

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
    
    return {
        user: newUser
    };
}

export async function getUsers(): Promise<User[]> {
    const em = await initializeMikroORM();
    const users = await em.find(User, {});
    return users;
}

// export async function getUserByUsername(username: string): Promise<User | null> {
//     const em = await initializeMikroORM();
//     const user = await em.findOne(User, { username });
//     return user;
// }

export async function login({ username, password}: { username: string, password: string}) {
    const em = await initializeMikroORM();
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

    return {
        user,
        error: null
    };
}