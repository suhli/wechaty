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
exports.PuppetManager = void 0;
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
const path_1 = __importDefault(require("path"));
const read_pkg_up_1 = __importDefault(require("read-pkg-up"));
const npm_programmatic_1 = __importDefault(require("npm-programmatic"));
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const semver_1 = __importDefault(require("semver"));
const in_gfw_1 = __importDefault(require("in-gfw"));
const wechaty_puppet_1 = require("wechaty-puppet");
const loose_instance_of_class_1 = require("./helper-functions/pure/loose-instance-of-class");
const config_1 = require("./config");
const puppet_config_1 = require("./puppet-config");
/**
 * Huan(202011):
 *  Create a `looseInstanceOfClass` to check `FileBox` and `Puppet` instances #2090
 *    https://github.com/wechaty/wechaty/issues/2090
 */
const looseInstanceOfPuppet = loose_instance_of_class_1.looseInstanceOfClass(wechaty_puppet_1.Puppet);
class PuppetManager {
    static async resolve(options) {
        config_1.log.verbose('PuppetManager', 'resolve({puppet: %s, puppetOptions: %s})', options.puppet, JSON.stringify(options.puppetOptions));
        let puppetInstance;
        /**
         * Huan(202001): (DEPRECATED) When we are developing, we might experiencing we have two version of wechaty-puppet installed,
         *  if `options.puppet` is Puppet v1, but the `Puppet` in Wechaty is v2,
         *  then options.puppet will not instanceof Puppet.
         *  So I changed here to match not a string as a workaround.
         *
         * Huan(202020): The wechaty-puppet-xxx must NOT dependencies `wechaty-puppet` so that it can be `instanceof`-ed
         *  wechaty-puppet-xxx should put `wechaty-puppet` in `devDependencies` and `peerDependencies`.
         */
        if (looseInstanceOfPuppet(options.puppet)) {
            puppetInstance = await this.resolveInstance(options.puppet);
        }
        else if (typeof options.puppet !== 'string') {
            config_1.log.error('PuppetManager', 'resolve() %s', `
        Wechaty Framework must keep only one Puppet instance #1930
        See: https://github.com/wechaty/wechaty/issues/1930
        `);
            throw new Error('Wechaty Framework must keep only one Puppet instance #1930');
        }
        else {
            const MyPuppet = await this.resolveName(options.puppet);
            /**
             * We will meet the following error:
             *
             *  [ts] Cannot use 'new' with an expression whose type lacks a call or construct signature.
             *
             * When we have different puppet with different `constructor()` args.
             * For example: PuppetA allow `constructor()` but PuppetB requires `constructor(options)`
             *
             * SOLUTION: we enforce all the PuppetImplementation to have `options` and should not allow default parameter.
             * Issue: https://github.com/wechaty/wechaty-puppet/issues/2
             */
            puppetInstance = new MyPuppet(options.puppetOptions);
        }
        return puppetInstance;
    }
    static async resolveName(puppetName) {
        config_1.log.verbose('PuppetManager', 'resolveName(%s)', puppetName);
        if (!puppetName) {
            throw new Error('must provide a puppet name');
        }
        if (!(puppetName in puppet_config_1.PUPPET_DEPENDENCIES)) {
            throw new Error([
                '',
                'puppet npm module not supported: "' + puppetName + '"',
                'learn more about supported Wechaty Puppet from our directory at',
                '<https://github.com/wechaty/wechaty-puppet/wiki/Directory>',
                '',
            ].join('\n'));
        }
        await this.checkModule(puppetName);
        const puppetModule = await Promise.resolve().then(() => __importStar(require(puppetName)));
        if (!puppetModule.default) {
            throw new Error(`Puppet(${puppetName}) has not provided the default export`);
        }
        const MyPuppet = puppetModule.default;
        return MyPuppet;
    }
    static async checkModule(puppetName) {
        config_1.log.verbose('PuppetManager', 'checkModule(%s)', puppetName);
        const versionRange = puppet_config_1.PUPPET_DEPENDENCIES[puppetName];
        /**
         * 1. Not Installed
         */
        if (!this.installed(puppetName)) {
            config_1.log.silly('PuppetManager', 'checkModule(%s) not installed.', puppetName);
            await this.install(puppetName, versionRange);
            return;
        }
        const moduleVersion = this.getModuleVersion(puppetName);
        const satisfy = semver_1.default.satisfies(moduleVersion, versionRange);
        /**
         * 2. Installed But Version Not Satisfy
         */
        if (!satisfy) {
            config_1.log.silly('PuppetManager', 'checkModule() %s installed version %s NOT satisfied range %s', puppetName, moduleVersion, versionRange);
            await this.install(puppetName, versionRange);
            return;
        }
        /**
         * 3. Installed and Version Satisfy
         */
        config_1.log.silly('PuppetManager', 'checkModule() %s installed version %s satisfied range %s', puppetName, moduleVersion, versionRange);
    }
    static getModuleVersion(moduleName) {
        const modulePath = path_1.default.dirname(require.resolve(moduleName));
        const pkg = read_pkg_up_1.default.sync({ cwd: modulePath }).packageJson;
        const version = pkg.version;
        return version;
    }
    static async resolveInstance(instance) {
        config_1.log.verbose('PuppetManager', 'resolveInstance(%s)', instance);
        // const version = instance.version()
        // const name = instance.name()
        // const satisfy = semver.satisfies(
        //   version,
        //   puppetConfig.npm.version,
        // )
        // TODO: check the instance version to satisfy semver
        return instance;
    }
    static installed(moduleName) {
        try {
            require.resolve(moduleName);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    static async preInstallPuppeteer() {
        let gfw = false;
        try {
            gfw = await in_gfw_1.default();
            if (gfw) {
                config_1.log.verbose('PuppetManager', 'preInstallPuppeteer() inGfw = true');
            }
        }
        catch (e) {
            config_1.log.verbose('PuppetManager', 'preInstallPuppeteer() exception: %s', e);
        }
        // https://github.com/GoogleChrome/puppeteer/issues/1597#issuecomment-351945645
        if (gfw && !process.env.PUPPETEER_DOWNLOAD_HOST) {
            config_1.log.info('PuppetManager', 'preInstallPuppeteer() set PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors/');
            process.env.PUPPETEER_DOWNLOAD_HOST = 'https://npm.taobao.org/mirrors/';
        }
    }
    static async install(puppetModule, puppetVersion = 'latest') {
        config_1.log.info('PuppetManager', 'install(%s@%s) please wait ...', puppetModule, puppetVersion);
        if (puppetModule === 'wechaty-puppet-puppeteer') {
            await this.preInstallPuppeteer();
        }
        await npm_programmatic_1.default.install(`${puppetModule}@${puppetVersion}`, {
            cwd: await pkg_dir_1.default(__dirname),
            output: true,
            save: false,
        });
        config_1.log.info('PuppetManager', 'install(%s@%s) done', puppetModule, puppetVersion);
    }
    /**
     * Install all `wechaty-puppet-*` modules from `puppet-config.ts`
     */
    static async installAll() {
        config_1.log.info('PuppetManager', 'installAll() please wait ...');
        const skipList = [
            '@juzibot/wechaty-puppet-donut',
            '@juzibot/wechaty-puppet-wxwork',
        ];
        const moduleList = [];
        for (const puppetModuleName of Object.keys(puppet_config_1.PUPPET_DEPENDENCIES)) {
            const version = puppet_config_1.PUPPET_DEPENDENCIES[puppetModuleName];
            if (version === '0.0.0' || skipList.includes(puppetModuleName)) {
                continue;
            }
            moduleList.push(`${puppetModuleName}@${version}`);
        }
        await npm_programmatic_1.default.install(moduleList, {
            cwd: await pkg_dir_1.default(__dirname),
            output: true,
            save: false,
        });
    }
}
exports.PuppetManager = PuppetManager;
//# sourceMappingURL=puppet-manager.js.map