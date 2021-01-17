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
import { MessagePayload, MessageQueryFilter, MessageType } from 'wechaty-puppet';
import { Wechaty } from '../wechaty';
import { FileBox } from '../config';
import { Sayable } from '../types';
import { Contact } from './contact';
import { Room } from './room';
import { UrlLink } from './url-link';
import { MiniProgram } from './mini-program';
import { Image } from './image';
/**
 * All wechat messages will be encapsulated as a Message.
 *
 * [Examples/Ding-Dong-Bot]{@link https://github.com/wechaty/wechaty/blob/1523c5e02be46ebe2cc172a744b2fbe53351540e/examples/ding-dong-bot.ts}
 */
declare class Message extends EventEmitter implements Sayable {
    readonly id: string;
    static get wechaty(): Wechaty;
    get wechaty(): Wechaty;
    /**
     *
     * Static Properties
     *
     */
    /**
     * @ignore
     */
    static readonly Type: typeof MessageType;
    /**
     * Find message in cache
     */
    static find<T extends typeof Message>(this: T, query: string | MessageQueryFilter): Promise<T['prototype'] | null>;
    /**
     * Find messages in cache
     */
    static findAll<T extends typeof Message>(this: T, query?: MessageQueryFilter): Promise<Array<T['prototype']>>;
    /**
     * Create a Mobile Terminated Message
      * @ignore
     * @ignore
     * "mobile originated" or "mobile terminated"
     * https://www.tatango.com/resources/video-lessons/video-mo-mt-sms-messaging/
     */
    static load(id: string): Message;
    /**
     *
     * Instance Properties
     * @hidden
     *
     */
    protected payload?: MessagePayload;
    /**
     * @hideconstructor
     */
    protected constructor(id: string);
    /**
     * @ignore
     */
    toString(): string;
    conversation(): Contact | Room;
    /**
     * Get the talker of a message.
     * @returns {Contact}
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const talker = msg.talker()
     *   const text = msg.text()
     *   const room = msg.room()
     *   if (room) {
     *     const topic = await room.topic()
     *     console.log(`Room: ${topic} Contact: ${talker.name()} Text: ${text}`)
     *   } else {
     *     console.log(`Contact: ${talker.name()} Text: ${text}`)
     *   }
     * })
     * .start()
     */
    talker(): Contact;
    /**
     * Use `message.talker()` to replace `message.from()` #2094
     *  https://github.com/wechaty/wechaty/issues/2094
     */
    from(): null | Contact;
    /**
     * Get the destination of the message
     * Message.to() will return null if a message is in a room, use Message.room() to get the room.
     * @returns {(Contact|null)}
     */
    to(): null | Contact;
    /**
     * Get the room from the message.
     * If the message is not in a room, then will return `null`
     *
     * @returns {(Room | null)}
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const contact = msg.from()
     *   const text = msg.text()
     *   const room = msg.room()
     *   if (room) {
     *     const topic = await room.topic()
     *     console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
     *   } else {
     *     console.log(`Contact: ${contact.name()} Text: ${text}`)
     *   }
     * })
     * .start()
     */
    room(): null | Room;
    /**
     * Get the text content of the message
     *
     * @returns {string}
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const contact = msg.from()
     *   const text = msg.text()
     *   const room = msg.room()
     *   if (room) {
     *     const topic = await room.topic()
     *     console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
     *   } else {
     *     console.log(`Contact: ${contact.name()} Text: ${text}`)
     *   }
     * })
     * .start()
     */
    text(): string;
    /**
     * Get the recalled message
     *
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   if (m.type() === MessageType.Recalled) {
     *     const recalledMessage = await m.toRecalled()
     *     console.log(`Message: ${recalledMessage} has been recalled.`)
     *   }
     * })
     * .start()
     */
    toRecalled(): Promise<Message | null>;
    say(text: string): Promise<void | Message>;
    say(num: number): Promise<void | Message>;
    say(message: Message): Promise<void | Message>;
    say(contact: Contact): Promise<void | Message>;
    say(file: FileBox): Promise<void | Message>;
    say(url: UrlLink): Promise<void | Message>;
    say(mini: MiniProgram): Promise<void | Message>;
    /**
     * Recall a message.
     * > Tips:
     * @returns {Promise<boolean>}
     *
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const recallMessage = await msg.say('123')
     *   if (recallMessage) {
     *     const isSuccess = await recallMessage.recall()
     *   }
     * })
     */
    recall(): Promise<boolean>;
    /**
     * Get the type from the message.
     * > Tips: MessageType is Enum here. </br>
     * - MessageType.Unknown     </br>
     * - MessageType.Attachment  </br>
     * - MessageType.Audio       </br>
     * - MessageType.Contact     </br>
     * - MessageType.Emoticon    </br>
     * - MessageType.Image       </br>
     * - MessageType.Text        </br>
     * - MessageType.Video       </br>
     * - MessageType.Url         </br>
     * @returns {MessageType}
     *
     * @example
     * const bot = new Wechaty()
     * if (message.type() === bot.Message.Type.Text) {
     *   console.log('This is a text message')
     * }
     */
    type(): MessageType;
    /**
     * Check if a message is sent by self.
     *
     * @returns {boolean} - Return `true` for send from self, `false` for send from others.
     * @example
     * if (message.self()) {
     *  console.log('this message is sent by myself!')
     * }
     */
    self(): boolean;
    /**
     *
     * Get message mentioned contactList.
     *
     * Message event table as follows
     *
     * |                                                                            | Web  |  Mac PC Client | iOS Mobile |  android Mobile |
     * | :---                                                                       | :--: |     :----:     |   :---:    |     :---:       |
     * | [You were mentioned] tip ([有人@我]的提示)                                   |  ✘   |        √       |     √      |       √         |
     * | Identify magic code (8197) by copy & paste in mobile                       |  ✘   |        √       |     √      |       ✘         |
     * | Identify magic code (8197) by programming                                  |  ✘   |        ✘       |     ✘      |       ✘         |
     * | Identify two contacts with the same roomAlias by [You were  mentioned] tip |  ✘   |        ✘       |     √      |       √         |
     *
     * @returns {Promise<Contact[]>} - Return message mentioned contactList
     *
     * @example
     * const contactList = await message.mentionList()
     * console.log(contactList)
     */
    mentionList(): Promise<Contact[]>;
    mention(): Promise<Contact[]>;
    mentionText(): Promise<string>;
    /**
     * Check if a message is mention self.
     *
     * @returns {Promise<boolean>} - Return `true` for mention me.
     * @example
     * if (await message.mentionSelf()) {
     *  console.log('this message were mentioned me! [You were mentioned] tip ([有人@我]的提示)')
     * }
     */
    mentionSelf(): Promise<boolean>;
    /**
     * @ignore
     */
    isReady(): boolean;
    /**
     * @ignore
     */
    ready(): Promise<void>;
    /**
     * Forward the received message.
     *
     * @param {(Sayable | Sayable[])} to Room or Contact
     * The recipient of the message, the room, or the contact
     * @returns {Promise<void>}
     * @example
     * const bot = new Wechaty()
     * bot
     * .on('message', async m => {
     *   const room = await bot.Room.find({topic: 'wechaty'})
     *   if (room) {
     *     await m.forward(room)
     *     console.log('forward this message to wechaty room!')
     *   }
     * })
     * .start()
     */
    forward(to: Room | Contact): Promise<void | Message>;
    /**
     * Message sent date
     */
    date(): Date;
    /**
     * Returns the message age in seconds. <br>
     *
     * For example, the message is sent at time `8:43:01`,
     * and when we received it in Wechaty, the time is `8:43:15`,
     * then the age() will return `8:43:15 - 8:43:01 = 14 (seconds)`
     *
     * @returns {number} message age in seconds.
     */
    age(): number;
    /**
     * Extract the Media File from the Message, and put it into the FileBox.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @returns {Promise<FileBox>}
     *
     * @example <caption>Save media file from a message</caption>
     * const fileBox = await message.toFileBox()
     * const fileName = fileBox.name
     * fileBox.toFile(fileName)
     */
    toFileBox(): Promise<FileBox>;
    /**
     * Extract the Image File from the Message, so that we can use different image sizes.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @returns {Image}
     *
     * @example <caption>Save image file from a message</caption>
     * const image = message.toImage()
     * const fileBox = await image.artwork()
     * const fileName = fileBox.name
     * fileBox.toFile(fileName)
     */
    toImage(): Image;
    /**
     * Get Share Card of the Message
     * Extract the Contact Card from the Message, and encapsulate it into Contact class
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     * @returns {Promise<Contact>}
     */
    toContact(): Promise<Contact>;
    toUrlLink(): Promise<UrlLink>;
    toMiniProgram(): Promise<MiniProgram>;
}
declare function wechatifyMessage(wechaty: Wechaty): typeof Message;
export { Message, wechatifyMessage, };
//# sourceMappingURL=message.d.ts.map