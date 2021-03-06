var Montage = require("montage").Montage,
    Promise = require("montage/core/promise").Promise;


// FIXME: demo purpose
// Need help from the middleware.
var WIDGETS = [
    {
        title: "Alerts",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/alerts.reel",
        allowMultiple: false
    },
    {
        title: "Arc Demand Data",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/arc-demand-data.reel",
        allowMultiple: false
    },
    {
        title: "CPU Usage",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/cpu-usage.reel",
        allowMultiple: false
    },
    {
        title: "Load Average",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/load-average.reel",
        allowMultiple: false
    },
    {
        title: "Memory Allocation",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/memory-allocation.reel",
        allowMultiple: false
    },
    {
        title: "Network Traffic",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/network-traffic.reel",
        allowMultiple: true
    },
    {
        title: "System Info",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/system-info.reel",
        allowMultiple: false
    },
    {
        title: "Tasks",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/tasks.reel",
        allowMultiple: false
    },
    {
        title: "Disk I/O",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/disk-traffic.reel",
        allowMultiple: false
    },
    {
        title: "CPU temperature",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/cpu-temperature.reel",
        allowMultiple: false
    },
    {
        title: "Disk Temperature",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/disk-temperature.reel",
        allowMultiple: false
    },
    {
        title: "Composite Temperature",
        description: null,
        imgPreview: null,
        moduleId: "ui/widgets/composite-temperature.reel",
        allowMultiple: false
    }
];


exports.WidgetService = Montage.specialize({

    _widgetsMap: {
        value: null
    },

    getAvailableWidgets: {
        value: function () {
            var promise;

            if (this._widgetsMap) {
                promise = Promise.resolve(this._widgetsMap);
            } else if (this._getAvailableWidgetsPromise) {
                promise = this._getAvailableWidgetsPromise;
            } else {
                var self = this;

                promise = this._getAvailableWidgetsPromise = new Promise(function (resolve, reject) {
                    //todo: connection with the middleware.
                    var widgets = WIDGETS,
                        widgetsMap = new Map(),
                        widget;

                    for (var i = 0, length = widgets.length; i < length; i++) {
                        widget = widgets[i];

                        widgetsMap.set(widget.moduleId, widget);
                    }

                    self._widgetsMap = widgetsMap;

                    resolve(widgetsMap);
                });
            }

            return promise;
        }
    }

}, {

    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new this();
            }

            return this._instance;
        }
    }

});
