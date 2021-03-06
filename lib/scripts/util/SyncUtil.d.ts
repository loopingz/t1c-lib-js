import { DeviceResponse, DSPlatformInfo } from '../core/ds/DSClientModel';
import { GCLClient } from '../core/GCLLib';
import { T1CContainer } from '../core/service/CoreModel';
import { GCLConfig } from '../..';
export declare class SyncUtil {
    static readonly DOWNLOAD_ERROR = "DOWNLOAD_ERROR";
    static readonly GENERIC_ERROR = "ERROR";
    static readonly ERROR_STATES: string[];
    static readonly INIT = "INIT";
    static readonly DOWNLOADING = "DOWNLOADING";
    static readonly ONGOING_STATES: string[];
    static readonly INSTALLED = "INSTALLED";
    constructor();
    static unManagedSynchronization(client: GCLClient, mergedInfo: DSPlatformInfo, uuid: string, containers: T1CContainer[], config: GCLConfig): void;
    static syncDevice(client: GCLClient, pubKey: string, info: DSPlatformInfo, deviceId: string, containers: T1CContainer[]): Promise<DeviceResponse>;
    private static doSyncFlow;
    private static pollDownloadCompletion;
}
