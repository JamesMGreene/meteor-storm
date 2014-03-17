var storm = require('./storm'),
    util = require('util'),
    ptorRunner = require('protractor/lib/runner');

/*
 * Runner is responsible for starting the execution of a test run and triggering
 * setup, teardown, managing config, etc through its various dependencies.
 *
 * @param {Object} config
 * @constructor
 */
var Runner = function(config) {
  // Enforce instance creation
  if (!(this instanceof Runner)) {
    return new Runner(config);
  }
  // Mixin the results of Protractor's `Runner` constructor
  Runner.super_.call(this, config);
};
// Inherit from Protractor's `Runner` class
util.inherits(Runner, ptorRunner);



/**
 * Sets up convenience globals for test specs
 * @private   
 */
Runner.prototype.setupGlobals_ = function(driver) {
  var browser = storm.wrapDriver(
      driver,
      this.config_.baseUrl,
      this.config_.rootElement);

  browser.params = this.config_.params;
  browser.screenshotBaseDir = this.config_.screenshotBaseDir;
  storm.setInstance(browser);

  // Export storm to the global namespace to be used in tests.
  global.storm = storm;
  global.browser = browser;
  global.$ = browser.$;
  global.$$ = browser.$$;
  global.element = browser.element;
  global.by = global.By = storm.By;
};

/**
 * Creates and returns a Runner instance
 *
 * @public
 * @param {Object} config
 */
module.exports = Runner;
