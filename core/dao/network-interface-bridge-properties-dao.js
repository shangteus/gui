"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var NetworkInterfaceBridgePropertiesDao = (function (_super) {
    __extends(NetworkInterfaceBridgePropertiesDao, _super);
    function NetworkInterfaceBridgePropertiesDao() {
        return _super.call(this, model_1.Model.NetworkInterfaceBridgeProperties) || this;
    }
    return NetworkInterfaceBridgePropertiesDao;
}(abstract_dao_1.AbstractDao));
exports.NetworkInterfaceBridgePropertiesDao = NetworkInterfaceBridgePropertiesDao;