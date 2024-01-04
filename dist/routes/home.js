"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const home_1 = require("controllers/home");
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = __importDefault(require("middleware/asyncHandler"));
const homeRouter = express_1.default.Router();
homeRouter.route("/").get((0, asyncHandler_1.default)(home_1.homeEndPoint));
exports.default = homeRouter;
