"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EMV_1 = require("./smartcards/emv/EMV");
var EidBe_1 = require("./smartcards/eid/be/EidBe");
var EidLux_1 = require("./smartcards/eid/lux/EidLux");
var mobib_1 = require("./smartcards/mobib/mobib");
var LuxTrust_1 = require("./smartcards/pki/luxtrust/LuxTrust");
var ocra_1 = require("./smartcards/ocra/ocra");
var Aventra_1 = require("./smartcards/pki/aventra/Aventra");
var Idemia_Ias_Ecc_1 = require("./smartcards/pki/idemia_ias_ecc/Idemia_Ias_Ecc");
var piv_1 = require("./smartcards/piv/piv");
var dnie_1 = require("./smartcards/eid/esp/dnie");
var EidPt_1 = require("./smartcards/eid/pt/EidPt");
var RemoteLoading_1 = require("./remote-loading/RemoteLoading");
var Belfius_1 = require("./remote-loading/belfius/Belfius");
var FileExchange_1 = require("./file/FileExchange");
var pkcs11_1 = require("./smartcards/pkcs11/pkcs11");
var DataContainer_1 = require("./data-container/DataContainer");
var JavaKeyTool_1 = require("./java-key-tool/JavaKeyTool");
var Ssh_1 = require("./ssh/Ssh");
var Wacom_1 = require("./wacom/Wacom");
var BeLawyer_1 = require("./smartcards/pki/BeLawyer/BeLawyer");
var RawPrint_1 = require("./raw-print/RawPrint");
var Isabel_1 = require("./smartcards/isabel/Isabel");
var CONTAINER_NEW_CONTEXT_PATH = '/containers/';
var CONTAINER_BEID = CONTAINER_NEW_CONTEXT_PATH + 'beid';
var CONTAINER_BELAWYER = CONTAINER_NEW_CONTEXT_PATH + 'diplad';
var CONTAINER_LUXEID = CONTAINER_NEW_CONTEXT_PATH + 'luxeid';
var CONTAINER_DNIE = CONTAINER_NEW_CONTEXT_PATH + 'dnie';
var CONTAINER_EMV = CONTAINER_NEW_CONTEXT_PATH + 'emv';
var CONTAINER_WACOM = CONTAINER_NEW_CONTEXT_PATH + 'wacom-stu';
var CONTAINER_ISABEL = CONTAINER_NEW_CONTEXT_PATH + 'isabel';
var CONTAINER_FILE_EXCHANGE = CONTAINER_NEW_CONTEXT_PATH + 'file-exchange';
var CONTAINER_LUXTRUST = CONTAINER_NEW_CONTEXT_PATH + 'luxtrust';
var CONTAINER_MOBIB = CONTAINER_NEW_CONTEXT_PATH + 'mobib';
var CONTAINER_OCRA = CONTAINER_NEW_CONTEXT_PATH + 'ocra';
var CONTAINER_AVENTRA = CONTAINER_NEW_CONTEXT_PATH + 'aventra';
var CONTAINER_IDEMIA_IAS_ECC = CONTAINER_NEW_CONTEXT_PATH + 'idemia_ias_ecc';
var CONTAINER_PIV = CONTAINER_NEW_CONTEXT_PATH + 'piv';
var CONTAINER_PTEID = CONTAINER_NEW_CONTEXT_PATH + 'pteid';
var CONTAINER_PKCS11 = CONTAINER_NEW_CONTEXT_PATH + 'pkcs11';
var CONTAINER_REMOTE_LOADING = CONTAINER_NEW_CONTEXT_PATH + 'readerapi';
var CONTAINER_JAVA_KEY_TOOL = CONTAINER_NEW_CONTEXT_PATH + 'java-keytool';
var CONTAINER_SSH = CONTAINER_NEW_CONTEXT_PATH + 'ssh';
var CONTAINER_RAW_PRINT = CONTAINER_NEW_CONTEXT_PATH + 'rawprint';
var PluginFactory = (function () {
    function PluginFactory(url, connection) {
        this.url = url;
        this.connection = connection;
    }
    PluginFactory.prototype.createDNIe = function (reader_id) {
        return new dnie_1.DNIe(this.url, CONTAINER_DNIE, this.connection, reader_id);
    };
    PluginFactory.prototype.createEidBE = function (reader_id) {
        return new EidBe_1.EidBe(this.url, CONTAINER_BEID, this.connection, reader_id);
    };
    PluginFactory.prototype.createBeLawyer = function (reader_id) {
        return new BeLawyer_1.BeLawyer(this.url, CONTAINER_BELAWYER, this.connection, reader_id);
    };
    PluginFactory.prototype.createEidLUX = function (reader_id, pin, pinType, isEncrypted) {
        if (isEncrypted === void 0) { isEncrypted = false; }
        return new EidLux_1.EidLux(this.url, CONTAINER_LUXEID, this.connection, reader_id, pin, pinType, isEncrypted);
    };
    PluginFactory.prototype.createEidPT = function (reader_id) {
        return new EidPt_1.EidPt(this.url, CONTAINER_PTEID, this.connection, reader_id);
    };
    PluginFactory.prototype.createEmv = function (reader_id) {
        return new EMV_1.EMV(this.url, CONTAINER_EMV, this.connection, reader_id);
    };
    PluginFactory.prototype.createWacom = function () {
        return new Wacom_1.Wacom(this.url, CONTAINER_WACOM, this.connection, 'wacom-stu');
    };
    PluginFactory.prototype.createIsabel = function (reader_id, runInUserSpace) {
        return new Isabel_1.Isabel(this.url, CONTAINER_ISABEL, this.connection, reader_id, runInUserSpace);
    };
    PluginFactory.prototype.createLuxTrust = function (reader_id) {
        return new LuxTrust_1.LuxTrust(this.url, CONTAINER_LUXTRUST, this.connection, reader_id);
    };
    PluginFactory.prototype.createMobib = function (reader_id) {
        return new mobib_1.Mobib(this.url, CONTAINER_MOBIB, this.connection, reader_id);
    };
    PluginFactory.prototype.createOcra = function (reader_id) {
        return new ocra_1.Ocra(this.url, CONTAINER_OCRA, this.connection, reader_id);
    };
    PluginFactory.prototype.createAventraNO = function (reader_id) {
        return new Aventra_1.Aventra(this.url, CONTAINER_AVENTRA, this.connection, reader_id);
    };
    PluginFactory.prototype.createIdemia_Ias_EccNO = function (reader_id) {
        return new Idemia_Ias_Ecc_1.Idemia_Ias_Ecc(this.url, CONTAINER_IDEMIA_IAS_ECC, this.connection, reader_id);
    };
    PluginFactory.prototype.createPIV = function (reader_id) {
        return new piv_1.PIV(this.url, CONTAINER_PIV, this.connection, reader_id);
    };
    PluginFactory.prototype.createPKCS11 = function () {
        return new pkcs11_1.PKCS11(this.url, CONTAINER_PKCS11, this.connection);
    };
    PluginFactory.prototype.createRemoteLoading = function (reader_id) {
        return new RemoteLoading_1.RemoteLoading(this.url, CONTAINER_REMOTE_LOADING, this.connection, reader_id);
    };
    PluginFactory.prototype.createBelfius = function (reader_id) {
        return new Belfius_1.Belfius(this.url, CONTAINER_REMOTE_LOADING, this.connection, reader_id);
    };
    PluginFactory.prototype.createFileExchange = function () {
        return new FileExchange_1.FileExchange(this.url, CONTAINER_FILE_EXCHANGE, this.connection);
    };
    PluginFactory.prototype.createDataContainer = function (containerPath) {
        var _this = this;
        return function () {
            return new DataContainer_1.DataContainer(_this.url, containerPath, _this.connection);
        };
    };
    PluginFactory.prototype.createJavaKeyTool = function () {
        return new JavaKeyTool_1.JavaKeyTool(this.url, CONTAINER_JAVA_KEY_TOOL, this.connection);
    };
    PluginFactory.prototype.createSsh = function () {
        return new Ssh_1.Ssh(this.url, '', this.connection, 'ssh');
    };
    PluginFactory.prototype.createRawPrint = function (runInUserSpace) {
        return new RawPrint_1.RawPrint(this.url, CONTAINER_RAW_PRINT, this.connection, runInUserSpace);
    };
    return PluginFactory;
}());
exports.PluginFactory = PluginFactory;
//# sourceMappingURL=PluginFactory.js.map