
import {AbstractFileExchange, FileListResponse, FileResponse, FileSort, ModalType, Page, TypeListResponse, TypeResponse} from './FileExchangeModel';
import {T1CLibException} from '../../core/exceptions/CoreExceptions';
import {BoolDataResponse, DataArrayResponse, DataResponse} from '../../core/service/CoreModel';
import {GenericContainer} from '../GenericContainer';
import {LocalConnection} from '../../core/client/Connection';


export class FileExchange extends GenericContainer implements AbstractFileExchange {
    static CONTAINER_PREFIX = 'file-exchange';
    static DOWNLOAD = '/download';
    static UPLOAD = '/upload';
    static TYPE_CREATE = '/create-type';
    static TYPE_DIRS_CREATE = '/create-type-dirs';
    static TYPE_UPDATE = '/update-type';
    static TYPES_LIST = '/list-types';
    static TYPE_LIST = '/list-type';
    static TYPE_CONTENT_LIST = '/list-type-content';
    static TYPE_DELETE = '/delete-type';
    static TYPE_EXISTS = '/exists-type';
    static FILE_EXISTS = '/exists-file';
    static FILE_MOVE = '/move-file';
    static FILE_COPY = '/copy-file';
    static FILE_RENAME = '/rename-file';
    static MODAL_SHOW = '/show-modal';
    static ACCESS_MODE = '/access-mode';
    static CONTAINERS_ENABLED = '/enabled-containers';
    static DIR_CREATE = '/create-dir';
    static FILE_INFO = '/file-info';


    constructor(baseUrl: string, containerUrl: string, connection: LocalConnection) {
        super(baseUrl, containerUrl, connection, FileExchange.CONTAINER_PREFIX);
    }

    copyFile(entity: string, from_type: string, to_type: string, filename: string, new_filename: string, from_rel_path?: [string], to_rel_path?: [string], callback?: (error: T1CLibException, data: FileResponse) => void): Promise<FileResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.FILE_COPY), {entity, from_type, to_type, filename, new_filename, from_rel_path, to_rel_path}, undefined, undefined, callback);
    }

    createDir(entity: string, type: string, rel_path: [string], recursive?: boolean, callback?: (error: T1CLibException, data: FileResponse) => void): Promise<FileResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.DIR_CREATE), {entity, type, rel_path, recursive}, undefined, undefined, callback);
    }

    // TODO add headers for i18n and security
    createType(entity: string, type: string, initabspath?: [string], showModal?: boolean, timeoutInSeconds?: number, callback?: (error: T1CLibException, data: TypeResponse) => void): Promise<TypeResponse> {
        const show_modal: boolean = (showModal == null) ? undefined : showModal;
        const timeout: number = (timeoutInSeconds == null) ? 30 : timeoutInSeconds;
        const init_tabs_path = (initabspath == null) ? undefined : initabspath;
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.TYPE_CREATE), {entity, type, show_modal, timeout, init_tabs_path}, undefined, undefined, callback);
    }

    createTypeDirs(entity: string, type: string, relpath: [string], showModal?: boolean, timeoutInSeconds?: number, callback?: (error: T1CLibException, data: FileListResponse) => void): Promise<FileListResponse> {
        const timeout: number = (timeoutInSeconds == null) ? 30 : timeoutInSeconds;
        const show_modal: boolean = (showModal == null) ? undefined : showModal;
        const rel_path = (relpath == null) ? undefined : relpath;
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.TYPE_DIRS_CREATE), {entity, type, show_modal, timeout, rel_path}, undefined, undefined, callback);
    }

    deleteType(entity: string, type: string, callback?: (error: T1CLibException, data: boolean) => void): Promise<boolean> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.TYPE_DELETE), {entity, type}, undefined, undefined, callback);
    }

    download(entity: string, type: string, file: Blob, filename: string, rel_path?: [string], implicit_creation_type?: boolean, notify_on_completion?: boolean,
             callback?: (error: T1CLibException, data: FileListResponse) => void): Promise<DataResponse> {
        let relPathInput;
        if (rel_path && rel_path.length > 0) {
            relPathInput = rel_path.join();
        } else {
            relPathInput = undefined;
        }
        return this.connection.postFile(this.baseUrl, this.containerSuffix(FileExchange.DOWNLOAD), {entity, type, file, filename, relPathInput, implicit_creation_type, notify_on_completion}, undefined, callback);
    }

    existsFile(entity: string, type: string, rel_path: [string], callback?: (error: T1CLibException, data: BoolDataResponse) => void): Promise<BoolDataResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.FILE_EXISTS), {entity, type, rel_path}, undefined, undefined, callback);
    }

    existsType(entity: string, type: string, callback?: (error: T1CLibException, data: BoolDataResponse) => void): Promise<BoolDataResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.TYPE_EXISTS), {entity, type}, undefined, undefined, callback);
    }

    getAccessMode(entity: string, type: string, relpath?: [string], callback?: (error: T1CLibException, data: DataResponse) => void): Promise<DataResponse> {
        const rel_path = (relpath == null) ? undefined : relpath;
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.ACCESS_MODE), {entity, type, rel_path}, undefined, undefined, callback);
    }

    getEnabledContainers(callback?: (error: T1CLibException, data: DataArrayResponse) => void): Promise<DataArrayResponse> {
        return this.connection.get(this.baseUrl, this.containerSuffix(FileExchange.CONTAINERS_ENABLED), [], undefined, callback);
    }

    getFileInfo(entity: string, type: string, filename: string, rel_path?: [string], callback?: (error: T1CLibException, data: FileResponse) => void): Promise<FileResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.FILE_INFO), {entity, type, filename, rel_path}, undefined, undefined, callback);
    }

    listContent(entity: string, page?: Page, callback?: (error: T1CLibException, data: FileListResponse) => void): Promise<FileListResponse> {
        return undefined;
    }

    listType(entity: string, type: string, callback?: (error: T1CLibException, data: TypeResponse) => void): Promise<TypeResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.TYPE_LIST), {entity, type}, undefined, undefined, callback);
    }

    listTypeContent(entity: string, type: string, rel_path?: [string], page?: Page, callback?: (error: T1CLibException, data: FileListResponse) => void): Promise<FileListResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.TYPE_CONTENT_LIST), {entity, type, rel_path, page}, undefined, undefined, callback);
    }

    listTypes(entity: string, page?: Page, callback?: (error: T1CLibException, data: TypeListResponse) => void): Promise<TypeListResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.TYPES_LIST), {entity, page}, undefined, undefined, callback);
    }

    moveFile(entity: string, from_type: string, to_type: string, filename: string, from_rel_path?: [string], to_rel_path?: [string], callback?: (error: T1CLibException, data: FileResponse) => void): Promise<FileResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.FILE_MOVE), {entity, from_type, to_type, filename, from_rel_path, to_rel_path}, undefined, undefined, callback);
    }

    renameFile(entity: string, type: string, filename: string, new_filename: string, rel_path?: [string], callback?: (error: T1CLibException, data: FileResponse) => void): Promise<FileResponse> {
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.FILE_RENAME), {entity, type, filename, new_filename, rel_path}, undefined, undefined, callback);
    }

    showModal(title: string, text: string, modal: ModalType, timeoutInSeconds?: number, callback?: (error: T1CLibException, data: FileListResponse) => void): Promise<boolean> {
        const timeout: number = (timeoutInSeconds == null) ? 30 : timeoutInSeconds;
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.MODAL_SHOW), {title, text, modal, timeout}, undefined, undefined, callback);
    }

    updateType(entity: string, type: string, timeoutInSeconds?: number, callback?: (error: T1CLibException, data: TypeResponse) => void): Promise<TypeResponse> {
        const timeout: number = (timeoutInSeconds == null) ? 30 : timeoutInSeconds;
        return this.connection.post(this.baseUrl, this.containerSuffix(FileExchange.TYPE_UPDATE), {entity, type, timeout}, undefined, undefined, callback);
    }

    upload(entity: string, type: string, filename: string, rel_path?: [string], notify_on_completion?: boolean, callback?: (error: T1CLibException, data: FileListResponse) => void): Promise<ArrayBuffer> {
        return this.connection.requestFile(this.baseUrl, this.containerSuffix(FileExchange.UPLOAD), {entity, type, filename, rel_path, notify_on_completion}, callback);
    }
}
