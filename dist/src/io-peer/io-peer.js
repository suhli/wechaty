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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonRpcResponse = exports.isJsonRpcRequest = exports.isJsonRpcNotification = exports.isJsonRpcError = exports.getPeer = void 0;
const json_rpc_peer_1 = __importStar(require("json-rpc-peer"));
// // https://stackoverflow.com/a/50375286/1123955
// type UnionToIntersection<U> =
//   (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never
// type UnknownJsonRpcPayload = Partial<UnionToIntersection<JsonRpcPayload>>
const isJsonRpcRequest = (payload) => ('method' in payload);
exports.isJsonRpcRequest = isJsonRpcRequest;
const isJsonRpcNotification = (payload) => isJsonRpcRequest(payload) && (!('id' in payload));
exports.isJsonRpcNotification = isJsonRpcNotification;
const isJsonRpcResponse = (payload) => ('result' in payload);
exports.isJsonRpcResponse = isJsonRpcResponse;
const isJsonRpcError = (payload) => ('error' in payload);
exports.isJsonRpcError = isJsonRpcError;
const getPeer = (options) => {
    const getHostieGrpcPort = () => options.hostieGrpcPort;
    const serviceImpl = {
        getHostieGrpcPort,
    };
    const onMessage = async (message) => {
        if (isJsonRpcRequest(message)) {
            const { 
            // id,
            method, } = message;
            if (!(method in serviceImpl)) {
                console.error('serviceImpl does not contain method: ' + method);
                return;
            }
            const serviceMethodName = method;
            switch (serviceMethodName) {
                case 'getHostieGrpcPort':
                    return serviceImpl[serviceMethodName]();
                default:
                    throw new json_rpc_peer_1.MethodNotFound(serviceMethodName);
            }
        }
        else if (isJsonRpcResponse(message)) {
            // NOOP: we are server
        }
        else if (isJsonRpcNotification(message)) {
            // NOOP: we are server
        }
        else if (isJsonRpcError(message)) {
            // NOOP: we are server
        }
        else {
            throw new Error('unknown json-rpc message: ' + JSON.stringify(message));
        }
        console.info(JSON.stringify(message));
    };
    const ioPeer = new json_rpc_peer_1.default(onMessage);
    return ioPeer;
};
exports.getPeer = getPeer;
//# sourceMappingURL=io-peer.js.map