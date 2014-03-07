var linksProcessor = require('../processors/add-links');
var _ = require('lodash');


describe('add-links', function() {
  var addLinks = function(docs) {
    linksProcessor.process(docs);
  };

  it('should add storm link', function() {
    var doc = {
      fileName: 'storm',
      startingLine: 123
    };
    addLinks([doc]);
    expect(doc.sourceLink).toBe('https://github.com/JamesMGreene/meteor-storm/' +
        'blob/master/lib/storm.js#L123');
  });

  it('should add webdriver link', function() {
    var doc = {
      fileName: 'webdriver',
      startingLine: 123
    };
    addLinks([doc]);
    expect(doc.sourceLink).toBe('https://code.google.com/p/selenium/' +
        'source/browse/javascript/webdriver/webdriver.js#123');
  });

  var newType = function(description) {
    return {
      type: {
        description: description
      }
    };
  };

  it('should add links to types', function() {
    var docWithFunction = {
      typeExpression: 'function(webdriver.WebElement, number)',
      fileName: 'storm',
      startingLine: 123,
      returns: {
        tagDef: {
          name: 'returns',
          aliases: ['return'],
          canHaveType: true
        },
        tagName: 'return',
        description: '',
        startingLine: 119,
        typeExpression: 'webdriver.WebElement',
        type: {
          type: 'NameExpression',
          name: 'webdriver.WebElement'
        },
        typeList: ['webdriver.WebElement']
      },
      params: [
        {
          tagDef: {
            name: 'param',
            multi: true,
            docProperty: 'params',
            canHaveName: true,
            canHaveType: true
          },
          tagName: 'param',
          description: 'Map function that will be applied to each element.',
          startingLine: 396,
          typeExpression: 'function(webdriver.WebElement, number)',
          type: {
            type: 'FunctionType',
            params: [
              {type: 'NameExpression', name: 'webdriver.WebElement'},
              {type: 'NameExpression', name: 'number'}
            ]
          },
          typeList: ['function(webdriver.WebElement, number)'],
          name: 'mapFn'
        },
        {
          tagDef: {
            name: 'param',
            multi: true,
            docProperty: 'params',
            canHaveName: true,
            canHaveType: true
          },
          tagName: 'param',
          description: '',
          startingLine: 171,
          typeExpression: 'MeteorStorm',
          type: {
            type: 'NameExpression',
            name: 'MeteorStorm'
          },
          typeList: ['MeteorStorm'],
          name: 'ptor'
        }
      ]
    };

    // Given a type and a function.
    var docs = [
      {
        name: 'webdriver.WebElement',
        fileName: 'webdriver',
        startingLine: 123
      },
      docWithFunction,
      {
        name: 'MeteorStorm',
        fileName: 'storm',
        startingLine: 3
      }
    ];

    // When you add links.
    addLinks(docs);

    // Then ensure the link was added.
    var getDesc = function(index) {
      return docs[1].params[index].paramString;
    };
    expect(getDesc(0)).toBe(
        'function([webdriver.WebElement](#webdriverwebelement), number)');
    expect(getDesc(1)).toBe(
        '[MeteorStorm](#storm)');

    expect(docs[1].returnString).toBe(
        '[webdriver.WebElement](#webdriverwebelement)');
  });
});
