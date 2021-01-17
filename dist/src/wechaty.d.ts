import { StateSwitch } from 'state-switch';
import { Puppet, MemoryCard, PuppetOptions } from 'wechaty-puppet';
import { FileBox } from './config';
import { Sayable } from './types';
import { PuppetModuleName } from './puppet-config';
import { Contact, ContactSelf, Friendship, Image, Message, MiniProgram, Room, RoomInvitation, Tag, UrlLink } from './user/mod';
import { WechatyEventEmitter, WechatyEventName } from './events/wechaty-events';
import { WechatyPlugin } from './plugin';
export interface WechatyOptions {
    memory?: MemoryCard;
    name?: string;
    puppet?: PuppetModuleName | Puppet;
    puppetOptions?: PuppetOptions;
    ioToken?: string;
}
/**
 * Main bot class.
 *
 * A `Bot` is a WeChat client depends on which puppet you use.
 * It may equals
 * - web-WeChat, when you use: [puppet-puppeteer](https://github.com/wechaty/wechaty-puppet-puppeteer)/[puppet-wechat4u](https://github.com/wechaty/wechaty-puppet-wechat4u)
 * - ipad-WeChat, when you use: [puppet-padchat](https://github.com/wechaty/wechaty-puppet-padchat)
 * - ios-WeChat, when you use: puppet-ioscat
 *
 * See more:
 * - [What is a Puppet in Wechaty](https://github.com/wechaty/wechaty-getting-started/wiki/FAQ-EN#31-what-is-a-puppet-in-wechaty)
 *
 * > If you want to know how to send message, see [Message](#Message) <br>
 * > If you want to know how to get contact, see [Contact](#Contact)
 *
 * @example <caption>The World's Shortest ChatBot Code: 6 lines of JavaScript</caption>
 * const { Wechaty } = require('wechaty')
 * const bot = new Wechaty()
 * bot.on('scan',    (qrCode, status) => console.log('https://wechaty.js.org/qrcode/' + encodeURIComponent(qrcode)))
 * bot.on('login',   user => console.log(`User ${user} logged in`))
 * bot.on('message', message => console.log(`Message: ${message}`))
 * bot.start()
 */
declare class Wechaty extends WechatyEventEmitter implements Sayable {
    private options;
    static readonly VERSION = "0.0.0";
    readonly state: StateSwitch;
    private readonly readyState;
    readonly wechaty: Wechaty;
    /**
     * singleton globalInstance
     * @ignore
     */
    private static globalInstance;
    private static globalPluginList;
    private pluginUninstallerList;
    private memory?;
    private lifeTimer?;
    private io?;
    puppet: Puppet;
    /**
     * the cuid
     * @ignore
     */
    readonly id: string;
    protected wechatifiedContact?: typeof Contact;
    protected wechatifiedContactSelf?: typeof ContactSelf;
    protected wechatifiedFriendship?: typeof Friendship;
    protected wechatifiedImage?: typeof Image;
    protected wechatifiedMessage?: typeof Message;
    protected wechatifiedMiniProgram?: typeof MiniProgram;
    protected wechatifiedRoom?: typeof Room;
    protected wechatifiedRoomInvitation?: typeof RoomInvitation;
    protected wechatifiedTag?: typeof Tag;
    protected wechatifiedUrlLink?: typeof UrlLink;
    get Contact(): typeof Contact;
    get ContactSelf(): typeof ContactSelf;
    get Friendship(): typeof Friendship;
    get Image(): typeof Image;
    get Message(): typeof Message;
    get MiniProgram(): typeof MiniProgram;
    get Room(): typeof Room;
    get RoomInvitation(): typeof RoomInvitation;
    get Tag(): typeof Tag;
    get UrlLink(): typeof UrlLink;
    /**
     * Get the global instance of Wechaty
     *
     * @param {WechatyOptions} [options={}]
     *
     * @example <caption>The World's Shortest ChatBot Code: 6 lines of JavaScript</caption>
     * const { Wechaty } = require('wechaty')
     *
     * Wechaty.instance() // Global instance
     * .on('scan', (url, status) => console.log(`Scan QR Code to login: ${status}\n${url}`))
     * .on('login',       user => console.log(`User ${user} logged in`))
     * .on('message',  message => console.log(`Message: ${message}`))
     * .start()
     */
    static instance(options?: WechatyOptions): Wechaty;
    /**
     * @param   {WechatyPlugin[]} plugins      - The plugins you want to use
     *
     * @return  {Wechaty}                      - this for chaining,
     *
     * @desc
     * For wechaty ecosystem, allow user to define a 3rd party plugin for the all wechaty instances
     *
     * @example
     * // Report all chat message to my server.
     *
     * function WechatyReportPlugin(options: { url: string }) {
     *   return function (this: Wechaty) {
     *     this.on('message', message => http.post(options.url, { data: message }))
     *   }
     * }
     *
     * bot.use(WechatyReportPlugin({ url: 'http://somewhere.to.report.your.data.com' })
     */
    static use(...plugins: (WechatyPlugin | WechatyPlugin[])[]): void;
    /**
     * The term [Puppet](https://github.com/wechaty/wechaty/wiki/Puppet) in Wechaty is an Abstract Class for implementing protocol plugins.
     * The plugins are the component that helps Wechaty to control the WeChat(that's the reason we call it puppet).
     * The plugins are named XXXPuppet, for example:
     * - [PuppetPuppeteer](https://github.com/wechaty/wechaty-puppet-puppeteer):
     * - [PuppetPadchat](https://github.com/wechaty/wechaty-puppet-padchat)
     *
     * @typedef    PuppetModuleName
     * @property   {string}  PUPPET_DEFAULT
     * The default puppet.
     * @property   {string}  wechaty-puppet-wechat4u
     * The default puppet, using the [wechat4u](https://github.com/nodeWechat/wechat4u) to control the [WeChat Web API](https://wx.qq.com/) via a chrome browser.
     * @property   {string}  wechaty-puppet-padchat
     * - Using the WebSocket protocol to connect with a Protocol Server for controlling the iPad WeChat program.
     * @property   {string}  wechaty-puppet-puppeteer
     * - Using the [google puppeteer](https://github.com/GoogleChrome/puppeteer) to control the [WeChat Web API](https://wx.qq.com/) via a chrome browser.
     * @property   {string}  wechaty-puppet-mock
     * - Using the mock data to mock wechat operation, just for test.
     */
    /**
     * The option parameter to create a wechaty instance
     *
     * @typedef    WechatyOptions
     * @property   {string}                 name            -Wechaty Name. </br>
     *          When you set this: </br>
     *          `new Wechaty({name: 'wechaty-name'}) ` </br>
     *          it will generate a file called `wechaty-name.memory-card.json`. </br>
     *          This file stores the login information for bot. </br>
     *          If the file is valid, the bot can auto login so you don't need to scan the qrCode to login again. </br>
     *          Also, you can set the environment variable for `WECHATY_NAME` to set this value when you start. </br>
     *          eg:  `WECHATY_NAME="your-cute-bot-name" node bot.js`
     * @property   {PuppetModuleName | Puppet}    puppet             -Puppet name or instance
     * @property   {Partial<PuppetOptions>} puppetOptions      -Puppet TOKEN
     * @property   {string}                 ioToken            -Io TOKEN
     */
    /**
     * Creates an instance of Wechaty.
     * @param {WechatyOptions} [options={}]
     *
     */
    constructor(options?: WechatyOptions);
    /**
     * @ignore
     */
    toString(): string;
    /**
     * Wechaty bot name set by `options.name`
     * default: `wechaty`
     */
    name(): string;
    on(event: WechatyEventName, listener: (...args: any[]) => any): this;
    /**
     * @param   {WechatyPlugin[]} plugins      - The plugins you want to use
     *
     * @return  {Wechaty}                      - this for chaining,
     *
     * @desc
     * For wechaty ecosystem, allow user to define a 3rd party plugin for the current wechaty instance.
     *
     * @example
     * // The same usage with Wechaty.use().
     *
     */
    use(...plugins: (WechatyPlugin | WechatyPlugin[])[]): this;
    private installGlobalPlugin;
    private initPuppet;
    protected initPuppetEventBridge(puppet: Puppet): void;
    protected wechatifyUserModules(puppet: Puppet): void;
    /**
     * Start the bot, return Promise.
     *
     * @returns {Promise<void>}
     * @description
     * When you start the bot, bot will begin to login, need you WeChat scan qrcode to login
     * > Tips: All the bot operation needs to be triggered after start() is done
     * @example
     * await bot.start()
     * // do other stuff with bot here
     */
    start(): Promise<void>;
    /**
     * Stop the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.stop()
     */
    stop(): Promise<void>;
    ready(): Promise<void>;
    /**
     * Logout the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.logout()
     */
    logout(): Promise<void>;
    /**
     * Get the logon / logoff state
     *
     * @returns {boolean}
     * @example
     * if (bot.logonoff()) {
     *   console.log('Bot logged in')
     * } else {
     *   console.log('Bot not logged in')
     * }
     */
    logonoff(): boolean;
    /**
     * Get current user
     *
     * @returns {ContactSelf}
     * @example
     * const contact = bot.userSelf()
     * console.log(`Bot is ${contact.name()}`)
     */
    userSelf(): ContactSelf;
    say(text: string): Promise<void>;
    say(contact: Contact): Promise<void>;
    say(file: FileBox): Promise<void>;
    say(mini: MiniProgram): Promise<void>;
    say(url: UrlLink): Promise<void>;
    say(...args: never[]): Promise<never>;
    /**
     * @ignore
     */
    static version(gitHash?: boolean): string;
    /**
     * @ignore
     * Return version of Wechaty
     *
     * @param {boolean} [forceNpm=false]  - If set to true, will only return the version in package.json. </br>
     *                                      Otherwise will return git commit hash if .git exists.
     * @returns {string}                  - the version number
     * @example
     * console.log(Wechaty.instance().version())       // return '#git[af39df]'
     * console.log(Wechaty.instance().version(true))   // return '0.7.9'
     */
    version(forceNpm?: boolean): string;
    /**
     * @ignore
     */
    static sleep(millisecond: number): Promise<void>;
    /**
     * @ignore
     */
    sleep(millisecond: number): Promise<void>;
    /**
     * @private
     */
    ding(data?: string): void;
    /**
     * @ignore
     */
    private memoryCheck;
    /**
     * @ignore
     */
    reset(reason?: string): Promise<void>;
    unref(): void;
}
export { Wechaty, };
//# sourceMappingURL=wechaty.d.ts.map