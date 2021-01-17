import { Wechaty } from './wechaty';
export interface IoClientOptions {
    token: string;
    wechaty: Wechaty;
    port?: number;
}
export declare class IoClient {
    /**
     * Huan(20161026): keep io `null-able` or not?
     * Huan(202002): make it optional.
     */
    private io?;
    private puppetServer?;
    private state;
    protected options: Required<IoClientOptions>;
    constructor(options: IoClientOptions);
    private startHostie;
    private stopHostie;
    start(): Promise<void>;
    private hookWechaty;
    private startIo;
    private stopIo;
    private onMessage;
    stop(): Promise<void>;
    restart(): Promise<void>;
    quit(): Promise<void>;
}
//# sourceMappingURL=io-client.d.ts.map