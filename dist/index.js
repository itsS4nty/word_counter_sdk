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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordCounterSDK = void 0;
var WordCounterSDK = /** @class */ (function () {
    function WordCounterSDK(useListeners) {
        this.file = '';
        this.words = [];
        this.previousChunk = null;
        this.instance = null;
        if (useListeners) {
            this.instance = new WordCounterSDKListeners();
            return;
        }
        this.instance = new WordCounterSDKWithoutListeners();
    }
    WordCounterSDK.prototype.setFile = function (file) {
        if (!file)
            return;
        this.file = file;
    };
    WordCounterSDK.prototype.addWord = function (word) {
        if (!word)
            return;
        this.words.push(word);
    };
    WordCounterSDK.prototype.setWords = function (words) {
        if (!words || !words.length)
            return;
        this.words = __spreadArray(__spreadArray([], this.words, true), words, true);
    };
    WordCounterSDK.prototype.findWords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, reader, result, chunk, decoder, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.file)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch(this.file)];
                    case 1:
                        response = _a.sent();
                        if (!response || !response.body)
                            return [2 /*return*/];
                        reader = response.body.getReader();
                        return [4 /*yield*/, reader.read()];
                    case 2:
                        result = _a.sent();
                        chunk = result.value;
                        _a.label = 3;
                    case 3:
                        if (!!result.done) return [3 /*break*/, 5];
                        decoder = new TextDecoder();
                        text = decoder.decode(chunk);
                        this.analyzeChunk(text.toLowerCase());
                        return [4 /*yield*/, reader.read()];
                    case 4:
                        result = _a.sent();
                        chunk = result.value;
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    WordCounterSDK.prototype.getTotal = function () {
        if (!this.instance)
            return;
        return this.instance.getTotal();
    };
    WordCounterSDK.prototype.subscribeToEvents = function (callback) {
        if (this.instance instanceof WordCounterSDKListeners) {
            this.instance.subscribeToEvents(callback);
            return;
        }
        throw new Error("Can't use this method on non listeners instance");
    };
    WordCounterSDK.prototype.unsubscribeToEvents = function (callback) {
        if (this.instance instanceof WordCounterSDKListeners) {
            this.instance.unsubscribeToEvents(callback);
            return;
        }
        throw new Error("Can't use this method on non listeners instance");
    };
    WordCounterSDK.prototype.analyzeChunk = function (chunk) {
        if (!this.instance)
            return;
        var words = chunk.split(/\b/);
        if (this.previousChunk && this.previousChunk.trim()) {
            words[0] = this.previousChunk + words[0];
            this.previousChunk = null;
        }
        if (words.length === 1) {
            this.instance.checkWords(this.words, words.join(''));
            return;
        }
        if (words[words.length - 1] && words[words.length - 1].trim()) {
            this.previousChunk = words[words.length - 1];
            words.pop();
        }
        chunk = words.join('');
        this.instance.checkWords(this.words, chunk);
    };
    return WordCounterSDK;
}());
exports.WordCounterSDK = WordCounterSDK;
// Listeners class
var WordCounterSDKListeners = /** @class */ (function () {
    function WordCounterSDKListeners() {
        var _this = this;
        this.suscribers = [];
        this.total = 0;
        this.getTotal = function () { return _this.total; };
    }
    WordCounterSDKListeners.prototype.checkWords = function (words, text) {
        var _this = this;
        words.forEach(function (word) {
            var regex = new RegExp("\\b" + word + "\\b", 'g');
            var matches = text.match(regex);
            if (matches && matches.length) {
                // Quitar el total cuando este todo acabado
                _this.total += matches.length;
                _this.publishOnWordFound(matches.length);
            }
        });
    };
    WordCounterSDKListeners.prototype.subscribeToEvents = function (callback) {
        this.suscribers.push(callback);
    };
    WordCounterSDKListeners.prototype.unsubscribeToEvents = function (callback) {
        var index = this.suscribers.indexOf(callback);
        if (index !== -1)
            this.suscribers.splice(index, 1);
    };
    WordCounterSDKListeners.prototype.publishOnWordFound = function (wordsFound) {
        this.suscribers.forEach(function (listener) { var _a; return (_a = listener.onWordFound) === null || _a === void 0 ? void 0 : _a.call(listener, wordsFound); });
    };
    return WordCounterSDKListeners;
}());
// No listeners class
var WordCounterSDKWithoutListeners = /** @class */ (function () {
    function WordCounterSDKWithoutListeners() {
        var _this = this;
        this.total = 0;
        this.getTotal = function () { return _this.total; };
    }
    WordCounterSDKWithoutListeners.prototype.checkWords = function (words, text) {
        var _this = this;
        words.forEach(function (word) {
            var regex = new RegExp("\\b" + word + "\\b", 'g');
            var matches = text.match(regex);
            if (matches && matches.length) {
                // Quitar el total cuando este todo acabado
                _this.total += matches.length;
            }
        });
    };
    return WordCounterSDKWithoutListeners;
}());
