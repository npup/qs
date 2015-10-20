var assert = require("proclaim");

var qs = require("../src/");

describe("module qs", function () {

  it("should be an object", function () {
    assert.isObject(qs);
  });

  it("should expose two functions, `to` and `from`", function () {
    var keys = [];
    for (var key in qs) {
      if (qs.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    assert.equal(keys.length, 2);
    assert.isFunction(qs.from);
    assert.isFunction(qs.to);
  });

});



describe("to", function () {

  it("should stringify a simple object", function () {
    var o = {"foo": 1};
    assert.equal(qs.to(o), "foo=1");
  });

  it("should stringify simple objects with multiple properties", function () {
    var o = {"foo": 1, "bar": 2};
    assert.equal(qs.to(o), "bar=2&foo=1");
    o = {"foo": 1, "bar": 2, "bak": 3};
    assert.equal(qs.to(o), "bak=3&bar=2&foo=1");
  });

  it("should stringify an object with array property", function () {
    var o = {"foo": [1, 2, 3]};
    assert.equal(qs.to(o), "foo=1&foo=2&foo=3");
  });

  it("should stringify objects with multiple array properties", function () {
    var o = {"foo": [1, 2, 3], "bar": "yo", "baz": [2, 4]};
    assert.equal(qs.to(o), "bar=yo&baz=2&baz=4&foo=1&foo=2&foo=3");
    o = {"foo": [1, 2, 3], "bar": "yo", "baz": "bak", "zak": ["fee", "fi", "fo", "fum"]};
    assert.equal(qs.to(o), "bar=yo&baz=bak&foo=1&foo=2&foo=3&zak=fee&zak=fi&zak=fo&zak=fum");
  });

  describe("URL encoding of parameter values", function () {

    it("should handle : and &", function () {
      var o = {"foo": "apa:7", "bar": "&wsome"};
      assert.equal(qs.to(o), "bar=%26wsome&foo=apa%3A7");
    });
    it("should handle ´ > and <", function () {
      var o = {"foo": "o´sh", "bar": "><"};
      assert.equal(qs.to(o), "bar=%3E%3C&foo=o%C2%B4sh");
    });
    it("should handle +", function () {
      var o = {"foo": "a+b"};
      assert.equal(qs.to(o), "foo=a%2Bb");
    });

  });


});

describe("from", function () {

  it("should parse a simple querystring", function () {
    assert.deepEqual(qs.from("foo=1"), {"foo": 1});
  });

  it("should parse a simple querystring, multiple properties", function () {
    assert.deepEqual(qs.from("foo=1&bar=2"), {"foo": 1, "bar": 2});
  });

  it("should parse querystrings with multiple values for same property", function () {
    assert.deepEqual(qs.from("foo=12&foo=1&foo=2&foo=3"), {"foo": [12, 1, 2, 3]});
    assert.deepEqual(qs.from("foo=12&foo=1&foo=2&foo=3&bar=40"), {"foo": [12, 1, 2, 3], "bar": 40});
  });

  describe("URL encoding of parameter values", function () {
    it("should handle :", function () {
      assert.deepEqual(qs.from("foo=a%3Ab"), {"foo": "a:b"});
    });
    it("should handle +", function () {
      assert.deepEqual(qs.from("foo=a%2Bb"), {"foo": "a+b"});
    });
  });

});
