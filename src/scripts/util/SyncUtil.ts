/**
 * @author Maarten Somers
 * @since 2018
 */
import { GCLConfig } from '../core/GCLConfig';
import {
    DeviceResponse, DSContainer, DSPlatformInfo, DSRegistrationOrSyncRequest,
    JWTResponse
} from '../core/ds/DSClientModel';
import { Promise } from 'es6-promise';
import { DSClient } from '../core/ds/DSClient';
import { DataContainerUtil } from './DataContainerUtil';
import * as _ from 'lodash';
import { GCLClient } from '../core/GCLLib';
import { RestException } from '../core/exceptions/CoreExceptions';
import { T1CContainer } from '../core/service/CoreModel';
import { ContainerSyncRequest } from '../core/admin/adminModel';

export { SyncUtil };

class SyncUtil {
    static readonly DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
    static readonly INIT = 'INIT';
    static readonly DOWNLOADING = 'DOWNLOADING';
    static readonly INSTALLED = 'INSTALLED';

    // constructor
    constructor() {}

    public static managedSynchronisation(client: GCLClient, mergedInfo: DSPlatformInfo, uuid: string, containers: T1CContainer[]) {
        return client.admin().getPubKey().then(keys => {
            return SyncUtil.syncDevice(client, keys.data.device, mergedInfo, uuid, containers);
        });
    }

    public static unManagedSynchronization(client: GCLClient,
                                           mergedInfo: DSPlatformInfo,
                                           uuid: string,
                                           isRetry: boolean) {
        // do core v2 sync flow
        return new Promise((resolve, reject) => {
            // get GCL Pubkey
            // get current container state
            // sync
            // get container list
            // pass container list to gcl
            // wait completion/fail
            // final sync with updated container list
            client.admin().getPubKey().then(pubKey => {
                return client.core().info().then(info => {
                    return SyncUtil.syncDevice(client, pubKey.data.device, mergedInfo, uuid, info.data.containers).then(device => {
                        return client.admin().updateContainerConfig(new ContainerSyncRequest(device.containerResponses)).then(() => {
                            // setup data container paths
                            DataContainerUtil.setupDataContainers(device.containerResponses);

                            return SyncUtil.pollDownloadCompletion(client,
                                device.containerResponses, isRetry).then((finalContainerList) => {
                                // all downloads complete, do final sync
                                return SyncUtil.syncDevice(client, pubKey.data.device, mergedInfo, uuid, finalContainerList).then(() => {
                                    // lib ready to use
                                    resolve();
                                });
                            }, (error) => {
                                if (typeof error === 'boolean' && !isRetry) {
                                    // need to trigger retry
                                    resolve(SyncUtil.unManagedSynchronization(client, mergedInfo, uuid, true));
                                } else {
                                    // something went wrong, return error
                                    reject(error);
                                }
                            });
                        });
                    });
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    public static syncDevice(client: GCLClient,
                             pubKey: string,
                             info: DSPlatformInfo,
                             deviceId: string,
                             containers: T1CContainer[]): Promise<DeviceResponse> {
        return client.ds().sync(new DSRegistrationOrSyncRequest(info.managed,
            info.activated,
            deviceId,
            info.core_version,
            pubKey,
            info.manufacturer,
            info.browser,
            info.os,
            info.ua,
            client.config().gwUrl,
            containers)
        );
    }

    private static pollDownloadCompletion(client: GCLClient, containerConfig: DSContainer[], isRetry: boolean): Promise<T1CContainer[]> {
        let maxSeconds = client.config().containerDownloadTimeout || 30;

        return new Promise((resolve, reject) => {
            // TODO activate polling once DS and GCL are capable
            // poll(resolve, reject);
            resolve([]);
        });

        function poll(resolve?: (containers: T1CContainer[]) => void, reject?: (error: any) => void) {
            // monitor status for each container in config
            _.delay(() => {
                --maxSeconds;
                client.core().info().then(infoData => {
                    let containers = infoData.data.containers;
                    checkDownloadsComplete(containerConfig, containers).then((ready) => {
                        if (ready) { resolve(containers); }
                        else { poll(resolve, reject); }
                    }, error => {
                        reject(error);
                    });
                });
            }, 1000);
        }

        function checkDownloadsComplete(cfg: any, containerStatus: any): Promise<boolean> {
            // check all containers in list
            // if >= 1 error, reject
            // if >= 1 in progress, poll again
            // if all done, resolve
            return new Promise<boolean>((resolve, reject) => {
                if (containerMissing(cfg, containerStatus) || downloadErrored(cfg, containerStatus)) {
                    // check if we were already retrying
                    if (isRetry) {
                        reject(new RestException(500, '903', 'Container download failed'));
                    } else {
                        // trigger retry
                        reject(false);
                    }
                }
                else if (downloadOngoing(cfg, containerStatus)) { resolve(false); }
                else { resolve(true); }
            });
        }

        function containerMissing(config: { name: string, version: string}[], status: { name: string, version: string, status: string }[]) {
            return _.find(config, cfgCt => {
                return !_.find(status, statusCt => { return cfgCt.name === statusCt.name && cfgCt.version === statusCt.version; });
            });
        }

        function downloadErrored(config: { name: string, version: string }[], status: { name: string, version: string, status: string }[]) {
            return _.find(config, cfgCt => {
                return _.find(status, statusCt => {
                    return cfgCt.name === statusCt.name && cfgCt.version === statusCt.version
                           && statusCt.status === SyncUtil.DOWNLOAD_ERROR;
                });
            });
        }

        function downloadOngoing(config: { name: string, version: string }[], status: { name: string, version: string, status: string }[]) {
            return _.find(config, cfgCt => {
                return _.find(status, statusCt => {
                    return cfgCt.name === statusCt.name && cfgCt.version === statusCt.version
                           && (statusCt.status === SyncUtil.INIT || statusCt.status === SyncUtil.DOWNLOADING);
                });
            });
        }
    }
}
