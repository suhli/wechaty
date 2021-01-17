"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechatifyFavorite = exports.Favorite = void 0;
const config_1 = require("../config");
class Favorite {
    static get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    static list() {
        return [];
    }
    /**
     * Get tags for all favorites
     *
     * @static
     * @returns {Promise<Tag[]>}
     * @example
     * const tags = await wechaty.Favorite.tags()
     */
    static async tags() {
        config_1.log.verbose('Favorite', 'static tags() for %s', this);
        // TODO:
        // try {
        //   const tagIdList = await this.puppet.tagFavoriteList()
        //   const tagList = tagIdList.map(id => this.wechaty.Tag.load(id))
        //   return tagList
        // } catch (e) {
        //   log.error('Favorite', 'static tags() exception: %s', e.message)
        //   return []
        // }
        return [];
    }
    /*
     * @hideconstructor
     */
    constructor() {
    }
    async tags() {
        // TODO: implmente this method
        return [];
    }
    async findAll() {
        //
    }
}
exports.Favorite = Favorite;
function wechatifyFavorite(wechaty) {
    class WechatifiedFavorite extends Favorite {
        static get wechaty() { return wechaty; }
        get wechaty() { return wechaty; }
    }
    return WechatifiedFavorite;
}
exports.wechatifyFavorite = wechatifyFavorite;
//# sourceMappingURL=favorite.js.map