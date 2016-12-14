var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName;

exports.VolumeImporter = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            return this._listDetachedVolumes();
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            this. availableDisksEventListener = this._eventDispatcherService.addEventListener(ModelEventName.Volume.contentChange, this._listDetachedVolumes.bind(this));
            this._sectionService.getEncryptedVolumeImporterInstance().then(function(encryptedVolumeImporter) {
               self.encryptedVolumeImporter = encryptedVolumeImporter;
            });
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.Volume.contentChange, this.availableDisksEventListener);
        }
    },

    handleRefreshAction: {
        value: function() {
            return this._listDetachedVolumes();
        }
    },

    _listDetachedVolumes: {
        value: function() {
            var self = this;
            return this._sectionService.listDetachedVolumes().then(function(detachedVolumes) {
                self.detachedVolumes = detachedVolumes;
            });
        }
    },

    handleRefreshMediaAction: {
        value: function() {
            return this._listImportableDisks();
        }
    },

    _listImportableDisks: {
        value: function() {
            var self = this;
            return this._sectionService.listImportableDisks().then(function(importableDisks) {
                self.importableDiskOptions = importableDisks.map(function(x) {
                    var label = x.label;
                    if (label === null) {
                        label = x.path.replace(/\/dev\//, '');
                    }
                    return { label: label, value: x.path };
                });
            });
        }
    },
    handleImportMediaAction: {
        value: function() {
            return this._sectionService.importDisk(this.importDisk, this.importPath, this.importFsType);
        }
    }
});
