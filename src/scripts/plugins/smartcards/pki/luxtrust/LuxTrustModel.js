"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var CoreModel_1 = require("../../../../core/service/CoreModel");
var LuxtrustAllCertsResponse = /** @class */ (function (_super) {
    __extends(LuxtrustAllCertsResponse, _super);
    function LuxtrustAllCertsResponse(data, success) {
        var _this = _super.call(this, data, success) || this;
        _this.data = data;
        _this.success = success;
        return _this;
    }
    return LuxtrustAllCertsResponse;
}(CoreModel_1.DataObjectResponse));
exports.LuxtrustAllCertsResponse = LuxtrustAllCertsResponse;
var LuxtrustAllCerts = /** @class */ (function () {
    function LuxtrustAllCerts(authentication_certificate, non_repudiation_certificate, root_certificate) {
        this.authentication_certificate = authentication_certificate;
        this.non_repudiation_certificate = non_repudiation_certificate;
        this.root_certificate = root_certificate;
    }
    return LuxtrustAllCerts;
}());
exports.LuxtrustAllCerts = LuxtrustAllCerts;
var LuxtrustAllDataResponse = /** @class */ (function (_super) {
    __extends(LuxtrustAllDataResponse, _super);
    function LuxtrustAllDataResponse(data, success) {
        var _this = _super.call(this, data, success) || this;
        _this.data = data;
        _this.success = success;
        return _this;
    }
    return LuxtrustAllDataResponse;
}(LuxtrustAllCertsResponse));
exports.LuxtrustAllDataResponse = LuxtrustAllDataResponse;
