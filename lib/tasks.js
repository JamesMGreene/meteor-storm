var fs = require('fs');
var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp').sync;
var Q = require('q');


function getStorm() {
  return (this && this.driver && this) ||
    (browser && browser.driver && browser) ||
    (storm && storm.getInstance() && storm.getInstance().driver && storm.getInstance()) ||
    null;
}

function getDriver() {
  var storm = getStorm.call(this);
  return (storm && storm.driver) || null;
}

function getConfigProperty(configName) {
  var storm = getStorm.call(this);
  return (storm && storm.hasOwnProperty(configName) && storm[configName]) || null;
}


var Tasks = module.exports = {

  /**
  * @return Promise
  */
  loginWithPassword: function(user, password) {
    var driver = getDriver.call(this);
    return driver.executeAsyncScript(function(user, password) {
      var callback = arguments[arguments.length - 1];
      Meteor.loginWithPassword(user, password, callback);
    }, user, password);
  },


  /**
  * @return Promise 
  */
  logout: function() {
    var driver = getDriver.call(this);
    return driver.executeAsyncScript(function() {
      var callback = arguments[arguments.length - 1];
      Meteor.logout(callback);
    });
  },


  /**
  * @return Promise
  */
  userId: function() {
    var driver = getDriver.call(this);
    return driver.executeScript(function() {
      return Meteor.userId();
    });
  },


  /**
  * @return Promise
  */
  user: function() {
    var driver = getDriver.call(this);
    return driver.executeScript(function() {
      return Meteor.user();
    });
  },


  /**
  * Wait until the current URL meets some condition.
  * @return Promise
  */
  waitForUrl: function(matcher, timeout, message) {
    var readyFn, urlPersistFn, currentUrl;
    if (typeof matcher === 'function') {
      readyFn = matcher;
    }
    else if (typeof matcher === 'string') {
      readyFn = function(url) {
        return url === matcher;
      };
    }
    else if (typeof matcher === 'object' && matcher && matcher instanceof RegExp) {
      readyFn = function(url) {
        return matcher.test(url);
      };
    }
    else {
      throw new TypeError('Invalid matcher');
    }

    urlPersistFn = function(url) {
      if (typeof url === 'string') {
        currentUrl = url;
      }
      return currentUrl;
    };

    var driver = getDriver.call(this);
    return driver.wait(function() {
      return driver.getCurrentUrl()
        .then(urlPersistFn)
        .then(readyFn);
    }, timeout, message)
    .then(urlPersistFn);
  },


  /**
  *
  * @return Promise
  */
  takeScreenshot: function(filename, timeout, message) {
    var driver = getDriver.call(this),
        ssBaseDir = getConfigProperty.call(this, 'screenshotBaseDir'),
        ssFullPath;
    if (ssBaseDir == null) {
      ssBaseDir = path.join(os.tmpdir ? os.tmpdir() : os.tmpDir(), 'screenshots');
    }
    if (typeof ssBaseDir === 'string' && ssBaseDir) {
      mkdirp(ssBaseDir);
    }
    filename = filename || 'shot.png';
    ssFullPath = path.join(ssBaseDir, filename);

    process.stderr.write('About to take a screenshot\n');

    return driver.wait(function() {
      return driver.takeScreenshot().then(function(pngBytes) {
        process.stderr.write('Took a screenshot, saving to: ' + ssFullPath + '\n');
        fs.writeFileSync(ssFullPath, pngBytes, 'base64');
        process.stderr.write('Saved screenshot to: ' + ssFullPath + '\n');
        return true;
      })
    }, timeout, message)
    .then(function() {
      return ssFullPath;
    });
  },


  /**
  *
  * @return Promise
  */
  waitForSelectorVisible: function(selector, timeout, message) {
    var driver = getDriver.call(this);
    var el;
    return driver.wait(function() {
      el = $(selector);
      return Q.all([
        el.isPresent(),
        el.isDisplayed()
      ]).spread(function(isPresent, isDisplayed) {
        return isPresent === true && isDisplayed === true;
      });
    }, timeout, message)
    .then(function() {
      return el;
    });
  }
};