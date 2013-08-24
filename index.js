;(function(_, Backbone) {
'use strict';

Backbone.Index = function(Collection) {
  Collection.prototype.where = function(args) {
    var keys = _.keys(args).sort();
    return getIndex(this, args, keys)[getValue(args, keys)];
  };

  Collection.prototype.query = function(args) {
    var keys   = getKeys(_.pairs(args));
    var result = [];

    for (var i = 0, len = keys.length; i < len; i++)
      result.push.apply(result, this.where(keys[i]));

    return _.uniq(result);
  };
};

function getIndex(collection, args, keys) {
  var name = keys.join('');

  if (!collection._index) collection._index = {};
  if (!collection._index[name]) {
    collection._index[name] = collection.groupBy(function(item) {
      return getValue(item.attributes, keys);
    });
  }

  return collection._index[name];
}

function getValue(args, keys) {
  var res = '';
  for (var i = 0, len = keys.length; i < len; i++) res += args[keys[i]];
  return res;
}

function getKeys(pairs) {
  var i, j, len, len2;
  var res  = [];
  var pair = _.first(pairs), key = pair[0], val = pair[1];

  if (!_.isArray(val)) val = [val];
  for (i = 0, len = val.length; i < len; i++)
    res.push(_.object([key], [val[i]]));

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
