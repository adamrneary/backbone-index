;(function(_, Backbone) {
'use strict';

Backbone.Index = function(Collection) {
  Collection.prototype.where = function(args) {
    return getIndex(this, args)[getValue(args)];
  };

  Collection.prototype.query = function(args) {
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

}).call(this, _, Backbone);
