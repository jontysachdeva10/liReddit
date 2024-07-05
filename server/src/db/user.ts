import { MyContext } from "../types";
import { User } from "../entities/User";
import * as argon2 from "argon2";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { validateRegisteration } from "../utils/validateRegisteration";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { AppDataSource } from "../typeorm.config";
import { UserResponse } from "../customResponse/userResponse";

export async function registerUser(
  {
    username,
    email,
    password,
  }: { username: string; email: string; password: string },
  { req }: MyContext
): Promise<UserResponse> {
  const error = validateRegisteration(username, email, password);
  if (error) return error;

  const hashedPassword = await argon2.hash(password);
  let user;
  try {
    // User.create({
    //   username,
    //   email,
    //   password: hashedPassword,
    // }).save()

    //  OR

    // Insert Query Builder
    const result = await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          username,
          email,
          password: hashedPassword,
        },
      ])
      .returning("*")
      .execute();
    user = result.raw[0];
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
  req.session.userId = user.id;

  return {
    user,
  };
}

export async function getUsers(): Promise<User[] | null> {
  return await User.find();
}

export async function getCurrentUser({ req }: MyContext): Promise<User | null> {
  // User not logged in
  if (!req.session.userId) return null;
  const user = await User.findOneBy({ id: req.session.userId });
  return user;
}

export async function login(
  { usernameOrEmail, password }: { usernameOrEmail: string; password: string },
  { req }: MyContext
): Promise<UserResponse> {
  const user = await User.findOneBy(
    usernameOrEmail.includes("@")
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail }
  );

  if (!user) {
    return {
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
  };
}

export async function logout({ req, res }: MyContext): Promise<Boolean> {
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

export async function forgotPassword(
  { email }: { email: string },
  { redisClient }: MyContext
): Promise<Boolean> {
  const user = await User.findOneBy({ email });

  if (!user) {
    // email is not in DB
    return true;
  }

  const token = v4();
  await redisClient.set(FORGOT_PASSWORD_PREFIX + token, user.id);

  sendEmail(
    email,
    "Reset Password",
    `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
  );

  return true;
}

export async function changePassword(
  { token, newPassword }: { token: string; newPassword: string },
  { req, res, redisClient }: MyContext
): Promise<UserResponse> {
  if (newPassword.length <= 2) {
    return {
      error: {
        code: "INVALID_PASSWORD",
        field: "newPassword",
        message: "Length must be greater than 2.",
      },
    };
  }

  const userId = await redisClient.get(FORGOT_PASSWORD_PREFIX + token);
  if (!userId) {
    return {
      error: {
        code: "EXPIRED_TOKEN",
        field: "token",
        message: "Token expired.",
      },
    };
  }

  const userIdNum = parseInt(userId);
  const user = await User.findOneBy({ id: userIdNum });
  if (!user) {
    return {
      error: {
        code: "NOT_FOUND",
        field: "token",
        message: "User no longer exists.",
      },
    };
  }

  await User.update(
    { id: userIdNum },
    { password: await argon2.hash(newPassword) }
  );

  // delete the token once password is changed, so that user can only use token 1'ce to change password
  await redisClient.del(FORGOT_PASSWORD_PREFIX + token);

  // log in user after change password
  req.session.userId = user.id;

  return {
    user,
  };
}
