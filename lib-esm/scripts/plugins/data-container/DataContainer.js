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
import { GenericContainer } from '../GenericContainer';
var DataContainer = (function (_super) {
    __extends(DataContainer, _super);
    function DataContainer(baseUrl, containerUrl, connection) {
        return _super.call(this, baseUrl, containerUrl, connection, containerUrl) || this;
    }
    DataContainer.prototype.create = function (data, callback) {
        return this.connection.put(this.baseUrl, this.containerSuffix(), data, undefined, undefined, callback);
    };
    DataContainer.prototype.read = function (id, callback) {
        return this.connection.get(this.baseUrl, this.containerSuffix(id), undefined, undefined, callback);
    };
    DataContainer.prototype.update = function (id, data, callback) {
        return this.connection.post(this.baseUrl, this.containerSuffix(), data, undefined, undefined, callback);
    };
    DataContainer.prototype.delete = function (id, callback) {
        return this.connection.delete(this.baseUrl, this.containerSuffix(id), undefined, undefined, callback);
    };
    return DataContainer;
}(GenericContainer));
export { DataContainer };
//# sourceMappingURL=DataContainer.js.map