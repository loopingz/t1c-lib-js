import {GenericContainer} from '../GenericContainer';
import {AbstractWacom, WacomGetDevicesResponse, WacomSignDataRequest, WacomSignDataResponse, WacomSystemInfoResponse} from './WacomModel';
import {LocalConnection} from '../../..';

export class Wacom extends GenericContainer implements AbstractWacom {
    static CONTAINER_PREFIX = 'wacom-stu';
    static GET = '/get-key';
    static DEVICES = '/devices';
    static SIGN = '/sign';
    static SYSTEM_INFO = '/system-info';

    constructor(baseUrl: string, containerUrl: string, connection: LocalConnection, containerPrefix: string) {
        super(baseUrl, containerUrl, connection, containerPrefix);
    }

    getDevices(callback?: () => void): Promise<WacomGetDevicesResponse> {
        return this.connection.get(this.baseUrl, this.containerSuffix(Wacom.DEVICES), undefined, undefined, callback);
    }

    signData(body: WacomSignDataRequest, callback?: () => void): Promise<WacomSignDataResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(Wacom.SIGN), body, undefined, undefined, callback);
    }

    systemInfo(callback?: () => void): Promise<WacomSystemInfoResponse> {
        return this.connection.get(this.baseUrl, this.containerSuffix(Wacom.SYSTEM_INFO), undefined, undefined, callback);
    }
}
