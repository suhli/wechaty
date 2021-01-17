"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechatifyMiniProgram = exports.MiniProgram = void 0;
const config_1 = require("../config");
class MiniProgram {
    /*
     * @hideconstructor
     */
    constructor(payload) {
        this.payload = payload;
        config_1.log.verbose('MiniProgram', 'constructor()');
    }
    static get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    /**
     *
     * Create
     *
     */
    static async create() {
        config_1.log.verbose('MiniProgram', 'create()');
        // TODO: get appid and username from wechat
        const payload = {
            appid: 'todo',
            description: 'todo',
            pagePath: 'todo',
            thumbKey: 'todo',
            thumbUrl: 'todo',
            title: 'todo',
            username: 'todo',
        };
        return new MiniProgram(payload);
    }
    appid() {
        return this.payload.appid;
    }
    title() {
        return this.payload.title;
    }
    pagePath() {
        return this.payload.pagePath;
    }
    username() {
        return this.payload.username;
    }
    description() {
        return this.payload.description;
    }
    thumbUrl() {
        return this.payload.thumbUrl;
    }
    thumbKey() {
        return this.payload.thumbKey;
    }
}
exports.MiniProgram = MiniProgram;
function wechatifyMiniProgram(wechaty) {
    class WechatifiedMiniProgram extends MiniProgram {
        static get wechaty() { return wechaty; }
        get wechaty() { return wechaty; }
    }
    return WechatifiedMiniProgram;
}
exports.wechatifyMiniProgram = wechatifyMiniProgram;
//# sourceMappingURL=mini-program.js.map