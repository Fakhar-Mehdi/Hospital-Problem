"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = asyncHandler;
