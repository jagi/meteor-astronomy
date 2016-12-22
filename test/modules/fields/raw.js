import {
  assert
}
from 'meteor/practicalmeteor:chai';
import {
  Class
}
from 'meteor/jagi:astronomy';

describe('Module', function() {
  describe('Fields', function() {
    describe('Raw', function() {
      const NestedItem = Class.create({
        name: 'NestedItem',
        fields: {
          string: {
            type: String
          }
        }
      });

      const Item = Class.create({
        name: 'Item',
        fields: {
          one: {
            type: NestedItem
          },
          many: {
            type: [NestedItem]
          },
          undefined: {
            type: String
          },
          immutable: {
            type: String,
            immutable: true
          },
          transient: {
            type: String,
            transient: true
          }
        }
      });

      const doc = new Item({
        one: new NestedItem({
          string: 'abc'
        }),
        many: [
          new NestedItem({
            string: 'abc'
          })
        ],
        immutable: 'immutable',
        transient: 'transient'
      });

      it('retrieves single raw value', () => {
        assert.deepEqual(doc.raw('one'), {
          string: 'abc'
        });
      });
      it('retrieves nested raw value', () => {
        assert.deepEqual(doc.raw('one.string'), 'abc');
      });
      it('retrieves raw value of the list field', () => {
        assert.deepEqual(doc.raw('many'), [{
          string: 'abc'
        }]);
      });
      it('retrieves raw value of the element in the list field', () => {
        assert.deepEqual(doc.raw('many.0'), {
          string: 'abc'
        });
      });
      it('retrieves multiple single raw values', () => {
        assert.deepEqual(doc.raw(['one', 'immutable', 'transient']), {
          one: {
            string: 'abc'
          },
          immutable: 'immutable',
          transient: 'transient'
        });
      });
      it('retrieves multiple single raw values ommiting immutable fields', () => {
        assert.deepEqual(doc.raw(['one', 'immutable', 'transient'], {
          immutable: false
        }), {
          one: {
            string: 'abc'
          },
          immutable: undefined,
          transient: 'transient'
        });
      });
      it('retrieves multiple single raw values ommiting transient fields', () => {
        assert.deepEqual(doc.raw(['one', 'immutable', 'transient'], {
          transient: false
        }), {
          one: {
            string: 'abc'
          },
          immutable: 'immutable',
          transient: undefined
        });
      });
      it('retrieves multiple single raw, non-undefined values', () => {
        assert.deepEqual(doc.raw(['one', 'undefined'], {
          undefined: false
        }), {
          one: {
            string: 'abc'
          }
        });
      });
      it('retrieves multiple single raw, non-undefined values ommiting immutable and transient fields', () => {
        assert.deepEqual(doc.raw(['one', 'immutable', 'transient'], {
          immutable: false,
          transient: false,
          undefined: false
        }), {
          one: {
            string: 'abc'
          }
        });
      });
      it('retrieves multiple nested raw values', () => {
        assert.deepEqual(doc.raw(['one.string']), {
          'one.string': 'abc'
        });
      });
      it('retrieves all raw values', () => {
        assert.deepEqual(doc.raw(), {
          one: {
            string: 'abc'
          },
          many: [{
            string: 'abc'
          }],
          undefined: undefined,
          immutable: 'immutable',
          transient: 'transient'
        });
      });
    });
  });
});