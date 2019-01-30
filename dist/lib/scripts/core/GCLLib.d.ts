import { CoreService } from './service/CoreService';
import { DSDownloadLinkResponse } from './ds/DSClientModel';
import { DSClient } from './ds/DSClient';
import { CardReadersResponse, DataResponse } from './service/CoreModel';
import { AbstractEidBE } from '../plugins/smartcards/eid/be/EidBeModel';
import { AbstractEMV } from '../plugins/smartcards/emv/EMVModel';
import { AbstractOcra } from '../plugins/smartcards/ocra/ocraModel';
import { AbstractAventra } from '../plugins/smartcards/pki/aventra/AventraModel';
import { AbstractLuxTrust } from '../plugins/smartcards/pki/luxtrust/LuxTrustModel';
import { AbstractOberthur } from '../plugins/smartcards/pki/oberthur/OberthurModel';
import { AbstractPiv } from '../plugins/smartcards/piv/pivModel';
import { AbstractMobib } from '../plugins/smartcards/mobib/mobibModel';
import { AbstractEidLUX, PinType } from '../plugins/smartcards/eid/lux/EidLuxModel';
import { AbstractDNIe } from '../plugins/smartcards/eid/esp/dnieModel';
import { PluginFactory } from '../plugins/PluginFactory';
import { AuthenticateOrSignData, OptionalPin } from '../plugins/smartcards/Card';
import { T1CLibException } from './exceptions/CoreExceptions';
import { AbstractEidPT } from '../plugins/smartcards/eid/pt/EidPtModel';
import { AbstractRemoteLoading } from '../plugins/remote-loading/RemoteLoadingModel';
import { AbstractBelfius } from '../plugins/remote-loading/belfius/BelfiusModel';
import { AbstractAgent } from './agent/agentModel';
import { AbstractFileExchange } from '../plugins/file/FileExchangeModel';
import { AdminService } from './admin/admin';
import { AbstractPkcs11 } from '../plugins/smartcards/pkcs11/pkcs11Model';
import { AuthClient } from './auth/Auth';
import { AbstractOCVClient } from './ocv/OCVModel';
import { GCLConfig } from './GCLConfig';
import { AbstractJavaKeyTool, AbstractSsh } from '../..';
export declare class GCLClient {
    private _gclInstalled;
    private localConfig;
    private pluginFactory;
    private adminService;
    private coreService;
    private connection;
    private authConnection;
    private authAdminConnection;
    private adminConnection;
    private remoteConnection;
    private remoteApiKeyConnection;
    private localTestConnection;
    private agentClient;
    private dsClient;
    private ocvClient;
    private authClient;
    constructor(cfg: GCLConfig, automatic: boolean);
    static checkPolyfills(): void;
    static initialize(cfg: GCLConfig, callback?: (error: T1CLibException, client: GCLClient) => void): Promise<GCLClient>;
    private static initLibrary;
    admin: () => AdminService;
    auth: () => AuthClient;
    core: () => CoreService;
    config: () => GCLConfig;
    agent: () => AbstractAgent;
    ds: () => Promise<DSClient>;
    ocv: () => AbstractOCVClient;
    pf: () => PluginFactory;
    beid: (reader_id?: string) => AbstractEidBE;
    dnie: (reader_id?: string) => AbstractDNIe;
    luxeid: (reader_id?: string, pin?: string, pinType?: PinType) => AbstractEidLUX;
    luxtrust: (reader_id?: string, pin?: string) => AbstractLuxTrust;
    emv: (reader_id?: string) => AbstractEMV;
    mobib: (reader_id?: string) => AbstractMobib;
    ocra: (reader_id?: string) => AbstractOcra;
    aventra: (reader_id?: string) => AbstractAventra;
    oberthur: (reader_id?: string) => AbstractOberthur;
    piv: (reader_id?: string) => AbstractPiv;
    pteid: (reader_id?: string) => AbstractEidPT;
    pkcs11: () => AbstractPkcs11;
    readerapi: (reader_id: string) => AbstractRemoteLoading;
    belfius: (reader_id: string) => AbstractBelfius;
    filex: () => AbstractFileExchange;
    javakeytool: () => AbstractJavaKeyTool;
    ssh: () => AbstractSsh;
    gclInstalled: boolean;
    containerFor(readerId: string, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<DataResponse>;
    download(callback?: (error: T1CLibException, data: DSDownloadLinkResponse) => void): Promise<DSDownloadLinkResponse>;
    dumpData(readerId: string, data: OptionalPin, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<DataResponse>;
    readersCanAuthenticate(callback?: (error: T1CLibException, data: CardReadersResponse) => void): Promise<any>;
    authenticate(readerId: string, data: AuthenticateOrSignData, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<any>;
    readersCanSign(callback?: (error: T1CLibException, data: CardReadersResponse) => void): Promise<any>;
    sign(readerId: string, data: AuthenticateOrSignData, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<any>;
    readersCanVerifyPin(callback?: (error: T1CLibException, data: CardReadersResponse) => void): Promise<any>;
    verifyPin(readerId: string, data: OptionalPin, callback?: (error: T1CLibException, data: DataResponse) => void): Promise<any>;
    updateAuthConnection(cfg: GCLConfig): void;
}
