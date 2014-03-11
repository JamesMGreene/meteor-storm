module.exports = {

  /**
  * @return Promise
  */
  loginWithPassword: function(user, password) {
    var driver = this && this.driver || browser && browser.driver;
    return driver.executeScriptAsync(function() {
      var callback = arguments[arguments.length - 1];
      Meteor.loginWithPassword(user, password, callback);
    });
  },

  /**
  * @return Promise 
  */
  logout: function() {
    var driver = this && this.driver || browser && browser.driver;
    return driver.executeScriptAsync(function() {
      var callback = arguments[arguments.length - 1];
      Meteor.logout(callback);
    });
  },

  /**
  * @return Promise
  */
  userId: function() {
    var driver = this && this.driver || browser && browser.driver;
    return driver.executeScript(function() {
      return Meteor.userId();
    });
  },

  /**
  * @return Promise
  */
  user: function() {
    var driver = this && this.driver || browser && browser.driver;
    return driver.executeScript(function() {
      return Meteor.user();
    });
  }

};