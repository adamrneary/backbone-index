# Backbone.Index [![Build Status](https://circleci.com/gh/activecell/backbone-index.png)](https://circleci.com/gh/activecell/backbone-index)

  Simple, dynamic indexes for greasy-fast filtering of collections

  It useful for:

  * Filtering collection with selected keys more than 5 times
  * Using `query` instead of Backbone.Collection's default `where` if you need
    to filter to values in an array

## Installation

    $ bower install backbone-index --save

  or include [index.js](https://github.com/activecell/backbone-index/blob/master/index.js) with `script` tag.

## Example

```js
var Users = Backbone.Collection.extend({});

// Apply Backbone.Index to Collection
Backbone.Index(Users);

var users = new Users([
  { id: 1, companyId: 1, officeId: 1, name: 'John'  },
  { id: 2, companyId: 1, officeId: 1, name: 'Peter' },
  { id: 3, companyId: 1, officeId: 2, name: 'Bret'  },
  { id: 4, companyId: 2, officeId: 5, name: 'Tom'   },
  { id: 5, companyId: 1, officeId: 3, name: 'Keit'  },
  { id: 6, companyId: 1, officeId: 2, name: 'Anna'  },
  { id: 7, companyId: 2, officeId: 3, name: 'Helen' },
  { id: 8, companyId: 3, officeId: 1, name: 'Maria' },
  { id: 9, companyId: 2, officeId: 5, name: 'Adam'  }
]);

users.where({ companyId: 1 }); // => [Array(5)] ~ 0.16ms

// Subsequent requests use the index to return values much faster than the
// initial request
_.times(100, function() {
  users.where({ companyId: _.random(1, 3) });
}); // => ~ 0.37ms
```

## How it works

  When you run a query the first time, Backbone.Index runs a `groupBy` method
  and generates an index for all possible combinations of the value for
  selected keys.

  The second time, it uses the index, and does not need to do any filtering.
  To ensure a correct dataset, Backbone.Index also subscribes to `add`,
  `change` and `remove` Backbone events.

## API

### Backbone.Index(Collection)

  Apply index functionality to selected collection.

### collection.where(attributes, [first])

  Alias: **collection.query**
  Same semantic as [Backbone.Collection.prototype.where](http://documentcloud.github.io/backbone/#Collection-where).
  Second boolean optional argument is for cases when you need only one value,
  it's similar to [Backbone.Collection.prototype.findWhere](http://jashkenas.github.io/backbone/#Collection-findWhere).

  As a query parameters you can pass values, arrays of values, or arrays of Backbone.Models.

```js
users.where({ companyId: 2, officeId: 2 });
users.where({ companyId: 1, officeId: [1, 3] });
users.where({ officeId: [office1, office2] });
 ```
