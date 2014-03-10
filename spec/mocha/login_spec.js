//
// IMPORTANT: Some extra work is required to use Mocha in a similar fashion to using Jasmine with "jasminewd".
//

// Use "Mocha As Promised" and "Chai As Promised" to deal with resolving promises in expectations.
// Use "Chai WebDriver" for testing DOM assertions.
require("mocha-as-promised")();
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
//var chaiWebDriver = require('chai-webdriver');
//chai.use(chaiWebDriver(browser.driver));
var expect = chai.expect;



describe('pages requiring authentication', function() {
  beforeEach(function() {
    //
    // TODO: Logout (if logged in)!
    //
  });


  it('should redirect to login page if unauthenticated', function() {
    browser.get(browser.baseUrl);

    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        if (url !== browser.baseUrl && url !== browser.baseUrl + '/') {
          expect(url).not.to.equal(browser.baseUrl);
          expect(url).not.to.equal(browser.baseUrl + '/');
          return true;
        }
      });
    });
  });


  it('should not redirect if URL hack is used', function() {
    browser.get('/?noExternalLogout=true');

    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        if (url === browser.baseUrl + '/?noExternalLogout=true') {
          expect(url).to.equal(browser.baseUrl + '/?noExternalLogout=true');
          return true;
        }
      });
    });
  });


  it('should be able to login from URL-hacked login page', function() {
    browser.get('/?noExternalLogout=true');

    browser.driver.findElement(by.id('userEmail')).sendKeys(browser.params.login.email);
    browser.driver.findElement(by.id('userPassword')).sendKeys(browser.params.login.password);
    browser.driver.findElement(by.id('btnSubmit')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // "welcome"
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        if (url === browser.baseUrl + '/welcome') {
          expect(url).to.equal(browser.baseUrl + '/welcome');
          return true;
        }
      });
    });

    // Then the data is loaded and we move redirect to the baseUrl
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        if (url === browser.baseUrl + '/') {
          expect(url).to.equal(browser.baseUrl + '/');
          return true;
        }
      });
    });

/*
  });

  it('should be able to get to the add a new student page', function() {
    browser.get('/?noExternalLogout=true');

    browser.driver.findElement(by.id('userEmail')).sendKeys(browser.params.login.email);
    browser.driver.findElement(by.id('userPassword')).sendKeys(browser.params.login.password);
    browser.driver.findElement(by.id('btnSubmit')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to "welcome".
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        if (url === browser.baseUrl + '/welcome') {
          expect(url).to.equal(browser.baseUrl + '/welcome');
          return true;
        }
      });
    });

    // Then the data is loaded and we move redirect to the baseUrl
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        if (url === browser.baseUrl + '/') {
          expect(url).to.equal(browser.baseUrl + '/');
          return true;
        }
      });
    });
*/

    // Hover over an item
    var studentsMenu = browser.driver.findElement(by.linkText('Students'));
    browser.actions().mouseMove(studentsMenu).perform();
    
    // Click the newly visible link
    browser.driver.findElement(by.linkText('Add New Students')).click();

    // Verify URL changed
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        if (url === browser.baseUrl + '/students/add') {
          expect(url).to.equal(browser.baseUrl + '/students/add');
          return true;
        }
      });
    });
  });

});

