import { Wechaty } from '../wechaty';
import { FileBox } from '../config';
import { Sayable } from '../types';
import { Contact } from './contact';
import { MiniProgram } from './mini-program';
import { Message } from './message';
import { UrlLink } from './url-link';
import { RoomMemberQueryFilter, RoomPayload, RoomQueryFilter } from 'wechaty-puppet';
import { RoomEventEmitter } from '../events/room-events';
/**
 * All WeChat rooms(groups) will be encapsulated as a Room.
 *
 * [Examples/Room-Bot]{@link https://github.com/wechaty/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/room-bot.ts}
 *
 */
declare class Room extends RoomEventEmitter implements Sayable {
    readonly id: string;
    static get wechaty(): Wechaty;
    get wechaty(): Wechaty;
    protected static pool: Map<string, Room>;
    /**
     * Create a new room.
     *
     * @static
     * @param {Contact[]} contactList
     * @param {string} [topic]
     * @returns {Promise<Room>}
     * @example <caption>Creat a room with 'lijiarui' and 'huan', the room topic is 'ding - created'</caption>
     * const helperContactA = await Contact.find({ name: 'lijiarui' })  // change 'lijiarui' to any contact in your WeChat
     * const helperContactB = await Contact.find({ name: 'huan' })  // change 'huan' to any contact in your WeChat
     * const contactList = [helperContactA, helperContactB]
     * console.log('Bot', 'contactList: %s', contactList.join(','))
     * const room = await Room.create(contactList, 'ding')
     * console.log('Bot', 'createDingRoom() new ding room created: %s', room)
     * await room.topic('ding - created')
     * await room.say('ding - created')
     */
    static create(contactList: Contact[], topic?: string): Promise<Room>;
    /**
     * The filter to find the room:  {topic: string | RegExp}
     *
     * @typedef    RoomQueryFilter
     * @property   {string} topic
     */
    /**
     * Find room by by filter: {topic: string | RegExp}, return all the matched room
     * @static
     * @param {RoomQueryFilter} [query]
     * @returns {Promise<Room[]>}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in
     * const roomList = await bot.Room.findAll()                    // get the room list of the bot
     * const roomList = await bot.Room.findAll({topic: 'wechaty'})  // find all of the rooms with name 'wechaty'
     */
    static findAll<T extends typeof Room>(this: T, query?: RoomQueryFilter): Promise<Array<T['prototype']>>;
    /**
     * Try to find a room by filter: {topic: string | RegExp}. If get many, return the first one.
     *
     * @param {RoomQueryFilter} query
     * @returns {Promise<Room | null>} If can find the room, return Room, or return null
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const roomList = await bot.Room.find()
     * const roomList = await bot.Room.find({topic: 'wechaty'})
     */
    static find<T extends typeof Room>(this: T, query: string | RoomQueryFilter): Promise<T['prototype'] | null>;
    /**
     * @ignore
     * About the Generic: https://stackoverflow.com/q/43003970/1123955
     *
     * Load room by topic. <br>
     * > Tips: For Web solution, it cannot get the unique topic id,
     * but for other solutions besides web,
     * we can get unique and permanent topic id.
     *
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @static
     * @param {string} id
     * @returns {Room}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = bot.Room.load('roomId')
     */
    static load<T extends typeof Room>(this: T, id: string): T['prototype'];
    /**
     * @ignore
     *
     * Instance Properties
     *
     *
     */
    protected payload?: RoomPayload;
    /**
     * @hideconstructor
     * @property {string}  id - Room id.
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     */
    protected constructor(id: string);
    /**
     * @ignore
     */
    toString(): string;
    [Symbol.asyncIterator](): AsyncIterableIterator<Contact>;
    /**
     * Force reload data for Room, Sync data from puppet API again.
     *
     * @returns {Promise<void>}
     * @example
     * await room.sync()
     */
    sync(): Promise<void>;
    /**
     * `ready()` is For FrameWork ONLY!
     *
     * Please not to use `ready()` at the user land.
     * If you want to sync data, use `sync()` instead.
     *
     * @ignore
     */
    ready(forceSync?: boolean): Promise<void>;
    /**
     * @ignore
     */
    isReady(): boolean;
    say(text: string): Promise<void | Message>;
    say(num: number): Promise<void | Message>;
    say(message: Message): Promise<void | Message>;
    say(text: string, ...mentionList: Contact[]): Promise<void | Message>;
    say(textList: TemplateStringsArray, ...varList: any[]): Promise<void | Message>;
    say(file: FileBox): Promise<void | Message>;
    say(url: UrlLink): Promise<void | Message>;
    say(mini: MiniProgram): Promise<void | Message>;
    say(contact: Contact): Promise<void | Message>;
    private sayTemplateStringsArray;
    /**
     * @desc       Room Class Event Type
     * @typedef    RoomEventName
     * @property   {string}  join  - Emit when anyone join any room.
     * @property   {string}  topic - Get topic event, emitted when someone change room topic.
     * @property   {string}  leave - Emit when anyone leave the room.<br>
     *                               If someone leaves the room by themselves, WeChat will not notice other people in the room, so the bot will never get the "leave" event.
     */
    /**
     * @desc       Room Class Event Function
     * @typedef    RoomEventFunction
     * @property   {Function} room-join       - (this: Room, inviteeList: Contact[] , inviter: Contact)  => void
     * @property   {Function} room-topic      - (this: Room, topic: string, oldTopic: string, changer: Contact) => void
     * @property   {Function} room-leave      - (this: Room, leaver: Contact) => void
     */
    /**
     * @listens Room
     * @param   {RoomEventName}      event      - Emit WechatyEvent
     * @param   {RoomEventFunction}  listener   - Depends on the WechatyEvent
     * @return  {this}                          - this for chain
     *
     * @example <caption>Event:join </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your WeChat
     * if (room) {
     *   room.on('join', (room, inviteeList, inviter) => {
     *     const nameList = inviteeList.map(c => c.name()).join(',')
     *     console.log(`Room got new member ${nameList}, invited by ${inviter}`)
     *   })
     * }
     *
     * @example <caption>Event:leave </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your WeChat
     * if (room) {
     *   room.on('leave', (room, leaverList) => {
     *     const nameList = leaverList.map(c => c.name()).join(',')
     *     console.log(`Room lost member ${nameList}`)
     *   })
     * }
     *
     * @example <caption>Event:message </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your WeChat
     * if (room) {
     *   room.on('message', (message) => {
     *     console.log(`Room received new message: ${message}`)
     *   })
     * }
     *
     * @example <caption>Event:topic </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your WeChat
     * if (room) {
     *   room.on('topic', (room, topic, oldTopic, changer) => {
     *     console.log(`Room topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
     *   })
     * }
     *
     * @example <caption>Event:invite </caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'topic of your room'}) // change `event-room` to any room topic in your WeChat
     * if (room) {
     *   room.on('invite', roomInvitation => roomInvitation.accept())
     * }
     *
     */
    /**
     * Add contact in a room
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * >
     * > see {@link https://github.com/wechaty/wechaty/issues/1441|Web version of WeChat closed group interface}
     *
     * @param {Contact} contact
     * @returns {Promise<void>}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const contact = await bot.Contact.find({name: 'lijiarui'}) // change 'lijiarui' to any contact in your WeChat
     * const room = await bot.Room.find({topic: 'WeChat'})        // change 'WeChat' to any room topic in your WeChat
     * if (room) {
     *   try {
     *      await room.add(contact)
     *   } catch(e) {
     *      console.error(e)
     *   }
     * }
     */
    add(contact: Contact): Promise<void>;
    /**
     * Delete a contact from the room
     * It works only when the bot is the owner of the room
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * >
     * > see {@link https://github.com/wechaty/wechaty/issues/1441|Web version of WeChat closed group interface}
     *
     * @param {Contact} contact
     * @returns {Promise<void>}
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const room = await bot.Room.find({topic: 'WeChat'})          // change 'WeChat' to any room topic in your WeChat
     * const contact = await bot.Contact.find({name: 'lijiarui'})   // change 'lijiarui' to any room member in the room you just set
     * if (room) {
     *   try {
     *      await room.del(contact)
     *   } catch(e) {
     *      console.error(e)
     *   }
     * }
     */
    del(contact: Contact): Promise<void>;
    /**
     * Bot quit the room itself
     *
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @returns {Promise<void>}
     * @example
     * await room.quit()
     */
    quit(): Promise<void>;
    topic(): Promise<string>;
    topic(newTopic: string): Promise<void>;
    announce(): Promise<string>;
    announce(text: string): Promise<void>;
    /**
     * Get QR Code Value of the Room from the room, which can be used as scan and join the room.
     * > Tips:
     * 1. This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * 2. The return should be the QR Code Data, instead of the QR Code Image. (the data should be less than 8KB. See: https://stackoverflow.com/a/12764370/1123955 )
     * @returns {Promise<string>}
     */
    qrCode(): Promise<string>;
    /**
     * Return contact's roomAlias in the room
     * @param {Contact} contact
     * @returns {Promise<string | null>} - If a contact has an alias in room, return string, otherwise return null
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const room = m.room()
     *   const contact = m.from()
     *   if (room) {
     *     const alias = await room.alias(contact)
     *     console.log(`${contact.name()} alias is ${alias}`)
     *   }
     * })
     * .start()
     */
    alias(contact: Contact): Promise<null | string>;
    /**
     * Check if the room has member `contact`, the return is a Promise and must be `await`-ed
     *
     * @param {Contact} contact
     * @returns {Promise<boolean>} Return `true` if has contact, else return `false`.
     * @example <caption>Check whether 'lijiarui' is in the room 'wechaty'</caption>
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in...
     * const contact = await bot.Contact.find({name: 'lijiarui'})   // change 'lijiarui' to any of contact in your WeChat
     * const room = await bot.Room.find({topic: 'wechaty'})         // change 'wechaty' to any of the room in your WeChat
     * if (contact && room) {
     *   if (await room.has(contact)) {
     *     console.log(`${contact.name()} is in the room wechaty!`)
     *   } else {
     *     console.log(`${contact.name()} is not in the room wechaty!`)
     *   }
     * }
     */
    has(contact: Contact): Promise<boolean>;
    memberAll(): Promise<Contact[]>;
    memberAll(name: string): Promise<Contact[]>;
    memberAll(filter: RoomMemberQueryFilter): Promise<Contact[]>;
    member(name: string): Promise<null | Contact>;
    member(filter: RoomMemberQueryFilter): Promise<null | Contact>;
    /**
      * @ignore
     * @ignore
     *
     * Get all room member from the room
     *
     * @returns {Promise<Contact[]>}
     * @example
     * await room.memberList()
     */
    private memberList;
    /**
     * Get room's owner from the room.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @returns {(Contact | null)}
     * @example
     * const owner = room.owner()
     */
    owner(): null | Contact;
    /**
     * Get avatar from the room.
     * @returns {FileBox}
     * @example
     * const fileBox = await room.avatar()
     * const name = fileBox.name
     * fileBox.toFile(name)
     */
    avatar(): Promise<FileBox>;
}
declare function wechatifyRoom(wechaty: Wechaty): typeof Room;
export { Room, wechatifyRoom, };
//# sourceMappingURL=room.d.ts.map