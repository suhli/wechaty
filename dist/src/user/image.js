"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechatifyImage = exports.Image = void 0;
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
const wechaty_puppet_1 = require("wechaty-puppet");
const config_1 = require("../config");
class Image {
    constructor(id) {
        this.id = id;
        config_1.log.verbose('Image', 'constructor(%s)', id, this.constructor.name);
        const MyClass = clone_class_1.instanceToClass(this, Image);
        if (MyClass === Image) {
            throw new Error('Image class can not be instantiated directly! See: https://github.com/wechaty/wechaty/issues/1217');
        }
        if (!this.wechaty.puppet) {
            throw new Error('Image class can not be instantiated without a puppet!');
        }
    }
    static get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    static create(id) {
        config_1.log.verbose('Image', 'static create(%s)', id);
        const image = new this(id);
        return image;
    }
    async thumbnail() {
        config_1.log.verbose('Image', 'thumbnail() for id: "%s"', this.id);
        const fileBox = await this.wechaty.puppet.messageImage(this.id, wechaty_puppet_1.ImageType.Thumbnail);
        return fileBox;
    }
    async hd() {
        config_1.log.verbose('Image', 'hd() for id: "%s"', this.id);
        const fileBox = await this.wechaty.puppet.messageImage(this.id, wechaty_puppet_1.ImageType.HD);
        return fileBox;
    }
    async artwork() {
        config_1.log.verbose('Image', 'artwork() for id: "%s"', this.id);
        const fileBox = await this.wechaty.puppet.messageImage(this.id, wechaty_puppet_1.ImageType.Artwork);
        return fileBox;
    }
}
exports.Image = Image;
function wechatifyImage(wechaty) {
    class WechatifiedImage extends Image {
        static get wechaty() { return wechaty; }
        get wechaty() { return wechaty; }
    }
    return WechatifiedImage;
}
exports.wechatifyImage = wechatifyImage;
//# sourceMappingURL=image.js.map