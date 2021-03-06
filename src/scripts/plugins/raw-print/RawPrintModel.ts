import { T1CLibException } from '../../core/exceptions/CoreExceptions';
import {BoolDataResponse, DataArrayResponse } from '../../core/service/CoreModel';

export interface AbstractRawPrint {
    list(callback?: (error: T1CLibException, data: DataArrayResponse) => void): Promise<DataArrayResponse>;
    print(body: RawPrintPrintRequest, callback?: (error: T1CLibException, data: BoolDataResponse) => void): Promise<BoolDataResponse>;
}

export class RawPrintPrintRequest {
    constructor(public name: string, public job: string, public data: string) {
    }
}
