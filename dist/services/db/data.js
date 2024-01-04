"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
var DB;
(function (DB) {
    DB["CONNECTION_STRING"] = "mongodb+srv://hospital:hospital@cluster0.kzgkl61.mongodb.net/?retryWrites=true&w=majority";
    DB["SUCCESS_MESSAGE"] = "Connected to mongoDb";
    DB["ERROR_MESSAGE"] = "\nUnable to connect to mongodb.\n\nFollowing error occurred:\n";
})(DB || (exports.DB = DB = {}));
