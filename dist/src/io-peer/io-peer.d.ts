import Peer, { JsonRpcPayload, JsonRpcPayloadError, JsonRpcPayloadNotification, JsonRpcPayloadRequest, JsonRpcPayloadResponse } from 'json-rpc-peer';
declare const isJsonRpcRequest: (payload: JsonRpcPayload) => payload is JsonRpcPayloadRequest;
declare const isJsonRpcNotification: (payload: JsonRpcPayload) => payload is JsonRpcPayloadNotification;
declare const isJsonRpcResponse: (payload: JsonRpcPayload) => payload is JsonRpcPayloadResponse;
declare const isJsonRpcError: (payload: JsonRpcPayload) => payload is JsonRpcPayloadError;
interface IoPeerOptions {
    hostieGrpcPort: number;
}
declare const getPeer: (options: IoPeerOptions) => Peer;
export { getPeer, isJsonRpcError, isJsonRpcNotification, isJsonRpcRequest, isJsonRpcResponse, };
//# sourceMappingURL=io-peer.d.ts.map