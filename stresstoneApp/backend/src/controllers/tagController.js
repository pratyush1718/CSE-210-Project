"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTagsToUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Content_1 = __importDefault(require("../models/Content"));
const addTagsToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, title } = req.params;
    try {
        const content = yield Content_1.default.findOne({ title: title });
        if (!content) {
            res.status(404).send("Content not found.");
            return;
        }
        const user = yield User_1.default.findOne({ username: username });
        if (!user) {
            res.status(404).send("User not found.");
            return;
        }
        content.tags.forEach((tag) => {
            const tagExists = user.tags.find((userTag) => userTag.tag === tag);
            if (tagExists) {
                tagExists.count += 1;
            }
            else {
                user.tags.push({ tag, count: 1 });
            }
        });
        yield user.save();
    }
    catch (error) {
        console.error(error);
    }
});
exports.addTagsToUser = addTagsToUser;
