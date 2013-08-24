;(function(_, Backbone) {
'use strict';

Backbone.Index = function(Collection) {
  Collection.prototype.where = function(args) {
    return getIndex(this, args)[getValue(args)];
  };

  Collection.prototype.query = function(args) {
    var keys   = getKeys(_.pairs(args));
    var result = [];

    for (var i = 0, len = keys.length; i < len; i++)
      result.push.apply(result, this.where(keys[i]));

    return _.uniq(result);
  };
};

function getIndex(collection, args) {
  var keys = _.keys(args).sort();
  var name = keys.join('');

  if (!collection._index) collection._index = {};
  if (!collection._index[name]) {
    var len = keys.length;
    collection._index[name] = collection.groupBy(function(item) {
      var res = '';
      for (var i = 0; i < len; i++) res += item.get(keys[i]);
      return res;
    });
  }

  return collection._index[name];
}

function getValue(args) {
  var keys = _.keys(args).sort();
  var res = '';
  for (var i = 0, len = keys.length; i < len; i++) res += args[keys[i]];
  return res;
}

function getKeys(pairs) {
  var i, j, len, len2, obj;
  var res  = [];
  var pair = _.first(pairs);
  var key  = pair[0];
  var val  = pair[1];

  if (!_.isArray(val)) val = [val];
  for (i = 0, len = val.length; i < len; i++) {
    obj = {};
    obj[key] = val[i];
    res.push(obj);
  }
  if (pairs.length > 1) {
    var children = getKeys(_.rest(pairs));
    var merged   = [];
    for (i = 0, len = res.length; i < len; i++)
      for (j = 0, len2 = children.length; j < len2; j++)
        merged[len2*i + j] = _.extend({}, children[j], res[i]);
    return merged;
  } else {
    return res;
  }
}

}).call(this, _, Backbone);
