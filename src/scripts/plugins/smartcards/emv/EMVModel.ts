/**
 * @author Maarten Somers
 * @since 2017
 */
import { RestException } from "../../../core/exceptions/CoreExceptions";
import { PinCard } from "../Card";
import { DataObjectResponse, DataResponse, T1CResponse } from "../../../core/service/CoreModel";
import * as Bluebird from 'bluebird';

export { AbstractEMV, AllDataResponse, ApplicationDataResponse, ApplicationsResponse, EmvCertificateResponse };


interface AbstractEMV extends PinCard {
    allData(filters: string[], callback?: (error: RestException, data: AllDataResponse) => void): Bluebird<AllDataResponse>;
    applications(callback?: (error: RestException, data: ApplicationsResponse) => void): Bluebird<ApplicationsResponse>;
    applicationData(callback?: (error: RestException, data: ApplicationDataResponse) => void): Bluebird<ApplicationDataResponse>;
    iccPublicKeyCertificate(aid: string,
                            callback?: (error: RestException, data: EmvCertificateResponse) => void): Bluebird<EmvCertificateResponse>;
    issuerPublicKeyCertificate(aid: string,
                               callback?: (error: RestException, data: EmvCertificateResponse) => void): Bluebird<EmvCertificateResponse>;
}

interface AllDataResponse extends T1CResponse {
    data: {
        applications: Application[]
        application_data: ApplicationData
    }
}

interface Application {
    aid: string,
    name: string,
    priority: number
}

interface ApplicationsResponse extends T1CResponse {
    data: Application[]
}

interface ApplicationData {
    country: string,
    country_code: string,
    effective_date: string,
    expiration_date: string,
    language: string,
    name?: string,
    pan: string
}

interface ApplicationDataResponse extends T1CResponse {
    data: ApplicationData
}

interface EmvCertificate {
    data: string,
    exponent: string,
    remainder: string
}

interface EmvCertificateResponse extends T1CResponse {
    data: EmvCertificate
}