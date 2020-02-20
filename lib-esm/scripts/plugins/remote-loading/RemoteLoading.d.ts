import { AbstractRemoteLoading, APDU, CommandResponse, CommandsResponse } from './RemoteLoadingModel';
import { T1CLibException } from '../../core/exceptions/CoreExceptions';
import { BoolDataResponse, DataResponse } from '../../core/service/CoreModel';
import { GenericReaderContainer } from '../smartcards/Card';
import { LocalConnection } from '../../core/client/Connection';
export declare class RemoteLoading extends GenericReaderContainer implements AbstractRemoteLoading {
    static CONTAINER_PREFIX: string;
    static ATR: string;
    static APDU: string;
    static APDUS: string;
    static CCID: string;
    static CCID_FEATURES: string;
    static CMD: string;
    static CMDS: string;
    static CLOSE_SESSION: string;
    static IS_PRESENT: string;
    static OPEN_SESSION: string;
    constructor(baseUrl: string, containerUrl: string, connection: LocalConnection, reader_id: string);
    private static optionalSessionIdParam;
    atr(sessionId?: string, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<DataResponse>;
    apdu(apdu: APDU, sessionId?: string, callback?: (error: T1CLibException, data: CommandResponse) => void): Promise<CommandResponse>;
    apdu(apdu: APDU[], sessionId?: string, callback?: (error: T1CLibException, data: CommandsResponse) => void): Promise<CommandsResponse>;
    ccid(feature: string, command: string, sessionId?: string, callback?: (error: T1CLibException, data: CommandResponse) => void): Promise<CommandResponse>;
    ccidFeatures(sessionId?: string, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<DataResponse>;
    command(tx: string, sessionId?: string, callback?: (error: T1CLibException, data: CommandResponse) => void): Promise<CommandResponse>;
    command(tx: string[], sessionId?: string, callback?: (error: T1CLibException, data: CommandsResponse) => void): Promise<CommandsResponse>;
    closeSession(sessionId?: string, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<DataResponse>;
    isPresent(sessionId?: string, callback?: (error: T1CLibException, data: BoolDataResponse) => void): Promise<BoolDataResponse>;
    openSession(timeout?: number, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<DataResponse>;
}
