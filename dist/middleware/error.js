"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("data");
const helper_1 = require("helper");
const error = (err, req, res, next) => {
    if (res.statusCode === 200)
        res.status(500);
    res.send((0, helper_1.logger)(`Following Error Occurred:\n${err.message || data_1.SERVER.ERROR_MESSAGE}`, "error"));
    next();
};
exports.default = error;
