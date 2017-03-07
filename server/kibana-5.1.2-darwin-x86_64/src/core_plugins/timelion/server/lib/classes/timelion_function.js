'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');
var loadFunctions = require('../load_functions.js');
var fitFunctions = loadFunctions('fit_functions');

module.exports = function TimelionFunction(name, config) {
  _classCallCheck(this, TimelionFunction);

  this.name = name;
  this.args = config.args || [];
  this.argsByName = _.indexBy(this.args, 'name');
  this.help = config.help || '';
  this.aliases = config.aliases || [];
  this.extended = config.extended || false;

  // WTF is this? How could you not have a fn? Wtf would the thing be used for?
  var originalFunction = config.fn || function (input) {
    return input;
  };

  // Currently only re-fits the series.
  this.originalFn = originalFunction;

  this.fn = function (args, tlConfig) {
    var config = _.clone(tlConfig);
    return Promise.resolve(originalFunction(args, config)).then(function (seriesList) {
      seriesList.list = _.map(seriesList.list, function (series) {
        var target = tlConfig.getTargetSeries();

        // Don't fit if the series are already the same
        if (_.isEqual(_.map(series.data, 0), _.map(target, 0))) return series;

        var fit;
        if (args.byName.fit) {
          fit = args.byName.fit;
        } else if (series.fit) {
          fit = series.fit;
        } else {
          fit = 'nearest';
        }

        series.data = fitFunctions[fit](series.data, tlConfig.getTargetSeries());
        return series;
      });
      return seriesList;
    });
  };
};
