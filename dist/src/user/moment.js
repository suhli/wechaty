"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechatifyMoment = exports.Moment = void 0;
class Moment {
    static get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    static post() {
        // post new moment
    }
    static timeline(contact) {
        // list all moment
        if (contact) {
            //
        }
        return [];
    }
    /*
     * @hideconstructor
     */
    constructor() {
        //
    }
}
exports.Moment = Moment;
function wechatifyMoment(wechaty) {
    class WechatifiedMoment extends Moment {
        static get wechaty() { return wechaty; }
        get wechaty() { return wechaty; }
    }
    return WechatifiedMoment;
}
exports.wechatifyMoment = wechatifyMoment;
//# sourceMappingURL=moment.js.map