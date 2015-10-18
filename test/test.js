var assert = require("chai").assert;

var qs = require("../dist/qs.js");

suite("module shape", function () {

  test("qs should be an object", function () {
    assert.isObject(qs);
  });

  test("qs should expose two functions, `to` and `from`", function () {
    assert.equal(Object.keys(qs).length, 2);
    assert.isFunction(qs.from);
    assert.isFunction(qs.to);
  });

});



suite("to", function () {

  test("a simple object", function () {
    var o = {"foo": 1};
    assert.equal(qs.to(o), "foo=1");
  });

  test("simple objects with multiple properties", function () {
    var o = {"foo": 1, "bar": 2};
    assert.equal(qs.to(o), "bar=2&foo=1");
    o = {"foo": 1, "bar": 2, "bak": 3};
    assert.equal(qs.to(o), "bak=3&bar=2&foo=1");
  });

  test("object with array property", function () {
    var o = {"foo": [1, 2, 3]};
    assert.equal(qs.to(o), "foo=1&foo=2&foo=3");
  });

  test("objects with multiple array properties", function () {
    var o = {"foo": [1, 2, 3], "bar": "yo", "baz": [2, 4]};
    assert.equal(qs.to(o), "bar=yo&baz=2&baz=4&foo=1&foo=2&foo=3");
    o = {"foo": [1, 2, 3], "bar": "yo", "baz": "bak", "zak": ["fee", "fi", "fo", "fum"]};
    assert.equal(qs.to(o), "bar=yo&baz=bak&foo=1&foo=2&foo=3&zak=fee&zak=fi&zak=fo&zak=fum");
  });

  suite("URL encoding of parameter values", function () {

    test("a", function () {
      var o = {"foo": "apa:7", "bar": "&wsome"};
      assert.equal(qs.to(o), "bar=%26wsome&foo=apa%3A7");
    });
    test("b", function () {
      o = {"foo": "o´sh", "bar": "><"};
      assert.equal(qs.to(o), "bar=%3E%3C&foo=o%C2%B4sh");
    });
    test("c", function () {
      o = {"foo": "a+b"};
      assert.equal(qs.to(o), "foo=a%2Bb");
    });

  });


});

suite("from", function () {

  test("simple querystring", function () {
    assert.deepEqual(qs.from("foo=1"), {"foo": 1});
  });

  test("simple querystring, multiple properties", function () {
    assert.deepEqual(qs.from("foo=1&bar=2"), {"foo": 1, "bar": 2});
  });

  test("querystrings with multiple values for same property", function () {
    assert.deepEqual(qs.from("foo=12&foo=1&foo=2&foo=3"), {"foo": [12, 1, 2, 3]});
    assert.deepEqual(qs.from("foo=12&foo=1&foo=2&foo=3&bar=40"), {"foo": [12, 1, 2, 3], "bar": 40});
  });

  suite("URL encoding of parameter values", function () {
    test("a", function () {
      assert.deepEqual(qs.from("foo=a%3Ab"), {"foo": "a:b"});
    });
    test("b", function () {
      assert.deepEqual(qs.from("foo=a%2Bb"), {"foo": "a+b"});
    });
  });

});
