#!/usr/bin/env ts-node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tstest_1 = __importDefault(require("tstest"));
const url_link_1 = require("./url-link");
tstest_1.default('UrlLink', async (t) => {
    const URL = 'https://wechaty.js.org/2020/07/02/wechat-bot-in-ten-minutes';
    const EXPECTED_PAYLOAD = {
        description: '十分钟实现一个智能问答微信聊天机器人',
        thumbnailUrl: 'https://wechaty.js.org/assets/developers/luweicn/avatar.png',
        title: '十分钟实现一个智能问答微信聊天机器人',
        url: 'https://wechaty.js.org/2020/07/02/wechat-bot-in-ten-minutes',
    };
    const urlLink = await url_link_1.UrlLink.create(URL);
    t.equal(urlLink.title(), EXPECTED_PAYLOAD.title, 'should have title');
    t.equal(urlLink.description(), EXPECTED_PAYLOAD.description, 'should have description');
    t.equal(urlLink.url(), EXPECTED_PAYLOAD.url, 'should have url');
    t.equal(urlLink.thumbnailUrl(), EXPECTED_PAYLOAD.thumbnailUrl, 'should have thumbnailUrl');
});
//# sourceMappingURL=url-link.spec.js.map