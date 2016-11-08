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
    string: String,
    number: Number
  }
});

const Item = Class.create({
  name: 'Item',
  fields: {
    one: NestedItem,
    many: [NestedItem]
  }
});

describe('Module', function() {
  describe('Fields', function() {
    describe('Merge', function() {
      it('merges objects on setting single value', function() {
        const item = new Item({
          one: {
            string: '123',
            number: 321
          },
          many: [{
            string: '456',
            number: 654
          }]
        });
        item.set('one', {
          string: '321'
        }, {
          merge: true
        });
        item.set('many.0', {
          string: '654'
        }, {
          merge: true
        });
        assert.deepEqual(item.one.string, '321');
        assert.deepEqual(item.one.number, 321);
        assert.deepEqual(item.many[0].string, '654');
        assert.deepEqual(item.many[0].number, 654);
      });
      it('merges objects on setting multiple values', function() {
        const item = new Item({
          one: {
            string: '123',
            number: 321
          },
          many: [{
            string: '456',
            number: 654
          }]
        });
        item.set({
          one: {
            string: '321'
          },
          'many.0': {
            string: '654'
          }
        }, {
          merge: true
        });
        assert.deepEqual(item.one.string, '321');
        assert.deepEqual(item.one.number, 321);
        assert.deepEqual(item.many[0].string, '654');
        assert.deepEqual(item.many[0].number, 654);
      });
    });
  });
});