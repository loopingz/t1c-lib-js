/**
 * @author Maarten Somers
 * @since 2018
 */
import {GCLClient} from '../core/GCLLib';
import * as _ from 'lodash';
import * as semver from 'semver';
import {SyncUtil} from './SyncUtil';
import {ActivationUtil} from './ActivationUtil';
import {DSPlatformInfo} from '../core/ds/DSClientModel';
import {PubKeyService} from './PubKeyService';
import {RestException} from '../core/exceptions/CoreExceptions';
import {AxiosError, AxiosResponse} from 'axios';
import axios from 'axios';

export class InitUtil {
    // constructor
    constructor() {
    }

    /**
     * Initializes the library.
     * @param {GCLClient} client
     * @returns {Promise<any>}
     */
    public static initializeLibrary(client: GCLClient): Promise<GCLClient> {
        return new Promise((finalResolve, finalReject) => {
            let initPromise = new Promise((resolve, reject) => {
                let cfg = client.config();
                client.core().info().then(infoResponse => {
                    // update config values
                    cfg.citrix = infoResponse.data.citrix;
                    // browser fingerprint compatible?
                    cfg.tokenCompatible = InitUtil.checkTokenCompatible(infoResponse.data.version);
                    cfg.v2Compatible = InitUtil.coreV2Compatible(infoResponse.data.version);

                    if (cfg.v2Compatible) {
                        // console.log('v2 compatible');
                        let activated = infoResponse.data.activated;
                        let core_version = infoResponse.data.version;
                        let uuid = infoResponse.data.uid;
                        // compose info
                        let info = client.core().infoBrowserSync();

                        let mergedInfo;

                        if (cfg.dsUrl) {
                            let ns = this.extractHostname(cfg.dsUrl);
                            mergedInfo = new DSPlatformInfo(activated, info.data, core_version, ns);
                        }
                        else {
                            mergedInfo = new DSPlatformInfo(activated, info.data, core_version);
                        }

                        let activationPromise;
                        if (activated) {
                            // already activated, only need to sync device
                            activationPromise = Promise.resolve();
                        } else {
                            // not yet activated, do this now
                            activationPromise = ActivationUtil.unManagedInitialization(client, mergedInfo, uuid);
                        }
                        activationPromise.then(() => {
                            // update core service
                            client.updateAuthConnection(cfg);
                            resolve(SyncUtil.unManagedSynchronization(client, mergedInfo, uuid, infoResponse.data.containers));
                        }, err => {
                            reject(err);
                            // resolve(SyncUtil.unManagedSynchronization(client.admin(), client.ds(), cfg, mergedInfo, uuid));
                        });
                    } else {
                        // installed version is not compatible, reject initialization
                        // return the client in the error so a new version can be downloaded!
                        reject(new RestException(400, '301',
                            'Installed GCL version is not v2 compatible. Please update to a compatible version.', client));
                    }
                }, () => {
                    // failure probably because GCL is not installed
                    client.gclInstalled = false;
                    // check if older GCL version is available at v1 endpoint
                    axios.get('https://localhost:10443/v1').then((response: AxiosResponse) => {
                        // response received, inform user that he needs to update
                        reject(new RestException(400, '301',
                            'Installed GCL version is not v2 compatible. Please update to a compatible version.', client));
                    }).catch(() => {
                        // no response, no older GCL version installed
                        // return the client in the error so a new version can be downloaded!
                        reject(new RestException(400, '302',
                            'No installed GCL component found. Please download and install the GCL.', client));
                    });
                });
            });
            initPromise.then(() => {
                // store device PubKey
                client.admin().getPubKey().then(pubKey => {
                    // console.log(pubKey);
                    PubKeyService.setPubKey(pubKey.data.device);
                    finalResolve();
                });
            }, err => {
                finalReject(err);
            });

        });
    }

    private static extractHostname(url: string): string {
        let hostname;
        // find & remove protocol (http, ftp, etc.) and get hostname
        if (url.indexOf('://') > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
        // find & remove port number
        hostname = hostname.split(':')[0];
        // find & remove "?"
        hostname = hostname.split('?')[0];
        return hostname;
    }

    private static coreV2Compatible(version: string): boolean {
        // sanitize version string
        let sanitized = _.split(version, '-')[0];
        return semver.satisfies(sanitized, '>=2.0.0');
    }

    private static checkTokenCompatible(version: string): boolean {
        // sanitize version string
        let sanitized = _.split(version, '-')[0];
        return semver.satisfies(sanitized, '>=1.4.0');
    }
}
