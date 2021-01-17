#!/usr/bin/env ts-node
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blue_tape_1 = __importDefault(require("blue-tape"));
const config_1 = require("./config");
// import { Puppet } from './puppet'
blue_tape_1.default('important variables', async (t) => {
    // t.true('puppet'   in config, 'should exist `puppet` in Config')
    t.true('apihost' in config_1.config, 'should exist `apihost` in Config');
    t.true('token' in config_1.config, 'should exist `token` in Config');
    // t.ok(config.default.DEFAULT_PUPPET      , 'should export DEFAULT_PUPPET')
    // t.ok(config.default.DEFAULT_PROFILE     , 'should export DEFAULT_PROFILE')
    t.ok(config_1.config.default.DEFAULT_PROTOCOL, 'should export DEFAULT_PROTOCOL');
    t.ok(config_1.config.default.DEFAULT_APIHOST, 'should export DEFAULT_APIHOST');
});
blue_tape_1.default('validApiHost()', async (t) => {
    const OK_APIHOSTS = [
        'api.chatie.io',
        'chatie.io:8080',
    ];
    const ERR_APIHOSTS = [
        'https://api.chatie.io',
        'chatie.io/',
    ];
    OK_APIHOSTS.forEach(apihost => {
        t.doesNotThrow(() => {
            config_1.config.validApiHost(apihost);
        });
    }, 'should not row for right apihost');
    ERR_APIHOSTS.forEach(apihost => {
        t.throws(() => {
            config_1.config.validApiHost(apihost);
        });
    }, 'should throw for error apihost');
});
// test('puppetInstance()', async t => {
//   // BUG Compitable with Win32 CI
//   // global instance infected across unit tests... :(
//   const bak = config.puppetInstance()
//   config.puppetInstance(null)
//   t.throws(() => {
//     config.puppetInstance()
//   }, Error, 'should throw when not initialized')
//   config.puppetInstance(bak)
//   const EXPECTED: Puppet = {userId: 'test'} as any
//   const mockPuppet = EXPECTED
//   config.puppetInstance(mockPuppet)
//   const instance = config.puppetInstance()
//   t.deepEqual(instance, EXPECTED, 'should equal with initialized data')
//   config.puppetInstance(null)
//   t.throws(() => {
//     config.puppetInstance()
//   }, Error, 'should throw after set to null')
//   config.puppetInstance(bak)
// })
blue_tape_1.default('systemPuppetName ()', async (t) => {
    const WECHATY_PUPPET_ORIG = process.env.WECHATY_PUPPET;
    delete process.env.WECHATY_PUPPET;
    t.equal(config_1.config.systemPuppetName(), 'wechaty-puppet-puppeteer', 'should get wechaty-puppet-puppeteer as puppet name');
    process.env.WECHATY_PUPPET = 'wechaty-puppet-mock';
    t.equal(config_1.config.systemPuppetName(), 'wechaty-puppet-mock', 'should get puppet name from process.env');
    // restore the original value
    process.env.WECHATY_PUPPET = WECHATY_PUPPET_ORIG;
});
//# sourceMappingURL=config.spec.js.map