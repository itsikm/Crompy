'use strict';

var _ = require('lodash');

/**
 * Metric
 * * *
 * @param {string} path - full path of the metric
 * @param {float|int} value
 * @param {object} options
 * @constructor
 */
var Metric = function(path, value, options) {

    /**
     * Define default options with new options
     */
    options = _.merge({
        path: path,
        value: value,
        raw_value: null,
        timestamp: new Date().getTime(),
        precision: 0,
        host: null,
        metric_type: "COUNTER",
        ttl: null
    }, options);

    //console.log('Metric options:', options);

    this.path = options.path;

    this.points = function() {
        return {
            "value": options.value
        };
    }

};

module.exports = Metric;
