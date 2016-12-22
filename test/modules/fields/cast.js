import {
  assert
}
from 'meteor/practicalmeteor:chai';
import {
  Class
}
from 'meteor/jagi:astronomy';

const NestedItem = Class.create({
  name: 'NestedItem',
  fields: {
    string: String
  }
});

const Item = Class.create({
  name: 'Item',
  fields: {
    number: Number,
    boolean: Boolean,
    date: Date,
    one: NestedItem,
    many: [NestedItem],
    custom: {
      type: String,
      cast(value) {
        return JSON.stringify(value);
      }
    }
  }
});

describe('Module', function() {
  describe('Fields', function() {
    describe('Cast', function() {
      it('casts values on construction with the "cast" option set', function() {
        const item = new Item({
          number: '1',
          boolean: 'false',
          date: 572137200000,
          one: {
            string: 2
          },
          many: [{
            string: 2
          }]
        }, {
          cast: true
        });
        assert.deepEqual(item.number, 1);
        assert.deepEqual(item.boolean, false);
        assert.deepEqual(item.date, new Date(1988, 1, 18));
        assert.deepEqual(item.one.string, '2');
        assert.deepEqual(item.many[0].string, '2');
      });
      it('casts values using the "set()" method with the "cast" option set', function() {
        const item = new Item();
        item.set({
          number: '1',
          boolean: 'false',
          date: 572137200000,
          one: {
            string: 2
          },
          many: [{
            string: 2
          }]
        }, {
          cast: true
        });
        assert.deepEqual(item.number, 1);
        assert.deepEqual(item.boolean, false);
        assert.deepEqual(item.date, new Date(1988, 1, 18));
        assert.deepEqual(item.one.string, '2');
        assert.deepEqual(item.many[0].string, '2');
      });
      it('casts values using custom casting function', function() {
        const item = new Item();
        item.set('custom', {
          a: 1,
          b: 2
        }, {
          cast: true
        });
        assert.deepEqual(item.custom, '{"a":1,"b":2}');
      });
      it('does not cast "null" and "undefined" values', function() {
        const item = new Item();
        item.set({
          number: null,
          boolean: undefined
        }, {
          cast: true
        });
        assert.isNull(item.number, null);
        assert.isUndefined(item.boolean, undefined);
      });
      it('does not cast objects to plain values', function() {
        const item = new Item();
        item.set({
          number: {
            a: 1
          }
        }, {
          cast: true
        });
        assert.deepEqual(item.number, {
          a: 1
        });
      });
    });
  });
});