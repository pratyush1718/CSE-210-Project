"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagController_1 = require("../controllers/tagController");
const recController_1 = require("../controllers/recController");
const router = express_1.default.Router();
// Look into editing this later; what if two titles are the same?
router.post("/user/:username/content/:title", tagController_1.addTagsToUser);
router.post("/user/:username/recommendations", recController_1.recommendContent);
exports.default = router;
