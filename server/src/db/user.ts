import { MyContext } from "../types";
import { User } from "../entities/User";
import * as argon2 from "argon2";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { validateRegisteration } from "../utils/validateRegisteration";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

export async function registerUser(
  {
    username,
    email,
    password,
  }: { username: string; email: string; password: string },
  { em, req }: MyContext
) {

  const error = validateRegisteration(username, email, password);
  if(error) return error ;

  const hashedPassword = await argon2.hash(password);

  const newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.password = hashedPassword;

  try {
    await em.persistAndFlush(newUser);
  } catch (err: any) {
    if (err.code === "23505") {
      return {
        error: {
          code: "ALREADY_EXIST",
          field: "username",
          message: "Username is already taken.",
        },
      };
    }
    console.error(err.message);
  }

  // store user id session, this will set cookie on the user & keep them logged in
  req.session.userId = newUser.id;

  return {
    user: newUser,
  };
}

export async function getUsers({ em }: MyContext): Promise<User[] | null> {
  const users = await em.find(User, {});
  return users;
}

export async function getCurrentUser({
  em,
  req,
}: MyContext): Promise<User | null> {
  // User not logged in
  if (!req.session.userId) return null;
  const user = await em.findOne(User, { id: req.session.userId });
  return user;
}

export async function login(
  { usernameOrEmail, password }: { usernameOrEmail: string; password: string },
  { em, req }: MyContext
) {
  const user = await em.findOne(
    User,
    usernameOrEmail.includes("@")
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail }
  );

  if (!user) {
    return {
      user: null,
      error: {
        code: "NOT_FOUND",
        field: "usernameOrEmail",
        message: `No user found with username/email ${usernameOrEmail}.`,
      },
    };
  }

  const validatePassword = await argon2.verify(user.password, password);
  if (!validatePassword) {
    return {
      user: null,
      error: {
        code: "INVALID_PASSWORD",
        field: "password",
        message: `Your password doesn't match.`,
      },
    };
  }

  // store user id in the session
  req.session.userId = user.id;

  return {
    user,
    error: null,
  };
}

export async function logout({ em, req, res }: MyContext) {
  return new Promise((resolve) =>
    req.session.destroy((err) => {
      res.clearCookie(COOKIE_NAME);
      if (err) {
        console.log(err, "Error");
        resolve(false);
        return;
      }

      resolve(true);
    })
  );
}

export async function forgotPassword({ email }: { email:string }, { em, req, redisClient }: MyContext) {
  const user = await em.findOne(User, { email });
  
  if(!user) {
    // email is not in DB
    return true;
  }

  const token = v4();
  await redisClient.set(FORGOT_PASSWORD_PREFIX + token, user.id);

  sendEmail(
    email,
    'Reset Password',
    `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
  );

  return true;
}

export async function changePassword({ token, newPassword }: { token: string, newPassword: string }, { em, req, res, redisClient }: MyContext) {
  if (newPassword.length <= 2) {
    return {
      user: null,
      error: {
        code: "INVALID_PASSWORD",
        field: "newPassword",
        message: "Length must be greater than 2.",
      },
    };
  }

  const userId = await redisClient.get(FORGOT_PASSWORD_PREFIX + token);
  if(!userId) {
    return {
      user: null,
      error: {
        code: "EXPIRED_TOKEN",
        field: "token",
        message: "Token expired.",
      },
    };
  }

  const user = await em.findOne(User, { id: parseInt(userId) });
  if(!user) {
    return {
      user: null,
      error: {
        code: "NOT_FOUND",
        field: "token",
        message: "User no longer exists.",
      },
    };
  }

  user.password = await argon2.hash(newPassword);
  await em.persistAndFlush(user);

  // delete the token once password is changed, so that user can only use token 1'ce to change password
  await redisClient.del(FORGOT_PASSWORD_PREFIX + token)

  // log in user after change password
  req.session.userId = user.id;

  return {
    user
  }
}