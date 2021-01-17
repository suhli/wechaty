"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechatifyRoomInvitation = exports.RoomInvitation = void 0;
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
const timestamp_to_date_1 = require("../helper-functions/pure/timestamp-to-date");
/**
 *
 * accept room invitation
 */
class RoomInvitation {
    /**
     * @hideconstructor
     * Instance Properties
     *
     */
    constructor(id) {
        this.id = id;
        config_1.log.verbose('RoomInvitation', 'constructor(id=%s)', id);
        const MyClass = clone_class_1.instanceToClass(this, RoomInvitation);
        if (MyClass === RoomInvitation) {
            throw new Error('RoomInvitation class can not be instantiated directly! See: https://github.com/wechaty/wechaty/issues/1217');
        }
        if (!this.wechaty.puppet) {
            throw new Error('RoomInvitation class can not be instantiated without a puppet!');
        }
    }
    static get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    get wechaty() { throw new Error('This class can not be used directory. See: https://github.com/wechaty/wechaty/issues/2027'); }
    static load(id) {
        const newRoomInvitation = new this(id);
        return newRoomInvitation;
    }
    toString() {
        return [
            'RoomInvitation#',
            this.id || 'loading',
        ].join('');
    }
    /**
      * @ignore
     */
    async toStringAsync() {
        const payload = await this.wechaty.puppet.roomInvitationPayload(this.id);
        return [
            'RoomInvitation#',
            this.id,
            '<',
            payload.topic,
            ',',
            payload.inviterId,
            '>',
        ].join('');
    }
    /**
     * Accept Room Invitation
     *
     * @returns {Promise<void>}
     *
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   try {
     *     console.log(`received room-invite event.`)
     *     await roomInvitation.accept()
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    async accept() {
        config_1.log.verbose('RoomInvitation', 'accept()');
        await this.wechaty.puppet.roomInvitationAccept(this.id);
        const inviter = await this.inviter();
        const topic = await this.topic();
        try {
            await inviter.ready();
            config_1.log.verbose('RoomInvitation', 'accept() with room(%s) & inviter(%s) ready()', topic, inviter);
            return;
        }
        catch (e) {
            config_1.log.warn('RoomInvitation', 'accept() inviter(%s) is not ready because of %s', inviter, (e && e.message) || e);
        }
    }
    /**
     * Get the inviter from room invitation
     *
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   const inviter = await roomInvitation.inviter()
     *   const name = inviter.name()
     *   console.log(`received room invitation event from ${name}`)
     * }
     * .start()
     */
    async inviter() {
        config_1.log.verbose('RoomInvitation', 'inviter()');
        const payload = await this.wechaty.puppet.roomInvitationPayload(this.id);
        const inviter = this.wechaty.Contact.load(payload.inviterId);
        return inviter;
    }
    /**
     * Get the room topic from room invitation
     *
     * @returns {string}
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *   const topic = await roomInvitation.topic()
     *   console.log(`received room invitation event from room ${topic}`)
     * }
     * .start()
     */
    async topic() {
        const payload = await this.wechaty.puppet.roomInvitationPayload(this.id);
        return payload.topic || payload.topic || '';
    }
    async memberCount() {
        config_1.log.verbose('RoomInvitation', 'memberCount()');
        const payload = await this.wechaty.puppet.roomInvitationPayload(this.id);
        return payload.memberCount || payload.memberCount || 0;
    }
    /**
     * List of Room Members that you known(is friend)
      * @ignore
     */
    async memberList() {
        config_1.log.verbose('RoomInvitation', 'roomMemberList()');
        const payload = await this.wechaty.puppet.roomInvitationPayload(this.id);
        const contactIdList = payload.memberIdList || payload.memberIdList || [];
        const contactList = contactIdList.map(id => this.wechaty.Contact.load(id));
        await Promise.all(contactList.map(c => c.ready()));
        return contactList;
    }
    /**
     * Get the invitation time
     *
     * @returns {Promise<Date>}
     */
    async date() {
        config_1.log.verbose('RoomInvitation', 'date()');
        const payload = await this.wechaty.puppet.roomInvitationPayload(this.id);
        return timestamp_to_date_1.timestampToDate(payload.timestamp);
    }
    /**
     * Returns the roopm invitation age in seconds. <br>
     *
     * For example, the invitation is sent at time `8:43:01`,
     * and when we received it in Wechaty, the time is `8:43:15`,
     * then the age() will return `8:43:15 - 8:43:01 = 14 (seconds)`
     * @returns {number}
     */
    async age() {
        const recvDate = await this.date();
        const ageMilliseconds = Date.now() - recvDate.getTime();
        const ageSeconds = Math.floor(ageMilliseconds / 1000);
        return ageSeconds;
    }
    /**
     * Load the room invitation info from disk
     *
     * @returns {RoomInvitation}
     * @example
     * const bot = new Wechaty()
     * const dataFromDisk // get the room invitation info data from disk
     * const roomInvitation = await bot.RoomInvitation.fromJSON(dataFromDisk)
     * await roomInvitation.accept()
     */
    static async fromJSON(payload) {
        config_1.log.verbose('RoomInvitation', 'fromJSON(%s)', typeof payload === 'string'
            ? payload
            : JSON.stringify(payload));
        if (typeof payload === 'string') {
            payload = JSON.parse(payload);
        }
        await this.wechaty.puppet.roomInvitationPayload(payload.id, payload);
        return this.wechaty.RoomInvitation.load(payload.id);
    }
    /**
     * Get the room invitation info when listened on room-invite event
     *
     * @returns {string}
     * @example
     * const bot = new Wechaty()
     * bot.on('room-invite', async roomInvitation => {
     *  const roomInvitation = bot.RoomInvitation.load(roomInvitation.id)
     *  const jsonData = await roomInvitation.toJSON(roomInvitation.id)
     *  // save the json data to disk, and we can use it by RoomInvitation.fromJSON()
     * }
     * .start()
     */
    async toJSON() {
        config_1.log.verbose('RoomInvitation', 'toJSON()');
        const payload = await this.wechaty.puppet.roomInvitationPayload(this.id);
        return JSON.stringify(payload);
    }
}
exports.RoomInvitation = RoomInvitation;
function wechatifyRoomInvitation(wechaty) {
    class WechatifiedRoomInvitation extends RoomInvitation {
        static get wechaty() { return wechaty; }
        get wechaty() { return wechaty; }
    }
    return WechatifiedRoomInvitation;
}
exports.wechatifyRoomInvitation = wechatifyRoomInvitation;
//# sourceMappingURL=room-invitation.js.map