MeteorStorm [![Build Status](https://travis-ci.org/JamesMGreene/meteor-storm.png?branch=master)](https://travis-ci.org/JamesMGreene/meteor-storm)
============

MeteorStorm is an end to end test framework for [Meteor](http://www.meteor.com/) applications built on top of [Protractor](https://github.com/angular/protractor) and [WebDriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs). MeteorStorm runs tests against your application running in a real browser, interacting with it as a user would.

MeteorStorm can be run as a standalone binary, or included into your tests as a library. Use MeteorStorm as a library if you would like to manage WebDriver and your test setup yourself.


To run the sample tests
-----------------------

Install MeteorStorm with:

    npm install -g meteor-storm

Start up a selenium server (See the appendix below for help with this). By default, the tests expect the selenium server to be running at `http://localhost:4444/wd/hub`.

The node module's `example` folder contains a simple test suite which runs against [meteor.com](http://www.meteor.com/). Run with: 

    storm example/conf.js


Using the MeteorStorm Runner
-----------------------------

The MeteorStorm runner is a binary which accepts a config file. Install `storm` with:

    npm install -g meteor-storm
    # Run the line below to see command line options
    storm

You will need a _configuration file_ containing setup info and *test files* containing the actual test scripts. The config file specifies how the runner should start webdriver, where your test files are, and global setup options. The test files use Jasmine framework by default but can also use Mocha or Cucumber.

Create a configuration file - an example with detailed comments is shown in `node_modules/meteor-storm/referenceConf.js`. Edit the configuration file to point to your test files.

```js
// myConf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['myTest.js', 'myTestFolder/*Test.js']
}
```

The configuration file must specify a way to connection to WebDriver. This can be
 *   `seleniumAddress`: The address of a running Selenium standalone server.
 *   `seleniumServerJar`: The location of the Selenium standalone .jar file on your machine. MeteorStorm will use this to start up the selenium server.
 *   `sauceUser` and `sauceKey`: The username and key for a [SauceLabs](http://www.saucelabs.com) account. MeteorStorm will use this to run tests on SauceLabs.

The runner exposes global variables `browser`, `by` and `element`. Check out the `specs` folder to learn how to write a test.

```js
// myTest.js
describe('Meteor homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://www.meteor.com/');

    element(by.model('yourName')).sendKeys('James');

    var greeting = element(by.binding('yourName'));

    expect(greeting.getText()).toEqual('Hello James!');
  });
});
```

Run with:

    storm myConf.js


Cloning and running MeteorStorm's own tests
--------------------------------------------
Clone the github repository.

    git clone https://github.com/JamesMGreene/meteor-storm.git
    cd meteor-storm
    npm install

Start up a selenium server. By default, the tests expect the selenium server to be running at `http://localhost:4444/wd/hub`.

MeteorStorm's test suite runs against the included testapp. Start that up with:

    cd testapp
    ./scripts/web-server.js

Then run the tests with:

    npm test


Appendix A: Setting up a standalone Selenium server
---------------------------------------------------

WebdriverJS does not natively include the selenium server - you must start a standalone selenium server. All you need is the latest [selenium-server-standalone.](https://code.google.com/p/selenium/downloads/list). To drive individual browsers, you may need to install separate driver binaries.

To use with chrome browsers, [download chromedriver](http://chromedriver.storage.googleapis.com/index.html).
[More information about chromedriver](https://sites.google.com/a/chromium.org/chromedriver/)

The `webdriver-manager` script is included in the npm package to manage downloads for you. To see the options, run:

    npm install -g storm
    webdriver-manager

Download and start the selenium server with:

    webdriver-manager update
    webdriver-manager start

Note the [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/index.html) is also required to run the webdriver. You may have to download and install it if your computer does not already have it.

For alternate ways to download and start the selenium standalone, see
[the webdriver docs](http://docs.seleniumhq.org/docs/03_webdriver.jsp#running-standalone-selenium-server-for-use-with-remotedrivers).
