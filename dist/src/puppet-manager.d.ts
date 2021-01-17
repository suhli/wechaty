import { Puppet, PuppetImplementation, PuppetOptions } from 'wechaty-puppet';
import { PuppetModuleName } from './puppet-config';
export interface ResolveOptions {
    puppet: Puppet | PuppetModuleName;
    puppetOptions?: PuppetOptions;
}
export declare class PuppetManager {
    static resolve(options: ResolveOptions): Promise<Puppet>;
    protected static resolveName(puppetName: PuppetModuleName): Promise<PuppetImplementation>;
    protected static checkModule(puppetName: PuppetModuleName): Promise<void>;
    protected static getModuleVersion(moduleName: string): string;
    protected static resolveInstance(instance: Puppet): Promise<Puppet>;
    protected static installed(moduleName: string): boolean;
    private static preInstallPuppeteer;
    static install(puppetModule: string, puppetVersion?: string): Promise<void>;
    /**
     * Install all `wechaty-puppet-*` modules from `puppet-config.ts`
     */
    static installAll(): Promise<void>;
}
//# sourceMappingURL=puppet-manager.d.ts.map