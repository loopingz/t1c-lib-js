/**
 * @author Maarten Somers
 * @since 2017
 */

import * as CoreExceptions from "../exceptions/CoreExceptions";

export { AbstractCore, T1CResponse, DataResponse, DataArrayResponse, DataObjectResponse, InfoResponse, BrowserInfoResponse,
    Card, CardReader, CardReadersResponse, SingleReaderResponse, PluginsResponse, PubKeyResponse };


interface AbstractCore {
    // async
    activate(callback?: (error: CoreExceptions.RestException, data: T1CResponse) => void): void | Promise<T1CResponse>;
    getPubKey(callback?: (error: CoreExceptions.RestException, data: PubKeyResponse) => void): void | Promise<PubKeyResponse>;
    info(callback?: (error: CoreExceptions.RestException, data: InfoResponse) => void): void | Promise<InfoResponse>;
    infoBrowser(callback?: (error: CoreExceptions.RestException, data: BrowserInfoResponse) => void): void | Promise<BrowserInfoResponse>;
    plugins(callback?: (error: CoreExceptions.RestException, data: PluginsResponse) => void): void | Promise<PluginsResponse>;
    pollCardInserted(secondsToPollCard?: number,
                     callback?: (error: CoreExceptions.RestException, data: CardReader) => void,
                     connectReader?: () => void,
                     insertCard?: () => void,
                     cardTimeout?: () => void

    ): void | Promise<CardReader>;
    pollReadersWithCards(secondsToPollCard?: number,
                         callback?: (error: CoreExceptions.RestException, data: CardReadersResponse) => void,
                         connectReader?: () => void,
                         insertCard?: () => void,
                         cardTimeout?: () => void

    ): void | Promise<CardReadersResponse>;
    pollReaders(secondsToPollReader?: number,
                callback?: (error: CoreExceptions.RestException, data: CardReadersResponse) => void,
                connectReader?: () => void,
                readerTimeout?: () => void
    ): void | Promise<CardReadersResponse>;
    reader(reader_id: string,
           callback?: (error: CoreExceptions.RestException, data: SingleReaderResponse) => void): void | Promise<SingleReaderResponse>;
    readers(callback?: (error: CoreExceptions.RestException, data: CardReadersResponse) => void): void | Promise<CardReadersResponse>;
    readersCardAvailable(callback?: (error: CoreExceptions.RestException, data: CardReadersResponse)
        => void): void | Promise<CardReadersResponse>;
    readersCardsUnavailable(callback?: (error: CoreExceptions.RestException, data: CardReadersResponse)
        => void): void | Promise<CardReadersResponse>;
    setPubKey(pubkey: string,
              callback?: (error: CoreExceptions.RestException, data: PubKeyResponse) => void): void | Promise<PubKeyResponse>;

    // sync
    getUrl(): string;
    infoBrowserSync(): BrowserInfoResponse;

    // t1c-lib-info
    version(): string;
}

interface T1CResponse {
    data?: {}
    success: boolean
}

interface DataResponse extends T1CResponse {
    data: string
}

interface DataArrayResponse extends T1CResponse {
    data: string[]
}


interface DataObjectResponse extends T1CResponse {
    data: {
        [key: string]: any
    }
}

interface InfoResponse extends T1CResponse {
    data: {
        activated: boolean
        managed: boolean
        arch: string
        os: string
        uid: string
        version: string
    }
}

interface BrowserInfoResponse extends T1CResponse {
    data: {
        manufacturer: string
        browser: {
            name: string
            version: string
        }
        os: {
            name: string
            version: string
            architecture: number
        }
        ua: string
    }
}

interface Card {
    atr: string,
    description: string[]
}

interface CardReader {
    card?: Card
    id: string
    name: string
    pinpad: boolean
}

interface CardReadersResponse extends T1CResponse {
    data: CardReader[]
}

interface SingleReaderResponse extends T1CResponse {
    data: CardReader
}

interface PluginsResponse extends T1CResponse {
    data: [{
        id: string
        name: string
        version: string
    }]
}

interface PubKeyResponse extends T1CResponse {
    data: string
}
