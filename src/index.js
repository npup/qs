/* eslint, global declarations: */
/* global
  module
*/
var undefinedType = typeof void 0;
function getType(o) {
  if (null==o) {return null===o ? "[object Null]" : "[object Undefined]";}// IE 6-7-8 returns [object Object], Opera returns [object Window] (!)
  var type = {}.toString.call(o);
  if ("[object Number]"==type && o!==o) {return "[object NaN]";} // paving for NaN
  return type;
}

var booleanExpr = /^true|false$/;
function possiblyPrimitive(value) {
  var cast = Number(value);
  if (value==cast) {return cast;} // as number
  if ("null"==value) {return null;} // null
  if (booleanExpr.test(value)) {return "true"==value;} // as boolean
  return decodeURIComponent(value); // as string
}

function fromQueryString(qs) {
  qs = qs.replace(/^\?(.+)$/, "$1");
  var entries = qs.split(/\&/), result = {};
  for (var idx=0, len = entries.length; idx<len; ++idx) {
    var entry = entries[idx].split("="), key = entry[0], value = decodeURIComponent(entry[1]);
    undefinedType==typeof value && (value = "");
    var existing = result[key];
    if (undefinedType != typeof existing) {
      "[object Array]" == getType(existing) || (existing = [existing]);
      existing.push(possiblyPrimitive(value));
      value = existing;
    }
    result[key] = existing ? value : possiblyPrimitive(value);
  }
  return result;
}

function gatherValues(key, arr) {
  var result = [];
  for (var idx=0, len=arr.length; idx<len; ++idx) {
    result.push(key+"="+encodeURIComponent(arr[idx]));
  }
  return result;
}

function toQueryString(o) {
  if (null==o) {return "";}
  if ("[object Object]"!=getType(o)) { throw Error("Strange object: "+o); }
  var pairs = [];
  for (var key in o) {
    if (!o.hasOwnProperty(key)) { continue; }
    var value = o[key];
    if ("[object Array]"==getType(value)) {
      // `value` is an array of values, process it
      value = gatherValues(key, value);
      pairs.push(value.join("&"));
    }
    else {
      pairs.push(key+"="+encodeURIComponent(value));
    }
  }
  var expr = /^([^=]+)/;
  return pairs.sort(function (s0, s1) {
    var k0 = expr.exec(s0), k1 = expr.exec(s1);
    return k1<k0 ? 1 : k1>k0 ? -1 : 0;
  }).join("&");
}

module.exports = {
  "from": fromQueryString
  , "to": toQueryString
};
