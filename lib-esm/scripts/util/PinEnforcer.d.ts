import { GenericConnection } from '../core/client/Connection';
export declare class PinEnforcer {
    static check(connection: GenericConnection, readerId: string, body: {
        pin?: string;
    }): Promise<any>;
    static checkAlreadyEncryptedPin(connection: GenericConnection, readerId: string, body: {
        pin?: string;
    }): Promise<any>;
    static encryptPin(pin: string): string;
    private static doPinCheck;
    private static updateBodyWithEncryptedPin;
}
export declare class EncryptedOptionalPin {
    os_dialog?: boolean;
    pinpad?: boolean;
    pin?: string;
    pace?: string;
    constructor(os_dialog?: boolean, pinpad?: boolean, pin?: string, pace?: string);
}
