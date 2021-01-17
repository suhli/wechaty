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
/// <reference path="./typings.d.ts" />
/// <reference path="./io-peer/json-rpc-peer.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.VERSION = exports.looseInstanceOfFileBox = exports.Raven = exports.MemoryCard = exports.FileBox = exports.log = exports.isProduction = exports.qrcodeValueToImageUrl = exports.AT_SEPARATOR_REGEX = exports.FOUR_PER_EM_SPACE = exports.qrCodeForChatie = exports.CHATIE_OFFICIAL_ACCOUNT_ID = exports.Config = void 0;
const os_1 = __importDefault(require("os"));
const raven_1 = __importDefault(require("raven"));
exports.Raven = raven_1.default;
const read_pkg_up_1 = __importDefault(require("read-pkg-up"));
const wechaty_puppet_1 = require("wechaty-puppet");
Object.defineProperty(exports, "FileBox", { enumerable: true, get: function () { return wechaty_puppet_1.FileBox; } });
Object.defineProperty(exports, "MemoryCard", { enumerable: true, get: function () { return wechaty_puppet_1.MemoryCard; } });
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return wechaty_puppet_1.log; } });
const mod_1 = require("./helper-functions/mod");
const puppet_config_1 = require("./puppet-config");
const version_1 = require("./version");
Object.defineProperty(exports, "VERSION", { enumerable: true, get: function () { return version_1.VERSION; } });
const pkg = read_pkg_up_1.default.sync({ cwd: __dirname }).packageJson;
/**
 * Raven.io
 */
raven_1.default.disableConsoleAlerts();
raven_1.default
    .config(isProduction()
    && 'https://f6770399ee65459a82af82650231b22c:d8d11b283deb441e807079b8bb2c45cd@sentry.io/179672', {
    release: version_1.VERSION,
    tags: {
        git_commit: version_1.GIT_COMMIT_HASH,
        platform: process.env.WECHATY_DOCKER
            ? 'docker'
            : os_1.default.platform(),
    },
})
    .install();
/*
try {
    doSomething(a[0])
} catch (e) {
    Raven.captureException(e)
}

Raven.context(function () {
  doSomething(a[0])
})
 */
/**
 * to handle unhandled exceptions
 */
if (wechaty_puppet_1.log.level() === 'verbose' || wechaty_puppet_1.log.level() === 'silly') {
    wechaty_puppet_1.log.info('Config', 'registering process.on("unhandledRejection") for development/debug');
    /**
     * Refer to https://nodejs.org/api/process.html#process_event_unhandledrejection
     * the reason is in type: Error | any
     */
    process.on('unhandledRejection', (reason, promise) => {
        wechaty_puppet_1.log.error('Config', '###########################');
        wechaty_puppet_1.log.error('Config', 'unhandledRejection: %s %s', reason.stack || reason, promise);
        wechaty_puppet_1.log.error('Config', '###########################');
        promise.catch(err => {
            wechaty_puppet_1.log.error('Config', 'process.on(unhandledRejection) promise.catch(%s)', err.message);
            console.error('Config', err); // I don't know if log.error has similar full trace print support like console.error
        });
    });
    process.on('uncaughtException', function (error) {
        const origin = arguments[1]; // to compatible with node 12 or below version typings
        wechaty_puppet_1.log.error('Config', '###########################');
        wechaty_puppet_1.log.error('Config', 'uncaughtException: %s %s', error.stack, origin);
        wechaty_puppet_1.log.error('Config', '###########################');
    });
}
const DEFAULT_SETTING = pkg.wechaty;
class Config {
    constructor() {
        this.default = DEFAULT_SETTING;
        this.apihost = process.env.WECHATY_APIHOST || DEFAULT_SETTING.DEFAULT_APIHOST;
        this.name = process.env.WECHATY_NAME;
        // DO NOT set DEFAULT, because sometimes user do not want to connect to io cloud service
        this.token = process.env.WECHATY_TOKEN;
        this.debug = !!(process.env.WECHATY_DEBUG);
        this.httpPort = process.env.PORT || process.env.WECHATY_PORT || DEFAULT_SETTING.DEFAULT_PORT;
        this.docker = !!(process.env.WECHATY_DOCKER);
        wechaty_puppet_1.log.verbose('Config', 'constructor()');
        this.validApiHost(this.apihost);
    }
    systemPuppetName() {
        return (process.env.WECHATY_PUPPET || puppet_config_1.PUPPET_NAME_DEFAULT).toLowerCase();
    }
    validApiHost(apihost) {
        if (/^[a-zA-Z0-9.\-_]+:?[0-9]*$/.test(apihost)) {
            return true;
        }
        throw new Error('validApiHost() fail for ' + apihost);
    }
}
exports.Config = Config;
exports.CHATIE_OFFICIAL_ACCOUNT_ID = 'gh_051c89260e5d';
function qrCodeForChatie() {
    const CHATIE_OFFICIAL_ACCOUNT_QRCODE = 'http://weixin.qq.com/r/qymXj7DEO_1ErfTs93y5';
    return wechaty_puppet_1.FileBox.fromQRCode(CHATIE_OFFICIAL_ACCOUNT_QRCODE);
}
exports.qrCodeForChatie = qrCodeForChatie;
// http://jkorpela.fi/chars/spaces.html
// String.fromCharCode(8197)
exports.FOUR_PER_EM_SPACE = String.fromCharCode(0x2005);
// mobile: \u2005, PC、mac: \u0020
exports.AT_SEPARATOR_REGEX = /[\u2005\u0020]/;
function qrcodeValueToImageUrl(qrcodeValue) {
    return [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcodeValue),
    ].join('');
}
exports.qrcodeValueToImageUrl = qrcodeValueToImageUrl;
function isProduction() {
    return process.env.NODE_ENV === 'production'
        || process.env.NODE_ENV === 'prod';
}
exports.isProduction = isProduction;
const looseInstanceOfFileBox = mod_1.looseInstanceOfClass(wechaty_puppet_1.FileBox);
exports.looseInstanceOfFileBox = looseInstanceOfFileBox;
exports.config = new Config();
//# sourceMappingURL=config.js.map