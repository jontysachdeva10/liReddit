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
exports.login = exports.getUsers = exports.registerUser = void 0;
const User_1 = require("../entities/User");
const mikroOrmSetup_1 = require("./mikroOrmSetup");
const argon2 = __importStar(require("argon2"));
function registerUser({ username, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const em = yield (0, mikroOrmSetup_1.initializeMikroORM)();
        const hashedPassword = yield argon2.hash(password);
        const newUser = new User_1.User();
        newUser.username = username;
        newUser.password = hashedPassword;
        try {
            yield em.persistAndFlush(newUser);
        }
        catch (err) {
            if (err.code === '23505') {
                return {
                    error: {
                        code: 'ALREADY_EXIST',
                        message: 'Username is already taken.'
                    }
                };
            }
            console.error(err.message);
        }
        return {
            user: newUser
        };
    });
}
exports.registerUser = registerUser;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const em = yield (0, mikroOrmSetup_1.initializeMikroORM)();
        const users = yield em.find(User_1.User, {});
        return users;
    });
}
exports.getUsers = getUsers;
// export async function getUserByUsername(username: string): Promise<User | null> {
//     const em = await initializeMikroORM();
//     const user = await em.findOne(User, { username });
//     return user;
// }
function login({ username, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const em = yield (0, mikroOrmSetup_1.initializeMikroORM)();
        const user = yield em.findOne(User_1.User, { username });
        if (!user) {
            return {
                user: null,
                error: {
                    code: 'NOT_FOUND',
                    message: `No user with username ${username}.`
                }
            };
        }
        const validatePassword = yield argon2.verify(user.password, password);
        if (!validatePassword) {
            return {
                user: null,
                error: {
                    code: 'INVALID_PASSWORD',
                    message: `No user with username ${username}.`
                }
            };
        }
        return {
            user,
            error: null
        };
    });
}
exports.login = login;
