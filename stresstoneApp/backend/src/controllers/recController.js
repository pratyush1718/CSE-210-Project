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
exports.recommendContent = void 0;
const User_1 = __importDefault(require("../models/User"));
const Content_1 = __importDefault(require("../models/Content"));
const recommendContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            res.status(404).json({ message: "Username does not exist." });
            return;
        }
        const userTags = user.tags;
        const contents = yield Content_1.default.find();
        const scoredContent = contents.map((content) => {
            const matchingTags = content.tags.filter((tag) => userTags.some(userTag => userTag.tag === tag)).length;
            return { content, score: matchingTags };
        });
        scoredContent.sort((a, b) => b.score - a.score);
        const top10results = scoredContent.slice(0, 10).map((item) => item.content);
        res.status(200).json({ recommendations: top10results });
        return;
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "An error ocurred ", error });
        return;
    }
});
exports.recommendContent = recommendContent;
