 /**
 * @module ui/topology.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    VolumeCreator = require("ui/sections/storage/inspectors/volume-creator.reel").VolumeCreator,
    Promise = require("montage/core/promise").Promise,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Model = require("core/model/model").Model,
    _ = require("lodash");

/**
 * @class Topology
 * @extends Component
 */
var Topology = exports.Topology = AbstractInspector.specialize(/** @lends Topology# */ {
    topologySelectedDisk: {
        value: null
    },

    availableSelectedDisk: {
        value: null
    },

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
                this._topologyProxy = null;
                this._populateTopologyProxyWithTopology(object);
            }
        },
        get: function () {
            return this._object;
        }
    },

    _topologyProxy: {
        value: null
    },

    topologyProxy: {
        get: function () {
            if (!this._topologyProxy) {
                var self = this;

                this._topologyProxy = Promise.all([
                    Model.populateObjectPrototypeForType(Model.ZfsTopology),
                    Model.populateObjectPrototypeForType(Model.ZfsVdev)
                ]).then(function () {
                    return self._getNewTopologyProxy();
                }).then(function(topologyProxy) {
                    self._topologyProxy = topologyProxy;
                });
            }

            return this._topologyProxy;
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.availableDisks = this._sectionService.listAvailableDisks();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (isFirstTime) {
                this.addPathChangeListener("topologySelectedDisk", this, "_handleSelectedDiskChange");
                this.addPathChangeListener("availableSelectedDisk", this, "_handleSelectedDiskChange");
            }

            this._parentCascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this);
            if (this._parentCascadingListItem) {
                this._parentCascadingListItem.classList.add("CascadingListItem-Topology");
            }
        }
    },

    _parentCascadingListItem: {
        value: null
    },

    exitDocument: {
        value: function() {
            this.super();
            this._clearDisk();
            this._freeTopologyProxy();

            if (this._parentCascadingListItem) {
                this._parentCascadingListItem.classList.remove("CascadingListItem-Topology");
            }

            this._object = null;
        }
    },

    _handleSelectedDiskChange: {
        value: function(value) {
            if (this.topologySelectedDisk && this.topologySelectedDisk === value) {
                this.selectedObject = this.topologySelectedDisk._disk;
                this.availableSelectedDisk = null;
            } else if (this.availableSelectedDisk && this.availableSelectedDisk === value) {
                this.selectedObject = this.availableSelectedDisk;
                this.topologySelectedDisk = null;
            } else if (!this.topologySelectedDisk && !this.availableSelectedDisk) {
                this.selectedObject = null;
            }
        }
    },

    _handleAvailableSelectedDiskChange: {
        value: function() {
            if (this.availableSelectedDisk && this.availableSelectedDisk.length == 1) {
                if (this.topologySelectedDisk) {
                    this.topologySelectedDisk.splice(0, this.topologySelectedDisk.length);
                }
                this.selectedObject = this.availableSelectedDisk[0];
            }
        }
    },

    _handleTopologySelectedDiskChange: {
        value: function() {
            if (this.topologySelectedDisk && this.topologySelectedDisk.length == 1) {
                if (this.availableSelectedDisk) {
                    this.availableSelectedDisk.splice(0, this.availableSelectedDisk.length);
                }
                this.selectedObject = this.topologySelectedDisk[0]._disk;
            }
        }
    },

    _freeTopologyProxy: {
        value: function () {
            if (this._topologyProxy) {
                this._sectionService.clearTopology(this._topologyProxy);
            }
        }
    },

    _populateTopologyProxyWithTopology: {
        value: function (topology) {
            if (this.topologyProxy && topology) {
                if (Promise.is(this.topologyProxy)) {
                    var self = this;

                    this.topologyProxy.then(function () {
                        self.__populateTopologyProxyWithTopology(topology);
                    });
                } else {
                    this.__populateTopologyProxyWithTopology(topology);
                }
            }
        }
    },

    __populateTopologyProxyWithTopology: {
        value: function (topology) {
            this._mapTopologyToTopologyProxy(topology, this._topologyProxy);
            this.dispatchOwnPropertyChange("topologyProxy", this._topologyProxy);
        }
    },

    _mapTopologyToTopologyProxy: {
        value: function (topology, topologyProxy) {
            var topologyKeys = this._sectionService.TOPOLOGY_KEYS;

            for (var i = 0, l = topologyKeys.length; i < l; i++) {
                this._addVDevsToTopologyProxyVDevs(topology[topologyKeys[i]], topologyProxy[topologyKeys[i]]);
            }
        }
    },

    _getNewTopologyProxy: {
        value: function () {
            return this._sectionService.getNewTopology();
        }
    },

    _addVDevsToTopologyProxyVDevs: {
        value: function (vDevs, targetProxyVDevs) {
            var proxyVDev, proxyVDevDisk, vDev, vDevChildren, i, ii , l, ll;

            for (i = 0, l = vDevs.length; i < l; i++) {
                proxyVDev = this._mapVDevToProxyVDev((vDev = vDevs[i]));
                proxyVDev.children = [];
                vDevChildren = vDev.children;
                proxyVDev.isExistingVDev = true;

                if (!vDevChildren || vDevChildren.length === 0) {
                    this._sectionService.markDiskAsReserved(vDev);
                    proxyVDev.children.push(vDev);
                } else {
                    for (ii = 0, ll = vDevChildren.length; ii < ll; ii++) {
                        proxyVDevDisk = this._mapVDevToProxyVDev(vDevChildren[ii]);
                        proxyVDev.children.push(proxyVDevDisk);
                    }
                }

                targetProxyVDevs.push(proxyVDev);
            }
        }
    },

    _mapVDevToProxyVDev: {
        value: function (vDev) {
            return _.cloneWith(vDev, function(value, key) {
                if (key !== 'children') {
                    return value;
                }
            });
        }
    },

    revert: {
        value: function () {
            this._sectionService.clearReservedDisks();
            this._sectionService.clearTemporaryAvailableDisks();
            this._freeTopologyProxy();
            this._populateTopologyProxyWithTopology(this.object);
        }
    },

    _clearDisk: {
        value: function () {
            var disks = this.availableDisks,
                disk;

            if (disks) {
                for (var i = 0, length = disks.length; i < length; i++) {
                    disk = disks[i];

                    if (disk.volume === '/TEMP/') {
                        disk.volume = null;
                    }
                }
            }
        }
    },

    save: {
        value: function () {
            var previousContextCascadingList = CascadingList.findPreviousContextWithComponent(this);

            if (previousContextCascadingList) {
                var volume = previousContextCascadingList.object;

                this.isLocked = true;
                return this._sectionService.updateVolumeTopology(volume, this.topologyProxy);
            }
        }
    }
});


Topology.prototype._cleanupVdevs = VolumeCreator.prototype._cleanupVdevs;
