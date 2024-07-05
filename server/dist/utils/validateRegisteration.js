"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegisteration = void 0;
const validateRegisteration = (username, email, password) => {
    if (username.length <= 2) {
        return {
            error: {
                code: "INVALID_USERNAME",
                field: "username",
                message: "Length must be greater than 2.",
            },
        };
    }
    if (username.includes('@')) {
        return {
            error: {
                code: "INVALID_USERNAME",
                field: "username",
                message: "Cannot include @.",
            },
        };
    }
    if (!email.includes("@")) {
        return {
            error: {
                code: "INVALID_EMAIL",
                field: "email",
                message: "Invalid email.",
            },
        };
    }
    if (password.length <= 2) {
        return {
            error: {
                code: "INVALID_PASSWORD",
                field: "password",
                message: "Length must be greater than 2.",
            },
        };
    }
    return null;
};
exports.validateRegisteration = validateRegisteration;
