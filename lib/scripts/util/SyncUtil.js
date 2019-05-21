"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DSClientModel_1 = require("../core/ds/DSClientModel");
var DataContainerUtil_1 = require("./DataContainerUtil");
var CoreExceptions_1 = require("../core/exceptions/CoreExceptions");
var adminModel_1 = require("../core/admin/adminModel");
var ActivatedContainerUtil_1 = require("./ActivatedContainerUtil");
var Utils_1 = require("./Utils");
var SyncUtil = (function () {
    function SyncUtil() {
    }
    SyncUtil.unManagedSynchronization = function (client, mergedInfo, uuid, containers, config) {
        return new Promise(function (resolve, reject) {
            if (client.ds()) {
                SyncUtil.doSyncFlow(client, mergedInfo, uuid, containers, false, config).then(function () {
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            }
            else {
                resolve();
            }
        });
    };
    SyncUtil.syncDevice = function (client, pubKey, info, deviceId, containers) {
        return client.ds().then(function (ds) {
            return ds.sync(new DSClientModel_1.DSRegistrationOrSyncRequest(info.activated, deviceId, info.core_version, pubKey, info.manufacturer, info.browser, info.os, info.ua, client.config().gwUrl, new DSClientModel_1.DSClientInfo('JAVASCRIPT', VERSION), info.namespace, containers));
        });
    };
    SyncUtil.doSyncFlow = function (client, mergedInfo, uuid, containers, isRetry, config) {
        return client.admin().getPubKey().then(function (pubKey) {
            return SyncUtil.syncDevice(client, pubKey.data.device, mergedInfo, uuid, containers).then(function (device) {
                client.ds().then(function (dsclient) {
                    client.updateAuthConnection(config);
                    dsclient.getPubKey(uuid).then(function (dsPubkeyres) {
                        var pubKeyReq = new adminModel_1.SetPubKeyRequest(dsPubkeyres.encryptedPublicKey, dsPubkeyres.encryptedAesKey, dsPubkeyres.ns);
                        client.admin().setPubKey(pubKeyReq).then(function (res) {
                            client.config().contextToken = device.contextToken;
                            client.admin().atr(device.atrList);
                            return client.admin().updateContainerConfig(new adminModel_1.ContainerSyncRequest(device.containerResponses)).then(function () {
                                client.config().activeContainers = ActivatedContainerUtil_1.ActivatedContainerUtil.getSortedContainers(device.containerResponses);
                                DataContainerUtil_1.DataContainerUtil.setupDataContainers(device.containerResponses);
                                return SyncUtil.pollDownloadCompletion(client, device.containerResponses, isRetry).then(function (finalContainerList) {
                                    return SyncUtil.syncDevice(client, pubKey.data.device, mergedInfo, uuid, finalContainerList);
                                }, function (error) {
                                    if (typeof error === 'boolean' && !isRetry) {
                                        console.log('download error, retrying');
                                        return Promise.resolve(SyncUtil.doSyncFlow(client, mergedInfo, uuid, containers, true, config));
                                    }
                                    else {
                                        return Promise.reject(error);
                                    }
                                });
                            });
                        }, function (err) {
                            console.error(err);
                            return Promise.reject(err);
                        });
                    }, function (err) {
                        console.error(err);
                        return Promise.reject(err);
                    });
                }, function (err) {
                    console.error(err);
                    return Promise.reject(err);
                });
            });
        });
    };
    SyncUtil.pollDownloadCompletion = function (client, containerConfig, isRetry) {
        var maxSeconds = client.config().containerDownloadTimeout || 30;
        var pollInterval = 250;
        var remainingTries = (maxSeconds * 1000) / pollInterval;
        return new Promise(function (resolve, reject) {
            poll(resolve, reject);
        });
        function poll(resolve, reject) {
            setTimeout(function () {
                --remainingTries;
                client.core().info().then(function (infoData) {
                    var containers = infoData.data.containers;
                    checkDownloadsComplete(containerConfig, containers).then(function (ready) {
                        if (ready) {
                            resolve(containers);
                        }
                        else {
                            if (remainingTries === 0) {
                                reject(new CoreExceptions_1.T1CLibException(408, '904', 'Container download did not complete before timeout.', null));
                            }
                            else {
                                poll(resolve, reject);
                            }
                        }
                    }, function (error) {
                        reject(error);
                    });
                });
            }, pollInterval);
        }
        function checkDownloadsComplete(cfg, containerStatus) {
            return new Promise(function (resolve, reject) {
                if (containerMissing(cfg, containerStatus) || downloadErrored(cfg, containerStatus)) {
                    if (isRetry) {
                        reject(new CoreExceptions_1.T1CLibException(500, '903', 'Container download failed'));
                    }
                    else {
                        reject(false);
                    }
                }
                else if (downloadOngoing(cfg, containerStatus)) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        }
        function containerMissing(config, status) {
            return config.find(function (cfgCt) {
                return !status.find(function (statusCt) { return cfgCt.name === statusCt.name && cfgCt.version === statusCt.version; });
            });
        }
        function downloadErrored(config, status) {
            config.forEach(function (cfg) {
                status.forEach(function (sts) {
                    return !!(cfg.name === sts.name && cfg.version === sts.version && Utils_1.Util.includes(SyncUtil.ERROR_STATES, sts.status));
                });
            });
        }
        function downloadOngoing(config, status) {
            config.forEach(function (cfg) {
                status.forEach(function (sts) {
                    return !!(cfg.name === sts.name && cfg.version === sts.version && Utils_1.Util.includes(SyncUtil.ONGOING_STATES, sts.status));
                });
            });
        }
    };
    SyncUtil.DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
    SyncUtil.GENERIC_ERROR = 'ERROR';
    SyncUtil.ERROR_STATES = [SyncUtil.DOWNLOAD_ERROR, SyncUtil.GENERIC_ERROR];
    SyncUtil.INIT = 'INIT';
    SyncUtil.DOWNLOADING = 'DOWNLOADING';
    SyncUtil.ONGOING_STATES = [SyncUtil.INIT, SyncUtil.DOWNLOADING];
    SyncUtil.INSTALLED = 'INSTALLED';
    return SyncUtil;
}());
exports.SyncUtil = SyncUtil;
//# sourceMappingURL=SyncUtil.js.map