"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUPPET_NAME_DEFAULT = exports.PUPPET_DEPENDENCIES = void 0;
/* eslint-disable sort-keys */
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
exports.PUPPET_DEPENDENCIES = {
    /**
     * The following puppets were DEPRECATED before 2020
     */
    // 'wechaty-puppet-ioscat'    : '^0.5.22',   // https://www.npmjs.com/package/wechaty-puppet-ioscat
    // 'wechaty-puppet-padchat'   : '^0.19.3',   // https://www.npmjs.com/package/wechaty-puppet-padchat
    // 'wechaty-puppet-padpro'    : '^0.3.21',   // https://www.npmjs.com/package/wechaty-puppet-padpro
    /**
     * Deprecated on Dec 2020
     *  https://github.com/wechaty/puppet-service-providers/issues/11
     */
    // 'wechaty-puppet-padplus'   : '^0.7.30',   // https://www.npmjs.com/package/wechaty-puppet-padplus
    /**
     * Wechaty Internal Puppets: dependency by package.json
     */
    'wechaty-puppet-hostie': '*',
    'wechaty-puppet-mock': '*',
    /**
     * Wechaty External Puppets
     */
    'wechaty-puppet-puppeteer': '*',
    'wechaty-puppet-wechat4u': '*',
    'wechaty-puppet-gitter': '*',
    'wechaty-puppet-official-account': '*',
    'wechaty-puppet-padlocal': '*',
    'wechaty-puppet-whatsapp': '*',
    /**
     * Scoped puppets
     */
    '@juzibot/wechaty-puppet-donut': '^0.3',
    '@juzibot/wechaty-puppet-wxwork': '*',
};
exports.PUPPET_NAME_DEFAULT = 'wechaty-puppet-puppeteer';
//# sourceMappingURL=puppet-config.js.map