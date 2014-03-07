// Examples of tests to show how debugging works with MeteorStorm. Tests
// should be run against the testapp.

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to the current working directly when
  // storm is called.
  specs: [
    'failure_spec.js',
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000',

  // ----- Options to be passed to minijasminenode.
  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
};
