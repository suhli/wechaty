import { Message } from './user/mod';
import Peer from 'json-rpc-peer';
import { Wechaty } from './wechaty';
export interface IoOptions {
    wechaty: Wechaty;
    token: string;
    apihost?: string;
    protocol?: string;
    hostiePort?: number;
}
export declare const IO_EVENT_DICT: {
    botie: string;
    error: string;
    heartbeat: string;
    jsonrpc: string;
    login: string;
    logout: string;
    message: string;
    raw: string;
    reset: string;
    scan: string;
    shutdown: string;
    sys: string;
    update: string;
};
export declare class Io {
    private options;
    private readonly id;
    private readonly protocol;
    private eventBuffer;
    private ws;
    private readonly state;
    private reconnectTimer?;
    private reconnectTimeout?;
    private lifeTimer?;
    private onMessage;
    private scanPayload?;
    protected jsonRpc?: Peer;
    constructor(options: IoOptions);
    toString(): string;
    private connected;
    start(): Promise<void>;
    private initEventHook;
    private initWebSocket;
    private wsOnOpen;
    private wsOnMessage;
    private wsOnError;
    private wsOnClose;
    private reconnect;
    private send;
    stop(): Promise<void>;
    /**
     *
     * Prepare to be overwritten by server setting
     *
     */
    private ioMessage;
    protected syncMessage(m: Message): Promise<void>;
}
//# sourceMappingURL=io.d.ts.map