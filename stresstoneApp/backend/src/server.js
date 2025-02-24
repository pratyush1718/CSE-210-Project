"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const tagController_1 = require("./controllers/tagController");
const recController_1 = require("./controllers/recController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// For now, this is connecting to MongoDB localhost. Replace later!
mongoose_1.default.connect("mongodb://localhost:27017/test_database");
app.post("/user/:username/content/:title", tagController_1.addTagsToUser);
app.post("/user/:username/recommendations", recController_1.recommendContent);
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
