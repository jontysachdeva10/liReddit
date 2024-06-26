"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.logout = exports.login = exports.getCurrentUser = exports.getUsers = exports.registerUser = void 0;
const User_1 = require("../entities/User");
const argon2 = __importStar(require("argon2"));
const constants_1 = require("../constants");
const validateRegisteration_1 = require("../utils/validateRegisteration");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
function registerUser(_a, _b) {
    return __awaiter(this, arguments, void 0, function* ({ username, email, password, }, { em, req }) {
        const error = (0, validateRegisteration_1.validateRegisteration)(username, email, password);
        if (error)
            return error;
        const hashedPassword = yield argon2.hash(password);
        const newUser = new User_1.User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = hashedPassword;
        try {
            yield em.persistAndFlush(newUser);
        }
        catch (err) {
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
    });
}
exports.registerUser = registerUser;
function getUsers(_a) {
    return __awaiter(this, arguments, void 0, function* ({ em }) {
        const users = yield em.find(User_1.User, {});
        return users;
    });
}
exports.getUsers = getUsers;
function getCurrentUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ em, req, }) {
        // User not logged in
        if (!req.session.userId)
            return null;
        const user = yield em.findOne(User_1.User, { id: req.session.userId });
        return user;
    });
}
exports.getCurrentUser = getCurrentUser;
function login(_a, _b) {
    return __awaiter(this, arguments, void 0, function* ({ usernameOrEmail, password }, { em, req }) {
        const user = yield em.findOne(User_1.User, usernameOrEmail.includes("@")
            ? { email: usernameOrEmail }
            : { username: usernameOrEmail });
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
        const validatePassword = yield argon2.verify(user.password, password);
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
    });
}
exports.login = login;
function logout(_a) {
    return __awaiter(this, arguments, void 0, function* ({ em, req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err, "Error");
                resolve(false);
                return;
            }
            resolve(true);
        }));
    });
}
exports.logout = logout;
function forgotPassword(_a, _b) {
    return __awaiter(this, arguments, void 0, function* ({ email }, { em, req, redisClient }) {
        const user = yield em.findOne(User_1.User, { email });
        if (!user) {
            // email is not in DB
            return true;
        }
        const token = (0, uuid_1.v4)();
        yield redisClient.set(constants_1.FORGOT_PASSWORD_PREFIX + token, user.id);
        (0, sendEmail_1.sendEmail)(email, 'Reset Password', `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`);
        return true;
    });
}
exports.forgotPassword = forgotPassword;
