'use strict';

module.exports = function(crompy) {

    // Main configuration
    crompy.initConfig({
        name: "ubuntu",
        path: {
            collectors: "collectors/"
        },
        handler: {
            type: "influxdb",
            config: {
                host : 'localhost',
                port : 8086,
                username : 'root',
                password : 'root',
                database : 'metrics'
            }
        },
        collectors: [
            "diskspace"
        ]
    });

    // Set collectors configuration
    crompy.setConfig('diskspace', {
        interval: 5000
    });

};
