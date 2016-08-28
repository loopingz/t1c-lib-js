/**
 * @author Michallis Pashidis
 */
import {LocalConnection} from "../client/Connection";
import * as CoreExceptions from "../exceptions/CoreExceptions";

interface AbstractCore{
    // async
    info(callback:(error:CoreExceptions.RestException, data:any) => void):void;
    infoBrowser(callback:(error:CoreExceptions.RestException, data:any) => void):void;
    readers(callback:(error:CoreExceptions.RestException,data:any)=>void):void;
    pollReaders(secondsToPollReader:number,
                callback:(error:CoreExceptions.RestException,data:any)=>void,
                connectReader:()=>void,
                readerTimeout:()=>void
    ):void;
    pollCardInserted(secondsToPollCard:number,
                     callback:(error:CoreExceptions.RestException,data:any)=>void,
                     connectReader:()=>void,
                     insertCard:()=>void,
                     cardTimeout:()=>void

    ):void;
    readersCardAvailable(callback:(error:CoreExceptions.RestException,data:any)=>void):void;
    readersCardsUnavailable(callback:(error:CoreExceptions.RestException,data:any)=>void):void;
    reader(reader_id:string,callback:(error:CoreExceptions.RestException,data:any)=>void):void;
    plugins(callback:(error:CoreExceptions.RestException,data:any)=>void):void;
    activate(callback:(error:CoreExceptions.RestException, data:any) => void):void;

    // sync
    infoBrowserSync():any;
/*    verify(callback:(error:CoreExceptions.RestException, data:any) => void):void;
    download(callback:(error:CoreExceptions.RestException, data:any) => void):void;
    activate(apikey:string, callback:(error:CoreExceptions.RestException, data:any) => void):void;
    init(apikey:string, callback:(error:CoreExceptions.RestException, data:any) => void):void; //TODO complete verify/download/register/verificationpoll
    update(apikey:string, callback:(error:CoreExceptions.RestException, data:any) => void):void; //triggered by config
    detectCard(error, success, connectReader, readerConnected, readerTimeout, insertCard, cardInserted, cardTimeout);*/
}

const FILTER_CARD_INSERTED = "card-inserted=";
const CORE_INFO = "/";
const CORE_PLUGINS = "/plugins";
const CORE_READERS = "/card-readers";
const CORE_READER_ID = "/readers/{id}";
const CORE_ACTIVATE = "/admin/activate";

class CoreService implements AbstractCore{
    // constructor
    constructor(private url:string,private connection:LocalConnection) {}

    // async
    public info(callback:(error:CoreExceptions.RestException, data:any)=>void) {this.connection.get(this.url + CORE_INFO,callback);}
    public readers(callback:(error:CoreExceptions.RestException, data:any)=>void):void {this.connection.get(this.url + CORE_READERS,callback);}
    public readersCardAvailable(callback:(error:CoreExceptions.RestException, data:any)=>void):void {this.connection.get(this.url + CORE_READERS,callback,FILTER_CARD_INSERTED + 'true');}
    public readersCardsUnavailable(callback:(error:CoreExceptions.RestException, data:any)=>void):void {this.connection.get(this.url + CORE_READERS,callback,FILTER_CARD_INSERTED + 'false');}
    public reader(reader_id:string, callback:(error:CoreExceptions.RestException, data:any)=>void):void {this.connection.get(this.url + CORE_READERS + "/" + reader_id, callback);}
    public plugins(callback:(error:CoreExceptions.RestException, data:any)=>void):void {this.connection.get(this.url + CORE_PLUGINS,callback);}
    public activate(callback:(error:CoreExceptions.RestException, data:any)=>void) {this.connection.post(this.url + CORE_ACTIVATE,{},callback);}

    public infoBrowser(callback:(error:CoreExceptions.RestException, data:any)=>void):void{
        callback(null,this.platformInfo());
    }

    pollCardInserted(secondsToPollCard, callback, connectReaderCb, insertCardCb, cardTimeoutCb): void {
        //start polling if no card found
        let maxSeconds = secondsToPollCard;
        let self=this;
        console.debug("start poll cards");
        readerTimeout(callback, connectReaderCb, insertCardCb, cardTimeoutCb);
        function readerTimeout(cb,crcb,iccb,ctcb) {
            let selfTimeout = this;
            setTimeout(function () {
                console.debug("seconds left:",maxSeconds);
                --maxSeconds;
                self.readers(function(error, data){
                    if(error){
                        console.debug("Waiting...");
                        crcb(); //ask to connect reader
                        readerTimeout(cb,crcb,iccb,ctcb); //no reader found and waiting - recursive call
                    };
                    // no error but stop
                    if(maxSeconds==0){return ctcb();} //reader timeout
                    else if(data.data.length === 0) {
                        console.debug("Waiting...");
                        crcb(); //ask to connect reader
                        readerTimeout(cb,crcb,iccb,ctcb);
                    }
                    else {
                        console.debug("readerCount:",data.data.length);
                        //detect card on any reader
                        var reader = self.checkReadersForCardObject(data.data);
                        if(reader) {
                            var response:any = {}; response.data = reader; response.success=true;
                            return cb(null, response);
                        }else {
                            console.debug("Insert card");
                            iccb();
                            readerTimeout(cb,crcb,iccb,ctcb);
                        }
                    }
                });
            }, 1000);
        };
    }

    /**
     * Checks for card element in readers response
     * @param readers
     * @returns {any}
     */
    private checkReadersForCardObject(readers:any):any{
        if(readers && readers.length>0){
            for (var i in readers){
                if(readers[i].card)return readers[i];
            }
        } else return null;
    }

    public pollReaders(secondsToPollReader:number, callback, connectReaderCb, readerTimeoutCb):void {
        let maxSeconds = secondsToPollReader;
        let self=this;
        console.debug("start poll readers");
        readerTimeout(callback,readerTimeoutCb,connectReaderCb);
        function readerTimeout(cb,rtcb,crcb) {
            let selfTimeout = this;
            setTimeout(function () {
                console.debug("seconds left:",maxSeconds);
                --maxSeconds;
                self.readers(function(error, data){
                    if(error){
                        console.debug("Waiting...");
                        crcb(); //ask to connect reader
                        readerTimeout(cb,rtcb,crcb); //no reader found and waiting - recursive call
                    };
                    // no error but stop
                    if(maxSeconds==0){return rtcb();} //reader timeout
                    else if(data.data.length === 0) {
                        console.debug("Waiting...");
                        crcb(); //ask to connect reader
                        readerTimeout(cb,rtcb,crcb);
                    }
                    else {
                        console.debug("readerCount:",data.data.length);
                        return cb(null,data);
                    }
                });
            }, 1000);
        };
    }

    // sync
    public infoBrowserSync(){return this.platformInfo();}

    // private methods
    private platformInfo():any{
        return {
            manufacturer: platform.manufacturer || '',
            browser: {
                name: platform.name,
                version: platform.version
            },
            os: {
                name: platform.os.family,
                version: platform.os.version,
                architecture: platform.os.architecture
            },
            ua: platform.ua
        };
    }
}



export {AbstractCore,CoreService}