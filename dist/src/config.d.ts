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
/// <reference path="../../src/typings.d.ts" />
/// <reference path="../../src/io-peer/json-rpc-peer.d.ts" />
import Raven from 'raven';
import { FileBox, MemoryCard, log } from 'wechaty-puppet';
import { PuppetModuleName } from './puppet-config';
import { VERSION } from './version';
export interface DefaultSetting {
    DEFAULT_PORT: number;
    DEFAULT_APIHOST: string;
    DEFAULT_PROTOCOL: string;
}
export declare class Config {
    default: DefaultSetting;
    apihost: string;
    systemPuppetName(): PuppetModuleName;
    name: string | undefined;
    token: string | undefined;
    debug: boolean;
    httpPort: string | number;
    docker: boolean;
    constructor();
    validApiHost(apihost: string): boolean;
}
export declare const CHATIE_OFFICIAL_ACCOUNT_ID = "gh_051c89260e5d";
export declare function qrCodeForChatie(): FileBox;
export declare const FOUR_PER_EM_SPACE: string;
export declare const AT_SEPARATOR_REGEX: RegExp;
export declare function qrcodeValueToImageUrl(qrcodeValue: string): string;
export declare function isProduction(): boolean;
declare const looseInstanceOfFileBox: (o: any) => o is FileBox;
export { log, FileBox, MemoryCard, Raven, looseInstanceOfFileBox, VERSION, };
export declare const config: Config;
//# sourceMappingURL=config.d.ts.map