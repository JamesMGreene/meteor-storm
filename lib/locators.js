var util = require('util');
var webdriver = require('selenium-webdriver');

var clientSideScripts = require('./clientsidescripts');

/**
 * The MeteorStorm Locators. These provide ways of finding elements in
 * Meteor applications by binding, model, etc.
 *
 * @augments webdriver.Locator.Strategy
 */
var MeteorStormBy = function() {};
var WebdriverBy = function() {};

/**
 * webdriver's By is an enum of locator functions, so we must set it to
 * a prototype before inheriting from it.
 */
WebdriverBy.prototype = webdriver.By;
util.inherits(MeteorStormBy, WebdriverBy);

/**
 * Add a locator to this instance of MeteorStormBy. This locator can then be
 * used with element(by.<name>(<args>)).
 *
 * @alias by.addLocator()
 * @param {string} name
 * @param {function|string} script A script to be run in the context of
 *     the browser. This script will be passed an array of arguments
 *     that contains any args passed into the locator followed by the
 *     element scoping the search. It should return an array of elements.
 */
MeteorStormBy.prototype.addLocator = function(name, script) {
  this[name] = function() {
    var locatorArguments = arguments;
    return {
      findElementsOverride: function(driver, using) {
        var findElementArguments = [script];
        for (var i = 0; i < locatorArguments.length; i++) {
          findElementArguments.push(locatorArguments[i]);
        }
        findElementArguments.push(using);

        return driver.findElements(
            webdriver.By.js.apply(webdriver.By, findElementArguments));
      },
      message: 'by.' + name + '("' + locatorArguments + '")'
    };
  };
};

// /**
//  * Find an element by binding.
//  *
//  * @alias by.binding()
//  * @view
//  * <span>{{person.name}}</span>
//  * <span ng-bind="person.email"></span>
//  *
//  * @example
//  * var span1 = element(by.binding('person.name'));
//  * expect(span1.getText()).toBe('Foo');
//  *
//  * var span2 = element(by.binding('person.email'));
//  * expect(span2.getText()).toBe('foo@bar.com');
//  *
//  * @param {string} bindingDescriptor
//  * @return {{findElementsOverride: findElementsOverride, message: string}}
//  */
// MeteorStormBy.prototype.binding = function(bindingDescriptor) {
//   return {
//     findElementsOverride: function(driver, using) {
//       return driver.findElements(
//           webdriver.By.js(clientSideScripts.findBindings,
//               bindingDescriptor, using));
//     },
//     message: 'by.binding("' + bindingDescriptor + '")'
//   };
// };

// /**
//  * Find an element by ng-model expression.
//  *
//  * @alias by.model()
//  * @view
//  * <input type="text" ng-model="person.name"/>
//  *
//  * @example
//  * var input = element(by.model('person.name'));
//  * input.sendKeys('123');
//  * expect(input.getAttribute('value')).toBe('Foo123');
//  *
//  * @param {string} model ng-model expression.
//  */
// MeteorStormBy.prototype.model = function(model) {
//   return {
//     findElementsOverride: function(driver, using) {
//       return driver.findElements(
//           webdriver.By.js(clientSideScripts.findByModel, model, using));
//     },
//     message: 'by.model("' + model + '")'
//   };
// };

// /**
//  * Find a button by text.
//  *
//  * @view
//  * <button>Save</button>
//  *
//  * @example
//  * element(by.buttonText('Save'));
//  *
//  * @param {string} searchText
//  * @returns {{findElementsOverride: findElementsOverride, message: string}}
//  */
// MeteorStormBy.prototype.buttonText = function(searchText) {
//   return {
//     findElementsOverride: function(driver, using) {
//       return driver.findElements(
//           webdriver.By.js(clientSideScripts.findByButtonText,
//           searchText, using));
//     },
//     message: 'by.buttonText("' + searchText + '")'
//   };
// };

// /**
//  * Find a button by partial text.
//  *
//  * @view
//  * <button>Save my file</button>
//  *
//  * @example
//  * element(by.partialButtonText('Save'));
//  *
//  * @param {string} searchText
//  * @returns {{findElementsOverride: findElementsOverride, message: string}}
//  */
// MeteorStormBy.prototype.partialButtonText = function(searchText) {
//   return {
//     findElementsOverride: function(driver, using) {
//       return driver.findElements(
//           webdriver.By.js(clientSideScripts.findByPartialButtonText,
//           searchText, using));
//     },
//     message: 'by.partialButtonText("' + searchText + '")'
//   };
// };

exports.MeteorStormBy = MeteorStormBy;
