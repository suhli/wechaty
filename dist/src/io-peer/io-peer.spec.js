#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const json_rpc_peer_1 = __importStar(require("json-rpc-peer"));
const io_peer_1 = require("./io-peer");
blue_tape_1.default('getPeer()', async (t) => {
    const EXPECTED_PORT = 8788;
    const server = io_peer_1.getPeer({
        hostieGrpcPort: EXPECTED_PORT,
    });
    const client = new json_rpc_peer_1.default();
    server.pipe(client).pipe(server);
    const port = await client.request('getHostieGrpcPort');
    t.equal(port, EXPECTED_PORT, 'should get the right port');
});
blue_tape_1.default('exec()', async (t) => {
    const EXPECTED_PORT = 8788;
    const server = io_peer_1.getPeer({
        hostieGrpcPort: EXPECTED_PORT,
    });
    const request = json_rpc_peer_1.format.request(42, 'getHostieGrpcPort');
    const response = await server.exec(request);
    // console.info('response: ', response)
    const obj = json_rpc_peer_1.parse(response);
    t.equal(obj.result, EXPECTED_PORT, 'should get the right port from payload');
});
//# sourceMappingURL=io-peer.spec.js.map