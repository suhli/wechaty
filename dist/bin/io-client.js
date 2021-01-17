#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/first */
require('dotenv').config();
const config_1 = require("../src/config");
const io_client_1 = require("../src/io-client");
const wechaty_1 = require("../src/wechaty");
const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/

=============== Powered by Wechaty ===============
       -------- https://www.chatie.io --------

My super power: download cloud bot from www.chatie.io

__________________________________________________

`;
async function main() {
    const token = config_1.config.token;
    if (!token) {
        throw new Error('token not found: please set WECHATY_TOKEN in environment before run io-client');
    }
    console.info(welcome);
    config_1.log.info('Client', 'Starting for WECHATY_TOKEN: %s', token);
    const wechaty = new wechaty_1.Wechaty({ name: token });
    const port = parseInt(process.env.WECHATY_HOSTIE_PORT || '0');
    const options = {
        token,
        wechaty,
    };
    if (port) {
        options.port = port;
    }
    const client = new io_client_1.IoClient(options);
    client.start()
        .catch(onError.bind(client));
}
async function onError(e) {
    config_1.log.error('Client', 'start() fail: %s', e);
    await this.quit();
    process.exit(-1);
}
main()
    .catch(console.error);
//# sourceMappingURL=io-client.js.map