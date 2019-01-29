import {LocalConnection, T1CLibException} from '../../..';
import {GenericContainer} from '../GenericContainer';
import {AbstractSsh, CreateKeyRequest, CreateKeyResponse, GetAllKeysResponse, GetKeyRequest, GetUserKeyResponse, RemoveKeyRequest, RemoveKeyResponse} from './SshModel';


export class Ssh extends GenericContainer implements AbstractSsh {
    static CONTAINER_PREFIX = 'ssh';
    static ALL = '/get-user-keys';
    static GET = '/get-user-key';
    static ADD = '/create-key';
    static REMOVE = '/remove-key';


    constructor(baseUrl: string, containerUrl: string, connection: LocalConnection, containerPrefix: string) {
        super(baseUrl, containerUrl, connection, containerPrefix);
    }

    add(request: CreateKeyRequest, callback?: (error: T1CLibException, data: CreateKeyResponse) => void): Promise<CreateKeyResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(Ssh.ADD), request ,undefined, undefined, callback);
    }

    all(callback?: (error: T1CLibException, data: GetAllKeysResponse) => void): Promise<GetAllKeysResponse> {
        return this.connection.get(this.baseUrl, this.containerSuffix(Ssh.ALL), undefined, undefined, callback);
    }

    get(request: GetKeyRequest, callback?: (error: T1CLibException, data: GetUserKeyResponse) => void): Promise<GetUserKeyResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(Ssh.ADD), request ,undefined, undefined, callback);
    }

    remove(request: RemoveKeyRequest, callback?: (error: T1CLibException, data: RemoveKeyResponse) => void): Promise<RemoveKeyResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(Ssh.REMOVE), request ,undefined, undefined, callback);
    }
}
