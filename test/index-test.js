describe('Backbone.index', function() {
  var expect = window.chai.expect, users;
  var Users  = Backbone.Collection.extend({});
  Backbone.Index(Users);

  beforeEach(function() {
    users = new Users([
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
  });

  it('adds query method', function() {
    expect(Users.prototype.query).exist;
  });

  it('static #where', function() {
    expect(_.isEmpty(users._index)).true;
    expect(users.where({ companyId: 1 })).length(5);
    expect(Object.keys(users._index)).eql(['companyId']);

    expect(users.where({ companyId: 3 })).length(1);
    expect(Object.keys(users._index)).eql(['companyId']);
  });

  it('static #query', function() {
    expect(users.query({ companyId: 1, officeId: [1, 3] })).length(3);
    expect(users.query({ officeId: [1, 2, 3, 5], companyId: 3 })).length(1);
    expect(users.query({ companyId: [1, 2], officeId: [1, 5] })).length(4);
    expect(Object.keys(users._index)).eql(['companyIdofficeId']);
  });

  it('static query without array params', function() {
    expect(users.query({ companyId: 1 })).length(5);
    expect(users.query({ companyId: 1, officeId: 2 })).length(2);
    expect(Object.keys(users._index)).length(2);
  });
});
