describe('Backbone.Index', function() {
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

  it('adds where/query methods', function() {
    expect(Users.prototype.where).exist;
    expect(Users.prototype.query).exist;
  });

  describe('static', function() {
    it('#where', function() {
      expect(_.isEmpty(users._index)).true;
      expect(users.where({ companyId: 1 })).length(5);
      expect(Object.keys(users._index)).eql(['companyId']);

      expect(users.where({ companyId: 3 })).length(1);
      expect(Object.keys(users._index)).eql(['companyId']);
    });

    it('#query', function() {
      expect(users.query({ companyId: 1, officeId: [1, 3] })).length(3);
      expect(users.query({ officeId: [1, 2, 3, 5], companyId: 3 })).length(1);
      expect(users.query({ companyId: [1, 2], officeId: [1, 5] })).length(4);
      expect(Object.keys(users._index)).eql(['companyIdofficeId']);
    });

    it('#query without array params', function() {
      expect(users.query({ companyId: 1 })).length(5);
      expect(users.query({ companyId: 1, officeId: 2 })).length(2);
      expect(Object.keys(users._index)).length(2);
    });
  });

  describe('dynamic', function() {
    it('handles `add` event', function() {
      expect(users.where({ companyId: 3 })).length(1);
      expect(users.query({ companyId: 2, officeId: [1, 3] })).length(1);
      users.add([
        { id: 10, companyId: 1, officeId: 2, name: 'Paul' },
        { id: 11, companyId: 2, officeId: 3, name: 'Alex' },
        { id: 12, companyId: 3, officeId: 2, name: 'Don'  },
        { id: 13, companyId: 3, officeId: 3, name: 'Bert' }
      ]);
      expect(users.where({ companyId: 3 })).length(3);
      expect(users.query({ companyId: 2, officeId: [1, 3] })).length(2);
    });

    it('handles `remove` event', function() {
      expect(users.where({ companyId: 1, officeId: 2 })).length(2);
      expect(users.query({ companyId: [1, 2, 3], officeId: [1, 2, 3, 5] })).length(9);
      users.remove([users.get(4), users.get(5), users.get(6)]);

      expect(users.where({ companyId: 1, officeId: 2 })).length(1);
      expect(users.query({ companyId: 2, officeId: [1, 2, 3, 5] })).length(2);
      expect(users.query({ companyId: [1, 2, 3] })).length(6);
    });

    it('handles `change` event', function() {
      expect(users.where({ companyId: 1, officeId: 3 })).length(1);
      users.get(5).set({ officeId: 2, name: 'Isabella' });
      users.get(6).set({ name: 'Robert' });
      users.get(1).set({ companyId: 3, officeId: 5 });
      expect(users.where({ companyId: 1, officeId: 3 })).length(0);
      expect(users.query({ companyId: [1, 3], officeId: 5})).length(1);
    });

    it('advanced collection.set event', function() {
      expect(users.where({ officeId: 5 })).length(2);
      expect(users.query({ companyId: 2, officeId: [1, 2, 3] })).length(1);
      users.set([
        { id: 3,  companyId: 3, officeId: 5, name: 'Bret' },
        { id: 4,  companyId: 1, officeId: 2, name: 'Tom'  },
        { id: 5,  companyId: 1, officeId: 3, name: 'Keit' },
        { id: 6,  companyId: 2, officeId: 2, name: 'Anna' },
        { id: 10, companyId: 1, officeId: 2, name: 'Paul' },
        { id: 11, companyId: 2, officeId: 3, name: 'Alex' }
      ]);
      expect(users.where({ officeId: 5 })).length(1);
      expect(users.query({ companyId: 1, officeId: [2, 3] })).length(3);
    });
  });
});
