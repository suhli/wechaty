"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wechaty = void 0;
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
const cuid_1 = __importDefault(require("cuid"));
const os_1 = __importDefault(require("os"));
const state_switch_1 = require("state-switch");
const clone_class_1 = require("clone-class");
const wechaty_puppet_1 = require("wechaty-puppet");
const config_1 = require("./config");
const version_1 = require("./version");
const io_1 = require("./io");
const puppet_manager_1 = require("./puppet-manager");
const mod_1 = require("./user/mod");
const timestamp_to_date_1 = require("./helper-functions/pure/timestamp-to-date");
const wechaty_events_1 = require("./events/wechaty-events");
const plugin_1 = require("./plugin");
const PUPPET_MEMORY_NAME = 'puppet';
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
class Wechaty extends wechaty_events_1.WechatyEventEmitter {
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
    constructor(options = {}) {
        super();
        this.options = options;
        config_1.log.verbose('Wechaty', 'constructor()');
        this.memory = this.options.memory;
        this.id = cuid_1.default();
        this.state = new state_switch_1.StateSwitch('Wechaty', { log: config_1.log });
        this.readyState = new state_switch_1.StateSwitch('WechatyReady', { log: config_1.log });
        this.wechaty = this;
        /**
         * Huan(202008):
         *
         * Set max listeners to 1K, so that we can add lots of listeners without the warning message.
         * The listeners might be one of the following functionilities:
         *  1. Plugins
         *  2. Redux Observables
         *  3. etc...
         */
        super.setMaxListeners(1024);
        this.pluginUninstallerList = [];
        this.installGlobalPlugin();
    }
    get Contact() { return guardWechatify(this.wechatifiedContact); }
    get ContactSelf() { return guardWechatify(this.wechatifiedContactSelf); }
    get Friendship() { return guardWechatify(this.wechatifiedFriendship); }
    get Image() { return guardWechatify(this.wechatifiedImage); }
    get Message() { return guardWechatify(this.wechatifiedMessage); }
    get MiniProgram() { return guardWechatify(this.wechatifiedMiniProgram); }
    get Room() { return guardWechatify(this.wechatifiedRoom); }
    get RoomInvitation() { return guardWechatify(this.wechatifiedRoomInvitation); }
    get Tag() { return guardWechatify(this.wechatifiedTag); }
    get UrlLink() { return guardWechatify(this.wechatifiedUrlLink); }
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
    static instance(options) {
        if (options && this.globalInstance) {
            throw new Error('instance can be only initialized once by options!');
        }
        if (!this.globalInstance) {
            this.globalInstance = new Wechaty(options);
        }
        return this.globalInstance;
    }
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
    static use(...plugins) {
        const pluginList = plugins.flat();
        this.globalPluginList = this.globalPluginList.concat(pluginList);
    }
    /**
     * @ignore
     */
    toString() {
        if (!this.options) {
            return this.constructor.name;
        }
        return [
            'Wechaty#',
            this.id,
            `<${(this.options && this.options.puppet) || ''}>`,
            `(${(this.memory && this.memory.name) || ''})`,
        ].join('');
    }
    /**
     * Wechaty bot name set by `options.name`
     * default: `wechaty`
     */
    name() {
        return this.options.name || 'wechaty';
    }
    on(event, listener) {
        config_1.log.verbose('Wechaty', 'on(%s, listener) registering... listenerCount: %s', event, this.listenerCount(event));
        return super.on(event, listener);
    }
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
    use(...plugins) {
        const pluginList = plugins.flat();
        const uninstallerList = pluginList
            .map(plugin => plugin(this))
            .filter(plugin_1.isWechatyPluginUninstaller);
        this.pluginUninstallerList.push(...uninstallerList);
        return this;
    }
    installGlobalPlugin() {
        const uninstallerList = clone_class_1.instanceToClass(this, Wechaty)
            .globalPluginList
            .map(plugin => plugin(this))
            .filter(plugin_1.isWechatyPluginUninstaller);
        this.pluginUninstallerList.push(...uninstallerList);
    }
    async initPuppet() {
        config_1.log.verbose('Wechaty', 'initPuppet() %s', this.options.puppet || '');
        const initialized = !!this.puppet;
        if (initialized) {
            config_1.log.verbose('Wechaty', 'initPuppet(%s) had already been initialized, no need to init twice', this.options.puppet);
            return;
        }
        if (!this.memory) {
            throw new Error('no memory');
        }
        const puppet = this.options.puppet || config_1.config.systemPuppetName();
        const puppetMemory = this.memory.multiplex(PUPPET_MEMORY_NAME);
        const puppetInstance = await puppet_manager_1.PuppetManager.resolve({
            puppet,
            puppetOptions: this.options.puppetOptions,
        });
        /**
         * Plug the Memory Card to Puppet
         */
        puppetInstance.setMemory(puppetMemory);
        this.initPuppetEventBridge(puppetInstance);
        this.wechatifyUserModules(puppetInstance);
        this.emit('puppet', puppetInstance);
    }
    initPuppetEventBridge(puppet) {
        config_1.log.verbose('Wechaty', 'initPuppetEventBridge(%s)', puppet);
        const eventNameList = Object.keys(wechaty_puppet_1.PUPPET_EVENT_DICT);
        for (const eventName of eventNameList) {
            config_1.log.verbose('Wechaty', 'initPuppetEventBridge() puppet.on(%s) (listenerCount:%s) registering...', eventName, puppet.listenerCount(eventName));
            switch (eventName) {
                case 'dong':
                    puppet.on('dong', payload => {
                        this.emit('dong', payload.data);
                    });
                    break;
                case 'error':
                    puppet.on('error', payload => {
                        this.emit('error', new Error(payload.data));
                    });
                    break;
                case 'heartbeat':
                    puppet.on('heartbeat', payload => {
                        /**
                         * Use `watchdog` event from Puppet to `heartbeat` Wechaty.
                         */
                        // TODO: use a throttle queue to prevent beat too fast.
                        this.emit('heartbeat', payload.data);
                    });
                    break;
                case 'friendship':
                    puppet.on('friendship', async (payload) => {
                        const friendship = this.Friendship.load(payload.friendshipId);
                        await friendship.ready();
                        this.emit('friendship', friendship);
                        friendship.contact().emit('friendship', friendship);
                    });
                    break;
                case 'login':
                    puppet.on('login', async (payload) => {
                        const contact = this.ContactSelf.load(payload.contactId);
                        await contact.ready();
                        this.emit('login', contact);
                    });
                    break;
                case 'logout':
                    puppet.on('logout', async (payload) => {
                        const contact = this.ContactSelf.load(payload.contactId);
                        await contact.ready();
                        this.emit('logout', contact, payload.data);
                    });
                    break;
                case 'message':
                    puppet.on('message', async (payload) => {
                        const msg = this.Message.load(payload.messageId);
                        await msg.ready();
                        this.emit('message', msg);
                        const room = msg.room();
                        if (room) {
                            room.emit('message', msg);
                        }
                        else {
                            this.userSelf().emit('message', msg);
                        }
                    });
                    break;
                case 'ready':
                    puppet.on('ready', () => {
                        config_1.log.silly('Wechaty', 'initPuppetEventBridge() puppet.on(ready)');
                        this.emit('ready');
                        this.readyState.on(true);
                    });
                    break;
                case 'room-invite':
                    puppet.on('room-invite', async (payload) => {
                        const roomInvitation = this.RoomInvitation.load(payload.roomInvitationId);
                        this.emit('room-invite', roomInvitation);
                    });
                    break;
                case 'room-join':
                    puppet.on('room-join', async (payload) => {
                        const room = this.Room.load(payload.roomId);
                        await room.sync();
                        const inviteeList = payload.inviteeIdList.map(id => this.Contact.load(id));
                        await Promise.all(inviteeList.map(c => c.ready()));
                        const inviter = this.Contact.load(payload.inviterId);
                        await inviter.ready();
                        const date = timestamp_to_date_1.timestampToDate(payload.timestamp);
                        this.emit('room-join', room, inviteeList, inviter, date);
                        room.emit('join', inviteeList, inviter, date);
                    });
                    break;
                case 'room-leave':
                    puppet.on('room-leave', async (payload) => {
                        const room = this.Room.load(payload.roomId);
                        /**
                         * See: https://github.com/wechaty/wechaty/pull/1833
                         */
                        await room.sync();
                        const leaverList = payload.removeeIdList.map(id => this.Contact.load(id));
                        await Promise.all(leaverList.map(c => c.ready()));
                        const remover = this.Contact.load(payload.removerId);
                        await remover.ready();
                        const date = timestamp_to_date_1.timestampToDate(payload.timestamp);
                        this.emit('room-leave', room, leaverList, remover, date);
                        room.emit('leave', leaverList, remover, date);
                        // issue #254
                        const selfId = this.puppet.selfId();
                        if (selfId && payload.removeeIdList.includes(selfId)) {
                            await this.puppet.dirtyPayload(wechaty_puppet_1.PayloadType.Room, payload.roomId);
                            await this.puppet.dirtyPayload(wechaty_puppet_1.PayloadType.RoomMember, payload.roomId);
                        }
                    });
                    break;
                case 'room-topic':
                    puppet.on('room-topic', async (payload) => {
                        const room = this.Room.load(payload.roomId);
                        await room.sync();
                        const changer = this.Contact.load(payload.changerId);
                        await changer.ready();
                        const date = timestamp_to_date_1.timestampToDate(payload.timestamp);
                        this.emit('room-topic', room, payload.newTopic, payload.oldTopic, changer, date);
                        room.emit('topic', payload.newTopic, payload.oldTopic, changer, date);
                    });
                    break;
                case 'scan':
                    puppet.on('scan', async (payload) => {
                        this.emit('scan', payload.qrcode || '', payload.status, payload.data);
                    });
                    break;
                case 'reset':
                    // Do not propagation `reset` event from puppet
                    break;
                case 'dirty':
                    /**
                     * https://github.com/wechaty/wechaty-puppet-hostie/issues/43
                     */
                    puppet.on('dirty', async ({ payloadType, payloadId }) => {
                        switch (payloadType) {
                            case wechaty_puppet_1.PayloadType.RoomMember:
                            case wechaty_puppet_1.PayloadType.Contact:
                                await this.Contact.load(payloadId).sync();
                                break;
                            case wechaty_puppet_1.PayloadType.Room:
                                await this.Room.load(payloadId).sync();
                                break;
                            /**
                             * Huan(202008): noop for the following
                             */
                            case wechaty_puppet_1.PayloadType.Friendship:
                                // Friendship has no payload
                                break;
                            case wechaty_puppet_1.PayloadType.Message:
                                // Message does not need to dirty (?)
                                break;
                            case wechaty_puppet_1.PayloadType.Unknown:
                            default:
                                throw new Error('unknown payload type: ' + payloadType);
                        }
                    });
                    break;
                default:
                    /**
                     * Check: The eventName here should have the type `never`
                     */
                    throw new Error('eventName ' + eventName + ' unsupported!');
            }
        }
    }
    wechatifyUserModules(puppet) {
        config_1.log.verbose('Wechaty', 'wechatifyUserModules(%s)', puppet);
        if (this.wechatifiedContactSelf) {
            throw new Error('can not be initialized twice!');
        }
        /**
         * 1. Setup Wechaty User Classes
         */
        this.wechatifiedContact = mod_1.wechatifyContact(this);
        this.wechatifiedContactSelf = mod_1.wechatifyContactSelf(this);
        this.wechatifiedFriendship = mod_1.wechatifyFriendship(this);
        this.wechatifiedImage = mod_1.wechatifyImage(this);
        this.wechatifiedMessage = mod_1.wechatifyMessage(this);
        this.wechatifiedMiniProgram = mod_1.wechatifyMiniProgram(this);
        this.wechatifiedRoom = mod_1.wechatifyRoom(this);
        this.wechatifiedRoomInvitation = mod_1.wechatifyRoomInvitation(this);
        this.wechatifiedTag = mod_1.wechatifyTag(this);
        this.wechatifiedUrlLink = mod_1.wechatifyUrlLink(this);
        this.puppet = puppet;
    }
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
    async start() {
        config_1.log.verbose('Wechaty', '<%s>(%s) start() v%s is starting...', this.options.puppet || config_1.config.systemPuppetName(), this.options.name || '', this.version());
        config_1.log.verbose('Wechaty', 'id: %s', this.id);
        if (this.state.on()) {
            config_1.log.silly('Wechaty', 'start() on a starting/started instance');
            await this.state.ready('on');
            config_1.log.silly('Wechaty', 'start() state.ready() resolved');
            return;
        }
        this.readyState.off(true);
        if (this.lifeTimer) {
            throw new Error('start() lifeTimer exist');
        }
        this.state.on('pending');
        try {
            if (!this.memory) {
                this.memory = new wechaty_puppet_1.MemoryCard(this.options.name);
            }
            try {
                await this.memory.load();
            }
            catch (e) {
                config_1.log.silly('Wechaty', 'start() memory.load() had already loaded');
            }
            await this.initPuppet();
            await this.puppet.start();
            if (this.options.ioToken) {
                this.io = new io_1.Io({
                    token: this.options.ioToken,
                    wechaty: this,
                });
                await this.io.start();
            }
        }
        catch (e) {
            console.error(e);
            config_1.log.error('Wechaty', 'start() exception: %s', e && e.message);
            config_1.Raven.captureException(e);
            this.emit('error', e);
            try {
                await this.stop();
            }
            catch (e) {
                config_1.log.error('Wechaty', 'start() stop() exception: %s', e && e.message);
                config_1.Raven.captureException(e);
                this.emit('error', e);
            }
            return;
        }
        this.on('heartbeat', () => this.memoryCheck());
        this.lifeTimer = setInterval(() => {
            config_1.log.silly('Wechaty', 'start() setInterval() this timer is to keep Wechaty running...');
        }, 1000 * 60 * 60);
        this.state.on(true);
        this.emit('start');
    }
    /**
     * Stop the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.stop()
     */
    async stop() {
        config_1.log.verbose('Wechaty', '<%s> stop() v%s is stopping ...', this.options.puppet || config_1.config.systemPuppetName(), this.version());
        /**
         * Uninstall Plugins
         *  no matter the state is `ON` or `OFF`.
         */
        while (this.pluginUninstallerList.length > 0) {
            const uninstaller = this.pluginUninstallerList.pop();
            if (uninstaller)
                uninstaller();
        }
        if (this.state.off()) {
            config_1.log.silly('Wechaty', 'stop() on an stopping/stopped instance');
            await this.state.ready('off');
            config_1.log.silly('Wechaty', 'stop() state.ready(off) resolved');
            return;
        }
        this.readyState.off(true);
        this.state.off('pending');
        if (this.lifeTimer) {
            clearInterval(this.lifeTimer);
            this.lifeTimer = undefined;
        }
        try {
            await this.puppet.stop();
        }
        catch (e) {
            config_1.log.warn('Wechaty', 'stop() puppet.stop() exception: %s', e.message);
        }
        try {
            if (this.io) {
                await this.io.stop();
                this.io = undefined;
            }
        }
        catch (e) {
            config_1.log.error('Wechaty', 'stop() exception: %s', e.message);
            config_1.Raven.captureException(e);
            this.emit('error', e);
        }
        this.state.off(true);
        this.emit('stop');
    }
    async ready() {
        config_1.log.verbose('Wechaty', 'ready()');
        return this.readyState.ready('on').then(() => {
            return config_1.log.silly('Wechaty', 'ready() this.readyState.ready(on) resolved');
        });
    }
    /**
     * Logout the bot
     *
     * @returns {Promise<void>}
     * @example
     * await bot.logout()
     */
    async logout() {
        config_1.log.verbose('Wechaty', 'logout()');
        try {
            await this.puppet.logout();
        }
        catch (e) {
            config_1.log.error('Wechaty', 'logout() exception: %s', e.message);
            config_1.Raven.captureException(e);
            throw e;
        }
    }
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
    logonoff() {
        try {
            return this.puppet.logonoff();
        }
        catch (e) {
            // https://github.com/wechaty/wechaty/issues/1878
            return false;
        }
    }
    /**
     * Get current user
     *
     * @returns {ContactSelf}
     * @example
     * const contact = bot.userSelf()
     * console.log(`Bot is ${contact.name()}`)
     */
    userSelf() {
        const userId = this.puppet.selfId();
        const user = this.ContactSelf.load(userId);
        return user;
    }
    /**
     * Send message to userSelf, in other words, bot send message to itself.
     * > Tips:
     * This function is depending on the Puppet Implementation, see [puppet-compatible-table](https://github.com/wechaty/wechaty/wiki/Puppet#3-puppet-compatible-table)
     *
     * @param {(string | Contact | FileBox | UrlLink | MiniProgram)} something
     * send text, Contact, or file to bot. </br>
     * You can use {@link https://www.npmjs.com/package/file-box|FileBox} to send file
     *
     * @returns {Promise<void>}
     *
     * @example
     * const bot = new Wechaty()
     * await bot.start()
     * // after logged in
     *
     * // 1. send text to bot itself
     * await bot.say('hello!')
     *
     * // 2. send Contact to bot itself
     * const contact = await bot.Contact.find()
     * await bot.say(contact)
     *
     * // 3. send Image to bot itself from remote url
     * import { FileBox }  from 'wechaty'
     * const fileBox = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png')
     * await bot.say(fileBox)
     *
     * // 4. send Image to bot itself from local file
     * import { FileBox }  from 'wechaty'
     * const fileBox = FileBox.fromFile('/tmp/text.jpg')
     * await bot.say(fileBox)
     *
     * // 5. send Link to bot itself
     * const linkPayload = new UrlLink ({
     *   description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',
     *   thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
     *   title       : 'Welcome to Wechaty',
     *   url         : 'https://github.com/wechaty/wechaty',
     * })
     * await bot.say(linkPayload)
     *
     * // 6. send MiniProgram to bot itself
     * const miniPayload = new MiniProgram ({
     *   username           : 'gh_xxxxxxx',     //get from mp.weixin.qq.com
     *   appid              : '',               //optional, get from mp.weixin.qq.com
     *   title              : '',               //optional
     *   pagepath           : '',               //optional
     *   description        : '',               //optional
     *   thumbnailurl       : '',               //optional
     * })
     * await bot.say(miniPayload)
     */
    async say(something) {
        config_1.log.verbose('Wechaty', 'say(%s)', something);
        // huan: to make TypeScript happy
        await this.userSelf().say(something);
    }
    /**
     * @ignore
     */
    static version(gitHash = false) {
        if (gitHash && version_1.GIT_COMMIT_HASH) {
            return `#git[${version_1.GIT_COMMIT_HASH}]`;
        }
        return version_1.VERSION;
    }
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
    version(forceNpm = false) {
        return Wechaty.version(forceNpm);
    }
    /**
     * @ignore
     */
    static async sleep(millisecond) {
        await new Promise(resolve => {
            setTimeout(resolve, millisecond);
        });
    }
    /**
     * @ignore
     */
    async sleep(millisecond) {
        return Wechaty.sleep(millisecond);
    }
    /**
     * @private
     */
    ding(data) {
        config_1.log.silly('Wechaty', 'ding(%s)', data || '');
        try {
            this.puppet.ding(data);
        }
        catch (e) {
            config_1.log.error('Wechaty', 'ding() exception: %s', e.message);
            config_1.Raven.captureException(e);
            throw e;
        }
    }
    /**
     * @ignore
     */
    memoryCheck(minMegabyte = 4) {
        const freeMegabyte = Math.floor(os_1.default.freemem() / 1024 / 1024);
        config_1.log.silly('Wechaty', 'memoryCheck() free: %d MB, require: %d MB', freeMegabyte, minMegabyte);
        if (freeMegabyte < minMegabyte) {
            const e = new Error(`memory not enough: free ${freeMegabyte} < require ${minMegabyte} MB`);
            config_1.log.warn('Wechaty', 'memoryCheck() %s', e.message);
            this.emit('error', e);
        }
    }
    /**
     * @ignore
     */
    async reset(reason) {
        config_1.log.verbose('Wechaty', 'reset() because %s', reason || 'no reason');
        await this.puppet.stop();
        await this.puppet.start();
    }
    unref() {
        config_1.log.verbose('Wechaty', 'unref()');
        if (this.lifeTimer) {
            this.lifeTimer.unref();
        }
        this.puppet.unref();
    }
}
exports.Wechaty = Wechaty;
Wechaty.VERSION = version_1.VERSION;
Wechaty.globalPluginList = [];
/**
 * Huan(202008): we will bind the wechaty puppet with user modules (Contact, Room, etc) together inside the start() method
 */
function guardWechatify(userModule) {
    if (!userModule) {
        throw new Error('Wechaty user module (for example, wechaty.Room) can not be used before wechaty.start()!');
    }
    return userModule;
}
//# sourceMappingURL=wechaty.js.map