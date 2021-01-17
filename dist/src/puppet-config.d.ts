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
export declare const PUPPET_DEPENDENCIES: {
    /**
     * The following puppets were DEPRECATED before 2020
     */
    /**
     * Deprecated on Dec 2020
     *  https://github.com/wechaty/puppet-service-providers/issues/11
     */
    /**
     * Wechaty Internal Puppets: dependency by package.json
     */
    'wechaty-puppet-hostie': string;
    'wechaty-puppet-mock': string;
    /**
     * Wechaty External Puppets
     */
    'wechaty-puppet-puppeteer': string;
    'wechaty-puppet-wechat4u': string;
    'wechaty-puppet-gitter': string;
    'wechaty-puppet-official-account': string;
    'wechaty-puppet-padlocal': string;
    'wechaty-puppet-whatsapp': string;
    /**
     * Scoped puppets
     */
    '@juzibot/wechaty-puppet-donut': string;
    '@juzibot/wechaty-puppet-wxwork': string;
};
export declare type PuppetModuleName = keyof typeof PUPPET_DEPENDENCIES;
export declare const PUPPET_NAME_DEFAULT: PuppetModuleName;
//# sourceMappingURL=puppet-config.d.ts.map