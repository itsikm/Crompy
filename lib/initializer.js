'use strict';

var Initializer = function() {

    var initCrmopy  = require(require('path').resolve('Crompyfile.js')),
        config      = {},
        collectors  = {};

    /**
     * Initialize config
     * * *
     * @param initConfig
     */
    this.initConfig = function(initConfig) {
        // TODO: Crompyfile.js validation
        config = initConfig;
    };

    /**
     * Set collector configuration
     * * *
     * @param collector
     * @param config
     */
    this.setConfig = function(collector, config) {
        collectors[collector] = config;
    };

    /**
     * Return main configuration or collector configuration
     * * *
     * @param collector
     * @returns {*}
     */
    this.getConfig = function(collector) {
        if(collector) {
            return collectors.hasOwnProperty(collector) ? collectors[collector] : {};
        }
        return config;
    };

    /**
     * Run Crompyfile.js configuration
     */
    // TODO: Check if Crompyfile.js exists
    initCrmopy(this);

};


module.exports = new Initializer;
