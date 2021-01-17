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
import { FileBox } from 'wechaty-puppet';
import { Wechaty } from '../wechaty';
import { Contact } from './contact';
/**
 * Bot itself will be encapsulated as a ContactSelf.
 *
 * > Tips: this class is extends Contact
 * @example
 * const bot = new Wechaty()
 * await bot.start()
 * bot.on('login', (user: ContactSelf) => {
 *   console.log(`user ${user} login`)
 * })
 */
declare class ContactSelf extends Contact {
    avatar(): Promise<FileBox>;
    avatar(file: FileBox): Promise<void>;
    /**
     * Get bot qrcode
     *
     * @returns {Promise<string>}
     *
     * @example
     * import { generate } from 'qrcode-terminal'
     * bot.on('login', (user: ContactSelf) => {
     *   console.log(`user ${user} login`)
     *   const qrcode = await user.qrcode()
     *   console.log(`Following is the bot qrcode!`)
     *   generate(qrcode, { small: true })
     * })
     */
    qrcode(): Promise<string>;
    /**
     * Change bot name
     *
     * @param name The new name that the bot will change to
     *
     * @example
     * bot.on('login', async user => {
     *   console.log(`user ${user} login`)
     *   const oldName = user.name()
     *   try {
     *     await user.name(`${oldName}-${new Date().getTime()}`)
     *   } catch (e) {
     *     console.error('change name failed', e)
     *   }
     * })
     */
    name(): string;
    name(name: string): Promise<void>;
    /**
     * Change bot signature
     *
     * @param signature The new signature that the bot will change to
     *
     * @example
     * bot.on('login', async user => {
     *   console.log(`user ${user} login`)
     *   try {
     *     await user.signature(`Signature changed by wechaty on ${new Date()}`)
     *   } catch (e) {
     *     console.error('change signature failed', e)
     *   }
     * })
     */
    signature(signature: string): Promise<void>;
}
declare function wechatifyContactSelf(wechaty: Wechaty): typeof ContactSelf;
export { ContactSelf, wechatifyContactSelf, };
//# sourceMappingURL=contact-self.d.ts.map