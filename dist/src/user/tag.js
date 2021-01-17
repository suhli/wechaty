"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechatifyTag = exports.Tag = void 0;
/**
 *   Wechaty Chatbot SDK - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
const clone_class_1 = require("clone-class");
const config_1 = require("../config");
const contact_1 = require("./contact");
const favorite_1 = require("./favorite");
class Tag {
    /**
     * @hideconstructor
     */
    constructor(id) {
        this.id = id;
        config_1.log.silly('Tag', `constructor(${id})`);
        const MyClass = clone_class_1.instanceToClass(this, Tag);
        if (MyClass === Tag) {
            throw new Error('Tag class can not be instantiated directly!'
                + 'See: https://github.com/Chatie/wechaty/issues/1217');
        }
        if (!this.wechaty.puppet) {
            throw new Error('Tag class can not be instantiated without a puppet!');
        }
    }
    static get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    /**
     * @private
     * About the Generic: https://stackoverflow.com/q/43003970/1123955
     *
     * Get Tag by id
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @static
     * @param {string} id
     * @returns {Tag}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * const tag = bot.Tag.load('tagId')
     */
    static load(id) {
        if (!this.pool) {
            config_1.log.verbose('Tag', 'load(%s) init pool', id);
            this.pool = new Map();
        }
        if (this === Tag) {
            throw new Error('The global Tag class can not be used directly!'
                + 'See: https://github.com/Chatie/wechaty/issues/1217');
        }
        if (this.pool === Tag.pool) {
            throw new Error('the current pool is equal to the global pool error!');
        }
        const existingTag = this.pool.get(id);
        if (existingTag) {
            return existingTag;
        }
        const newTag = new this(id);
        this.pool.set(id, newTag);
        return newTag;
    }
    /**
     * Get a Tag instance for "tag"
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @static
     * @param {string} [tag] the tag name which want to create
     * @returns {Promise<Tag>}
     * @example
     * const bot = new Wechaty()
     * await bot.Tag.get('TagName')
     */
    static async get(tag) {
        config_1.log.verbose('Tag', 'get(%s)', tag);
        return this.load(tag);
    }
    /**
     * Delete a tag from Wechat
     *
     * If you want to delete a tag, please make sure there's no more Contact/Favorite(s) are using this tag.
     * If this tag is be used by any Contact/Favorite, then it can not be deleted.
     * (This is for protecting the tag being deleted by mistake)
     *
     * @static
     * @returns {Promise<Tag[]>}
     * @example
     * const tag = wechaty.Tag.get('tag')
     * await wechaty.Tag.delete(tag)
     */
    static async delete(tag, target) {
        config_1.log.verbose('Tag', 'static delete(%s)', tag);
        try {
            /**
             * TODO(huan): add tag check code here for checking if this tag is still being used.
             */
            if (!target || target === contact_1.Contact || target === this.wechaty.Contact) {
                await this.wechaty.puppet.tagContactDelete(tag.id);
                // TODO:
                // } else if (!target || target === Favorite || target === this.wechaty.Favorite) {
                //   await this.wechaty.puppet.tagFavoriteDelete(tag.id)
            }
        }
        catch (e) {
            config_1.log.error('Tag', 'static delete() exception: %s', e.message);
        }
    }
    /**
     * Add tag for contact
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @param {Contact} [to] the contact which need to add tag
     * @returns {Promise<void>}
     * @example
     * await tag.add(contact)
     */
    async add(to) {
        config_1.log.verbose('Tag', 'add(%s) for %s', to, this.id);
        try {
            if (to instanceof contact_1.Contact) {
                await this.wechaty.puppet.tagContactAdd(this.id, to.id);
            }
            else if (to instanceof favorite_1.Favorite) {
                // TODO: await this.wechaty.puppet.tagAddFavorite(this.tag, to.id)
            }
        }
        catch (e) {
            config_1.log.error('Tag', 'add() exception: %s', e.message);
            throw new Error(`add error : ${e}`);
        }
    }
    /**
     * Remove this tag from Contact/Favorite
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/Chatie/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @returns {Promise<void>}
     * @example
     * await tag.remove(contact)
     */
    async remove(from) {
        config_1.log.verbose('Tag', 'remove(%s) for %s', from, this.id);
        try {
            if (from instanceof contact_1.Contact) {
                await this.wechaty.puppet.tagContactRemove(this.id, from.id);
            }
            else if (from instanceof favorite_1.Favorite) {
                // TODO await this.wechaty.puppet.tagRemoveFavorite(this.tag, from.id)
            }
        }
        catch (e) {
            config_1.log.error('Tag', 'remove() exception: %s', e.message);
            throw new Error(`remove error : ${e}`);
        }
    }
}
exports.Tag = Tag;
function wechatifyTag(wechaty) {
    class WechatifiedTag extends Tag {
        static get wechaty() { return wechaty; }
        get wechaty() { return wechaty; }
    }
    return WechatifiedTag;
}
exports.wechatifyTag = wechatifyTag;
//# sourceMappingURL=tag.js.map