/**
 * @author Maarten Somers
 * @since 2017
 */
import { T1CLibException } from '../../../../core/exceptions/CoreExceptions';
import {
    CertificateResponse, DataArrayResponse, DataObjectResponse, T1CCertificate,
    T1CResponse
} from '../../../../core/service/CoreModel';
import { CertCard, ResetPinData, VerifyPinData } from '../../Card';
import { Options } from '../../../../util/RequestHandler';

export interface AbstractAventra extends CertCard {
    allDataFilters(): string[];
    allCertFilters(): string[];
    allKeyRefs(): string[];
    allAlgoRefsForAuthentication(callback?: (error: T1CLibException, data: DataArrayResponse) => void): Promise<DataArrayResponse>;
    allAlgoRefsForSigning(callback?: (error: T1CLibException, data: DataArrayResponse) => void): Promise<DataArrayResponse>;
    allData(filters: string[], callback?: (error: T1CLibException, data: AventraAllDataResponse) => void): Promise<AventraAllDataResponse>;
    allCerts(filters: string[], callback?: (error: T1CLibException, data: AventraAllCertsResponse) => void): Promise<AventraAllCertsResponse>;
    rootCertificate(options?: Options, callback?: (error: T1CLibException, data: CertificateResponse) => void): Promise<CertificateResponse>;
    issuerCertificate(options?: Options,
                      callback?: (error: T1CLibException, data: CertificateResponse) => void): Promise<CertificateResponse>;
    authenticationCertificate(options?: Options,
                              callback?: (error: T1CLibException, data: CertificateResponse) => void): Promise<CertificateResponse>;
    signingCertificate(options?: Options,
                       callback?: (error: T1CLibException, data: CertificateResponse) => void): Promise<CertificateResponse>;
    encryptionCertificate(options?: Options,
                          callback?: (error: T1CLibException, data: CertificateResponse) => void): Promise<CertificateResponse>;
    verifyPin(body: VerifyPinData, callback?: (error: T1CLibException, data: T1CResponse) => void): Promise<T1CResponse>;
    resetPin(body: ResetPinData, callback?: (error: T1CLibException, data: T1CResponse) => void): Promise<T1CResponse>;
}

export class AventraAllCertsResponse extends DataObjectResponse {
    constructor(public data: AventraAllCerts, public success: boolean) {
        super(data, success);
    }
}

export class AventraAllCerts {
    constructor(public authentication_certificate?: T1CCertificate,
                public encryption_certificate?: T1CCertificate,
                public issuer_certificate?: T1CCertificate,
                public signing_certificate?: T1CCertificate,
                public root_certificate?: T1CCertificate) {}
}

export class AventraAllDataResponse extends DataObjectResponse {
    constructor(public data: AventraAllData, public success: boolean) {
        super(data, success);
    }
}

export class AventraAllData {
    constructor(public applet_info?: AventraAppletInfo,
                public authentication_certificate?: T1CCertificate,
                public encryption_certificate?: T1CCertificate,
                public issuer_certificate?: T1CCertificate,
                public signing_certificate?: T1CCertificate, public root_certificate?: T1CCertificate) {}
}

export class AventraAppletInfo {
    constructor(public change_counter?: number, public name?: string, public serial?: string, public version?: string) {}
}
