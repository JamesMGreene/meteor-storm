/**
 * All scripts to be run on the client via executeAsyncScript or
 * executeScript should be put here. These scripts are transmitted over
 * the wire using their toString representation, and cannot reference
 * external variables. They can, however use the array passed in to
 * arguments. Instead of params, all functions on clientSideScripts
 * should list the arguments array they expect.
 */
var clientSideScripts = exports;

// var httpCall = Meteor.http.call;
// var httpCount = 0;
// var httpDoneFns = [];
// Meteor.http.call = function(method, url, options, callback) {
//   function httpDoneCheckFn() {
//     httpCount--;
//     if (typeof callback === 'function') {
//      callback.apply(this, arguments)
//     }
//     if (httpCount < 0 && httpDoneFns.length > 0) {
//       httpDone();
//     }
//   }
//   httpCount++;
//   httpCall.call(this, method, url, options, httpDoneCheckFn);
// };

// /**
//  * Signal when Meteor has no outstanding HTTP calls remaining.
//  *
//  * Asynchronous.
//  * {function} callback
//  */
// clientSideScripts.httpDone = function(callback) {
//   if (typeof callback === "function") {
//     httpDoneFns.push(callback);
//   }
//   if (httpCount < 1) {
//     for (var i = 0, len = httpDoneFns.length; i < len; i++) {
//       httpDoneFns[i]();
//     }
//     httpDoneFns.length = 0;
//     httpCount = 0;
//   }
// };

/**
 * Wait until Meteor has finished rendering and has
 * no outstanding HTTP calls before continuing.
 *
 * Asynchronous.
 * {function} callback
 */
clientSideScripts.waitForMeteor = function(callback) {
  try {
    clientSideScripts.testForMeteor(1, function(data) {
      if (data && data[0] === true) {
        //
        // TODO: Add the HTTP tracking
        //
        //clientSideScripts.httpDone(callback);

        callback();
      }
      else if (data && data[0] === false) {
        if (data[1] instanceof Error) {
          callback(data[1]);
        }
        else {
          callback(new Error(data[1]));
        }
      }
    });
  } catch (e) {
    callback(e);
  }
};

/**
 * Tests whether the Meteor global variable is present on a page. Retries
 * in case the page is just loading slowly.
 *
 * Asynchronous.
 * arguments[0] {number} Number of times to retry.
 * arguments[1] {function} callback
 */
clientSideScripts.testForMeteor = function() {
  var attempts = typeof arguments[0] === 'number' ? arguments[0] : 0;
  var asyncCallback = arguments[arguments.length - 1];
  var callback = function(args) {
    setTimeout(function() {
      asyncCallback(args);
    }, 0);
  };
  var check = function(n) {
    try {
      if (window.Meteor && window.Meteor.isClient === true) {
        callback([true, null]);
      } 
      else if (n < 1) {
        if (window.Meteor) {
          callback([false, '`Meteor.isClient` is unexpectedly `false`']);
        }
        else {
          callback([false, 'retries looking for Meteor exceeded']);
        }
      }
      else {
        window.setTimeout(function() {check(n - 1)}, 1000);
      }
    }
    catch (e) {
      callback([false, e]);
    }
  };
  check(attempts);
};

/**
 * Return the current URL.
 */
clientSideScripts.getLocationAbsUrl = function() {
  return window.location.href;
};


/**
 * Simulate `mousemove`/hover for SafariDriver since it has not implemented the WebDriver Interactions API yet.
 *
 * https://code.google.com/p/selenium/issues/detail?id=4136
 */
clientSideScripts.simulateMouseMove = function() {
  var result = false;
  try {
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('mouseover', true, false);
      arguments[0].dispatchEvent(evObj);
    }
    else if (document.createEventObject) {
      arguments[0].fireEvent('onmouseover');
    }
    result = true;
  }
  catch (e) {
    result = false;
  }
  return result;
};