"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoClient = void 0;
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
/**
 * DO NOT use `require('../')` here!
 * because it will cause a LOOP require ERROR
 */
const state_switch_1 = require("state-switch");
const wechaty_puppet_hostie_1 = require("wechaty-puppet-hostie");
const config_1 = require("./config");
const io_1 = require("./io");
const DEFAULT_IO_CLIENT_OPTIONS = {
    port: 8788,
};
class IoClient {
    constructor(options) {
        config_1.log.verbose('IoClient', 'constructor({%s})', Object.keys(options)
            .map(key => {
            return `${key}:${options[key]}`;
        })
            .reduce((acc, cur) => `${acc}, ${cur}`));
        const normalizedOptions = {
            ...DEFAULT_IO_CLIENT_OPTIONS,
            ...options,
        };
        this.options = normalizedOptions;
        this.state = new state_switch_1.StateSwitch('IoClient', { log: config_1.log });
    }
    async startHostie() {
        config_1.log.verbose('IoClient', 'startHostie()');
        if (this.puppetServer) {
            throw new Error('hostie server exists');
        }
        const options = {
            endpoint: '0.0.0.0:' + this.options.port,
            puppet: this.options.wechaty.puppet,
            token: this.options.token,
        };
        this.puppetServer = new wechaty_puppet_hostie_1.PuppetServer(options);
        await this.puppetServer.start();
    }
    async stopHostie() {
        config_1.log.verbose('IoClient', 'stopHostie()');
        if (!this.puppetServer) {
            throw new Error('hostie server does not exist');
        }
        await this.puppetServer.stop();
        this.puppetServer = undefined;
    }
    async start() {
        config_1.log.verbose('IoClient', 'start()');
        if (this.state.on()) {
            config_1.log.warn('IoClient', 'start() with a on state, wait and return');
            await this.state.ready('on');
            return;
        }
        this.state.on('pending');
        try {
            await this.hookWechaty(this.options.wechaty);
            await this.startIo();
            await this.options.wechaty.start();
            await this.startHostie();
            this.state.on(true);
        }
        catch (e) {
            config_1.log.error('IoClient', 'start() exception: %s', e.message);
            this.state.off(true);
            throw e;
        }
    }
    async hookWechaty(wechaty) {
        config_1.log.verbose('IoClient', 'hookWechaty()');
        if (this.state.off()) {
            const e = new Error('state.off() is true, skipped');
            config_1.log.warn('IoClient', 'initWechaty() %s', e.message);
            throw e;
        }
        wechaty
            .on('login', user => config_1.log.info('IoClient', `${user.name()} logged in`))
            .on('logout', user => config_1.log.info('IoClient', `${user.name()} logged out`))
            .on('message', msg => this.onMessage(msg))
            .on('scan', (url, code) => {
            config_1.log.info('IoClient', [
                `[${code}] ${url}`,
                `Online QR Code Image: https://wechaty.js.org/qrcode/${encodeURIComponent(url)}`,
            ].join('\n'));
        });
    }
    async startIo() {
        config_1.log.verbose('IoClient', 'startIo() with token %s', this.options.token);
        if (this.state.off()) {
            const e = new Error('startIo() state.off() is true, skipped');
            config_1.log.warn('IoClient', e.message);
            throw e;
        }
        if (this.io) {
            throw new Error('io exists');
        }
        this.io = new io_1.Io({
            hostiePort: this.options.port,
            token: this.options.token,
            wechaty: this.options.wechaty,
        });
        try {
            await this.io.start();
        }
        catch (e) {
            config_1.log.verbose('IoClient', 'startIo() init fail: %s', e.message);
            throw e;
        }
    }
    async stopIo() {
        config_1.log.verbose('IoClient', 'stopIo()');
        if (!this.io) {
            config_1.log.warn('IoClient', 'stopIo() io does not exist');
            return;
        }
        await this.io.stop();
        this.io = undefined;
    }
    async onMessage(msg) {
        config_1.log.verbose('IoClient', 'onMessage(%s)', msg);
        // const from = m.from()
        // const to = m.to()
        // const content = m.toString()
        // const room = m.room()
        // log.info('Bot', '%s<%s>:%s'
        //               , (room ? '['+room.topic()+']' : '')
        //               , from.name()
        //               , m.toStringDigest()
        //         )
        // if (/^wechaty|chatie|botie/i.test(m.text()) && !m.self()) {
        //   await m.say('https://www.chatie.io')
        //     .then(_ => log.info('Bot', 'REPLIED to magic word "chatie"'))
        // }
    }
    async stop() {
        config_1.log.verbose('IoClient', 'stop()');
        this.state.off('pending');
        await this.stopIo();
        await this.stopHostie();
        await this.options.wechaty.stop();
        this.state.off(true);
        // XXX 20161026
        // this.io = null
    }
    async restart() {
        config_1.log.verbose('IoClient', 'restart()');
        try {
            await this.stop();
            await this.start();
        }
        catch (e) {
            config_1.log.error('IoClient', 'restart() exception %s', e.message);
            throw e;
        }
    }
    async quit() {
        config_1.log.verbose('IoClient', 'quit()');
        if (this.state.off() === 'pending') {
            config_1.log.warn('IoClient', 'quit() with state.off() = `pending`, skipped');
            throw new Error('quit() with state.off() = `pending`');
        }
        this.state.off('pending');
        try {
            if (this.options.wechaty) {
                await this.options.wechaty.stop();
                // this.wechaty = null
            }
            else {
                config_1.log.warn('IoClient', 'quit() no this.wechaty');
            }
            if (this.io) {
                await this.io.stop();
                // this.io = null
            }
            else {
                config_1.log.warn('IoClient', 'quit() no this.io');
            }
        }
        catch (e) {
            config_1.log.error('IoClient', 'exception: %s', e.message);
            throw e;
        }
        finally {
            this.state.off(true);
        }
    }
}
exports.IoClient = IoClient;
//# sourceMappingURL=io-client.js.map