#!/usr/bin/env ts-node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const blue_tape_1 = __importDefault(require("blue-tape"));
const io_1 = require("./io");
const wechaty_1 = require("./wechaty");
blue_tape_1.default('Io restart without problem', async (t) => {
    const io = new io_1.Io({
        // token must not contain any white spaces
        hostiePort: 8788,
        token: 'mock_token_in_wechaty/wechaty/src/io.spec.ts',
        wechaty: new wechaty_1.Wechaty(),
    });
    try {
        for (let i = 0; i < 2; i++) {
            await io.start();
            await io.stop();
            t.pass('start/stop-ed at #' + i);
        }
        t.pass('start/restart successed.');
    }
    catch (e) {
        t.fail(e);
    }
});
//# sourceMappingURL=io.spec.js.map