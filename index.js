;(function(_, Backbone) {
'use strict';

Backbone.Index = function(Collection) {
  Collection.prototype.where = function(args) {
    var keys = _.keys(args).sort();
    return getIndex(this, args, keys)[getValue(args, keys)] || [];
  };

  Collection.prototype.query = function(args) {
    var keys   = getKeys(_.pairs(args));
    var result = [];

    for (var i = 0, len = keys.length; i < len; i++)
      result = result.concat(this.where(keys[i]));

    return result;
  };
};

function getIndex(coll, args, keys) {
  var name = keys.join('');

  if (!coll._index) setupCollection(coll);
  if (!coll._index[name]) {
    coll._indexKeys.push(keys);
    coll._index[name] = coll.groupBy(function(item) {
      return getValue(item.attributes, keys);
    });
  }

  return coll._index[name];
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
        merged[len2*i + j] = _.extend({}, res[i], children[j]);
    return merged;
  } else {
    return res;
  }
}

function setupCollection(coll) {
  coll._index     = {};
  coll._indexKeys = [];

  coll.on('add', forEachKeys(addItem));
  coll.on('remove', forEachKeys(removeItem));
  coll.on('change', onchange);
}

function addItem(index, value, item) {
  if (_.has(index, value)) index[value].push(item);
  else index[value] = [value];
}

function removeItem(index, value, item) {
  if (_.has(index, value))
    index[value] = _.without(index[value], item);
}

function onchange(item) {
  var changedKeys = _.keys(item.changedAttributes());
  var isChanged   = _.bind(_.include, null, changedKeys);
  var prevAttrs   = item.previousAttributes();

  forEachKeys(function(index, value, item, keys) {
    if (!_.some(keys, isChanged)) return;
    var prevValue = getValue(prevAttrs, keys);

    removeItem(index, prevValue, item);
    addItem(index, value);
  })(item);
}

function forEachKeys(cb) {
  return function(item) {
    var coll = item.collection;

    _.forEach(coll._indexKeys, function(keys) {
      var name  = keys.join('');
      var index = coll._index[name];
      var value = getValue(item.attributes, keys);
      cb(index, value, item, keys);
    });
  };
}

}).call(this, _, Backbone);
