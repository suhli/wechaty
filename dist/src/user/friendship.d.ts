/// <reference types="node" />
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
import { EventEmitter } from 'events';
import { Wechaty } from '../wechaty';
import { FriendshipPayload, FriendshipType, FriendshipSearchQueryFilter, FriendshipSource } from 'wechaty-puppet';
import { Acceptable } from '../types';
import { Contact } from './contact';
/**
 * Send, receive friend request, and friend confirmation events.
 *
 * 1. send request
 * 2. receive request(in friend event)
 * 3. confirmation friendship(friend event)
 *
 * [Examples/Friend-Bot]{@link https://github.com/wechaty/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/friend-bot.ts}
 */
declare class Friendship extends EventEmitter implements Acceptable {
    readonly id: string;
    static get wechaty(): Wechaty;
    get wechaty(): Wechaty;
    static Type: typeof FriendshipType;
    /**
     * @ignore
     */
    static load<T extends typeof Friendship>(this: T, id: string): T['prototype'];
    /**
     * Search a Friend by phone or weixin.
     *
     * The best practice is to search friend request once per minute.
     * Remeber not to do this too frequently, or your account may be blocked.
     *
     * @param {FriendshipSearchCondition} condition - Search friend by phone or weixin.
     * @returns {Promise<Contact>}
     *
     * @example
     * const friend_phone = await bot.Friendship.search({phone: '13112341234'})
     * const friend_weixin = await bot.Friendship.search({weixin: 'weixin_account'})
     *
     * console.log(`This is the new friend info searched by phone : ${friend_phone}`)
     * await bot.Friendship.add(friend_phone, 'hello')
     *
     */
    static search(queryFiter: FriendshipSearchQueryFilter): Promise<null | Contact>;
    /**
     * Send a Friend Request to a `contact` with message `hello`.
     *
     * The best practice is to send friend request once per minute.
     * Remeber not to do this too frequently, or your account may be blocked.
     *
     * @param {Contact} contact - Send friend request to contact
     * @param {string} hello    - The friend request content
     * @returns {Promise<void>}
     *
     * @example
     * const memberList = await room.memberList()
     * for (let i = 0; i < memberList.length; i++) {
     *   await bot.Friendship.add(member, 'Nice to meet you! I am wechaty bot!')
     * }
     */
    static add(contact: Contact, hello: string): Promise<void>;
    static del(contact: Contact): Promise<void>;
    /**
     *
     * Instance Properties
     *
     */
    /**
      * @ignore
     */
    protected payload?: FriendshipPayload;
    constructor(id: string);
    toString(): string;
    isReady(): boolean;
    /**
     * no `dirty` support because Friendship has no rawPayload(yet)
      * @ignore
     */
    ready(): Promise<void>;
    /**
     * Accept Friend Request
     *
     * @returns {Promise<void>}
     *
     * @example
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   try {
     *     console.log(`received friend event.`)
     *     switch (friendship.type()) {
     *
     *     // 1. New Friend Request
     *
     *     case Friendship.Type.Receive:
     *       await friendship.accept()
     *       break
     *
     *     // 2. Friend Ship Confirmed
     *
     *     case Friendship.Type.Confirm:
     *       console.log(`friend ship confirmed`)
     *       break
     *     }
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    accept(): Promise<void>;
    /**
     * Get verify message from
     *
     * @returns {string}
     * @example <caption>If request content is `ding`, then accept the friendship</caption>
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   try {
     *     console.log(`received friend event from ${friendship.contact().name()}`)
     *     if (friendship.type() === Friendship.Type.Receive && friendship.hello() === 'ding') {
     *       await friendship.accept()
     *     }
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    hello(): string;
    /**
     * Get the contact from friendship
     *
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   const contact = friendship.contact()
     *   const name = contact.name()
     *   console.log(`received friend event from ${name}`)
     * }
     * .start()
     */
    contact(): Contact;
    /**
     * Return the Friendship Type
     * > Tips: FriendshipType is enum here. </br>
     * - FriendshipType.Unknown  </br>
     * - FriendshipType.Confirm  </br>
     * - FriendshipType.Receive  </br>
     * - FriendshipType.Verify   </br>
     *
     * @returns {FriendshipType}
     *
     * @example <caption>If request content is `ding`, then accept the friendship</caption>
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   try {
     *     if (friendship.type() === Friendship.Type.Receive && friendship.hello() === 'ding') {
     *       await friendship.accept()
     *     }
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    type(): FriendshipType;
    source(): FriendshipSource | null;
    /**
     * get friendShipPayload Json
     * @returns {FriendshipPayload}
     *
     * @example
     * const bot = new Wechaty()
     * bot.on('friendship', async friendship => {
     *   try {
     *     // JSON.stringify(friendship) as well.
     *     const payload = await friendship.toJSON()
     *   } catch (e) {
     *     console.error(e)
     *   }
     * }
     * .start()
     */
    toJSON(): string;
    /**
     * create friendShip by friendshipJson
     * @example
     * const bot = new Wechaty()
     * bot.start()
     *
     * const payload = '{...}'  // your saved JSON payload
     * const friendship = bot.FriendShip.fromJSON(friendshipFromDisk)
     * await friendship.accept()
     */
    static fromJSON(payload: string | FriendshipPayload): Promise<Friendship>;
}
declare function wechatifyFriendship(wechaty: Wechaty): typeof Friendship;
export { Friendship, wechatifyFriendship, };
//# sourceMappingURL=friendship.d.ts.map