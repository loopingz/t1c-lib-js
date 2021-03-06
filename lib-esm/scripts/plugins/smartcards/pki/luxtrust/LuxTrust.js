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
import { GenericCertCard } from '../../Card';
import { RequestHandler } from '../../../../util/RequestHandler';
var LuxTrust = (function (_super) {
    __extends(LuxTrust, _super);
    function LuxTrust(baseUrl, containerUrl, connection, reader_id) {
        return _super.call(this, baseUrl, containerUrl, connection, reader_id, LuxTrust.CONTAINER_PREFIX) || this;
    }
    LuxTrust.prototype.activated = function (callback) {
        return this.connection.get(this.baseUrl, this.containerSuffix(LuxTrust.ACTIVATED), undefined, undefined, callback);
    };
    LuxTrust.prototype.rootCertificate = function (options, callback) {
        return this.getCertificate(LuxTrust.CERT_ROOT, RequestHandler.determineOptions(options, callback));
    };
    LuxTrust.prototype.authenticationCertificate = function (options, callback) {
        return this.getCertificate(LuxTrust.CERT_AUTHENTICATION, RequestHandler.determineOptions(options, callback));
    };
    LuxTrust.prototype.signingCertificate = function (options, callback) {
        return this.getCertificate(LuxTrust.CERT_SIGNING, RequestHandler.determineOptions(options, callback));
    };
    LuxTrust.CONTAINER_PREFIX = 'luxtrust';
    LuxTrust.ACTIVATED = '/activated';
    return LuxTrust;
}(GenericCertCard));
export { LuxTrust };
//# sourceMappingURL=LuxTrust.js.map