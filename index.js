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

  coll.on('add', onadd);
  coll.on('remove', onremove);
  coll.on('change', onchange);
}

function onadd(model, coll) {
  _.forEach(coll._indexKeys, function(keys) {
    var name  = keys.join('');
    var index = coll._index[name];
    var value = getValue(model.attributes, keys);

    if (_.has(index, value)) index[value].push(model);
    else index[value] = [value];
  });
}

function onremove(model, coll) {
  _.forEach(coll._indexKeys, function(keys) {
    var name  = keys.join('');
    var index = coll._index[name];
    var value = getValue(model.attributes, keys);

    if (_.has(index, value)) index[value] = _.without(index[value], model);
  });
}

function onchange(model) {
  var coll        = model.collection;
  var changedKeys = _.keys(model.changedAttributes());
  var prevAttrs   = model.previousAttributes();

  _.forEach(coll._indexKeys, function(keys) {
    if (!_.some(keys, function(key) { return _.include(changedKeys, key) })) return;
    var name  = keys.join('');
    var index = coll._index[name];
    var value = getValue(model.attributes, keys);
    var prevValue = getValue(prevAttrs, keys);

    index[prevValue] = _.without(index[prevValue], model);
    index[value].push(model);
  });
}

}).call(this, _, Backbone);
