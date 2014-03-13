function getDriver() {
  return (this && this.driver) || (browser && browser.driver) || (storm && storm.getInstance() && storm.getInstance().driver) || null;
}


module.exports = {

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
    }, timeout, message).then(urlPersistFn);
  }
};