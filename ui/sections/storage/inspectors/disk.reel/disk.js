var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    DiskAcousticlevel = require("core/model/enumerations/disk-acousticlevel").DiskAcousticlevel;

/**
 * @class Disk
 * @extends Component
 */
exports.Disk = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this.acousticLevelOptions = DiskAcousticlevel.members.map(function(x) {
                return {
                    label: x,
                    value: x
                };
            });
        }
    },

    enterDocument: {
        value: function() {
            this.object._allocation = this._sectionService.getDiskAllocation(this.object);
        }
    },

    handleEraseAction: {
        value: function() {
            return this._sectionService.eraseDisk(this.object.id);
        }
    }
});
