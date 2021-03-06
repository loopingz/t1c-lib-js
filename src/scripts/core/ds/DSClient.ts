
import {Connection} from '../client/Connection';
import {GCLConfig} from '../GCLConfig';
import {
    AbstractDSClient, DeviceResponse, DSDownloadLinkResponse, DSDownloadRequest,
    DSInfoResponse, DSPubKeyResponse, DSRegistrationOrSyncRequest
} from './DSClientModel';
import {T1CLibException} from '../exceptions/CoreExceptions';


const SEPARATOR = '/';
const SECURITY = '/security';
const SYS_INFO = '/system/status';
const DOWNLOAD = '/download/';
const DOWNLOAD_DEFAULT = 'gcl';
const PUB_KEY = SECURITY + '/keys/public';
const DEVICE = '/devices';

/**
 * Provides access to Distribution Service endpoints
 */
export class DSClient implements AbstractDSClient {
    constructor(private url: string, private connection: Connection, private cfg: GCLConfig) {
    }

    private static namespaceFilter(gwurl: string): {} {
        let hostname;
        if (gwurl.indexOf('//') > -1) {
            hostname = gwurl.split('/')[2];
        }
        else {
            hostname = gwurl.split('/')[0];
        }
        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];

        return { namespace: hostname};
    }

    public getUrl() {
        return this.url;
    }

    public getInfo(callback?: (error: T1CLibException, data: DSInfoResponse) => void): Promise<DSInfoResponse> {
        return this.connection.get(this.url, SYS_INFO, undefined, undefined, callback);
    }

    public getDevice(uuid: string,
                     callback?: (error: T1CLibException, data: DeviceResponse) => void): Promise<DeviceResponse> {
        return this.connection.get(this.url, DEVICE + SEPARATOR + uuid, undefined, undefined, callback);
    }

    public getPubKey(uuid: string,
                     callback?: (error: T1CLibException, data: DSPubKeyResponse) => void): Promise<DSPubKeyResponse> {
        if (this.cfg.gwUrl) {
            return this.connection.get(this.url, PUB_KEY + SEPARATOR + uuid  , DSClient.namespaceFilter(this.cfg.gwUrl), undefined, callback);
        }
        else {
            return this.connection.get(this.url, PUB_KEY + SEPARATOR + uuid  , undefined, undefined, callback);
        }
    }

    public downloadLink(downloadData: DSDownloadRequest,
                        callback?: (error: T1CLibException,
                                    data: DSDownloadLinkResponse) => void): Promise<DSDownloadLinkResponse> {
        let self = this;
        if (callback) {
            doGetDownloadLink(downloadData.gclVersion);
        } else {
            // promise
            return new Promise<DSDownloadLinkResponse>((resolve, reject) => {
                doGetDownloadLink(downloadData.gclVersion, resolve, reject);
            });
        }

        function doGetDownloadLink(version?: string, resolve?: (data: any) => void, reject?: (data: any) => void) {
            let suffix = DOWNLOAD + (version ? version : DOWNLOAD_DEFAULT);
            self.connection.post(self.url, suffix, downloadData, undefined, undefined, function (err, data) {
                if (err) {
                    if (callback) {
                        return callback(err, null);
                    }
                    else {
                        reject(err);
                    }
                } else {
                    let returnObject = {url: data.link, success: true};
                    if (callback) {
                        return callback(null, returnObject);
                    }
                    else {
                        return resolve(returnObject);
                    }
                }
            });
        }
    }

    public register(registrationData: DSRegistrationOrSyncRequest,
                    callback?: (error: T1CLibException, data: DeviceResponse) => void): Promise<DeviceResponse> {
        return this.connection.put(this.url, DEVICE + SEPARATOR + registrationData.uuid, registrationData, undefined, undefined, callback);
    }

    public sync(syncData: DSRegistrationOrSyncRequest,
                callback?: (error: T1CLibException, data: DeviceResponse) => void): Promise<DeviceResponse> {
        return this.connection.post(this.url, DEVICE + SEPARATOR + syncData.uuid, syncData, undefined, undefined, callback);
    }

}
