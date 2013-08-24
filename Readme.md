# Backbone.Index

  It's a lightweight plugin for [backbone.js](http://documentcloud.github.io/backbone/),
  which generates indexes on the fly for crazy fast filtering of collections.

  It useful for:

  * you filter collection with selected keys more than 1 time.
  * in addition to default backbone.collection's `where` you need to run `query`,
    which accepts array as a key.

## Installation

    $ bower install backbone-index --save

  or include [index.js]() with script tag.

## Example

```js
var Users = Backbone.Collection.extend({});
// adds `where` and `query` methods
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

// All tests measured with performance.now() method
// ~
users.where({ companyId: 1 }); // => [Array(5)]

// next requests use index and much faster than first one
// ~
_.times(100, function() {
  users.where({ companyId: _.random(1, 3) });
});
```

## How it works

  When you run query at first time, backbone-index runs `groupBy` method
  and generates index for all possible combinations of value for selected keys.
  In second time it uses it index, and does not do any kind of filtering.
  Also it subscribes on changes and manage this index for every `add` and `remove` events.

## API

### Backbone.Index(Collection)

  Apply index functionality to selected colection.

### collection#where(attributes)

  Same semantic as [Backbone.Collection.prototype.where](http://documentcloud.github.io/backbone/#Collection-where)

### collection.query(attributes)

  If `where` is a simple filtering, `query` allows to use array as a value.

 ```js
 users.where({ companyId: 1, officeId: [1, 3] }); // => Array(3)
 ```

## Development

  * `npm install` - to install development depenencies
  * `npm test` - to ensure that all tests pass
  * `npm start` - to start watch server for test suite

## Licence

  [Activecell](http://activecell.com/), MIT
