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
    numbers: {
      type: [Number],
      default() {
        return [];
      }
    },
    strings: {
      type: [String],
      default() {
        return [];
      }
    },
    booleans: {
      type: [Boolean],
      default() {
        return [];
      }
    },
    dates: {
      type: [Date],
      default() {
        return [];
      }
    },
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
          }],
          numbers: ['1', '2'],
          strings: [1, 2],
          booleans: [0, 1],
          dates: [572137200000]
        }, {
          cast: true
        });
        assert.deepEqual(item.number, 1);
        assert.deepEqual(item.boolean, false);
        assert.deepEqual(item.date, new Date(1988, 1, 18));
        assert.deepEqual(item.one.string, '2');
        assert.deepEqual(item.many[0].string, '2');
        assert.deepEqual(item.numbers, [1, 2]);
        assert.deepEqual(item.strings, ['1', '2']);
        assert.deepEqual(item.booleans, [false, true]);
        assert.deepEqual(item.dates, [new Date(1988, 1, 18)]);
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
          }],
          numbers: ['1', '2'],
          strings: [1, 2],
          booleans: [0, 1],
          dates: [572137200000]
        }, {
          cast: true
        });
        assert.deepEqual(item.number, 1);
        assert.deepEqual(item.boolean, false);
        assert.deepEqual(item.date, new Date(1988, 1, 18));
        assert.deepEqual(item.one.string, '2');
        assert.deepEqual(item.many[0].string, '2');
        assert.deepEqual(item.numbers, [1, 2]);
        assert.deepEqual(item.strings, ['1', '2']);
        assert.deepEqual(item.booleans, [false, true]);
        assert.deepEqual(item.dates, [new Date(1988, 1, 18)]);
      });
      it('casts values using the "set()" method for the embedded fields with the "cast" option set', function() {
        const item = new Item();
        item.set('numbers.0', '2', {
          cast: true
        });
        item.set('strings.0', 2, {
          cast: true
        });
        item.set('booleans.0', 1, {
          cast: true
        });
        item.set('dates.0', 946681200000, {
          cast: true
        });
        assert.deepEqual(item.numbers[0], 2);
        assert.deepEqual(item.strings[0], '2');
        assert.deepEqual(item.booleans[0], true);
        assert.deepEqual(item.dates[0], new Date(2000, 0, 1));
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