"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticate(req, res, next) {
    var _a, _b, _c;
    // it will decide if you are authentic user or not
    let token = ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : "").toString();
    try {
        let decoded = jsonwebtoken_1.default.verify(token, (_c = process.env.SECRET_KEY) !== null && _c !== void 0 ? _c : "");
        req.headers["authorId"] = decoded._id;
        next();
    }
    catch (e) {
        res.json({
            status: false,
            message: 'Unauthorized',
            err: e
        });
    }
}
exports.authenticate = authenticate;
