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
    describe('Get', function() {
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

      it('retrieves single value', () => {
        assert.deepEqual(doc.get('one'), new NestedItem({
          string: 'abc'
        }));
      });
      it('retrieves nested value', () => {
        assert.deepEqual(doc.get('one.string'), 'abc');
      });
      it('retrieves value of the list field', () => {
        assert.deepEqual(doc.get('many'), [new NestedItem({
          string: 'abc'
        })]);
      });
      it('retrieves value of the element in the list field', () => {
        assert.deepEqual(doc.get('many.0'), new NestedItem({
          string: 'abc'
        }));
      });
      it('retrieves multiple single values', () => {
        assert.deepEqual(doc.get(['one', 'immutable', 'transient']), {
          one: new NestedItem({
            string: 'abc'
          }),
          immutable: 'immutable',
          transient: 'transient'
        });
      });
      it('retrieves multiple single values ommiting immutable fields', () => {
        assert.deepEqual(doc.get(['one', 'immutable', 'transient'], {
          immutable: false
        }), {
          one: new NestedItem({
            string: 'abc'
          }),
          immutable: undefined,
          transient: 'transient'
        });
      });
      it('retrieves multiple single values ommiting transient fields', () => {
        assert.deepEqual(doc.get(['one', 'immutable', 'transient'], {
          transient: false
        }), {
          one: new NestedItem({
            string: 'abc'
          }),
          immutable: 'immutable',
          transient: undefined
        });
      });
      it('retrieves multiple single non-undefined values', () => {
        assert.deepEqual(doc.get(['one', 'undefined'], {
          undefined: false
        }), {
          one: new NestedItem({
            string: 'abc'
          })
        });
      });
      it('retrieves multiple single non-undefined values ommiting immutable and transient fields', () => {
        assert.deepEqual(doc.get(['one', 'immutable', 'transient'], {
          immutable: false,
          transient: false,
          undefined: false
        }), {
          one: new NestedItem({
            string: 'abc'
          })
        });
      });
      it('retrieves multiple nested values', () => {
        assert.deepEqual(doc.get(['one.string']), {
          'one.string': 'abc'
        });
      });
      it('retrieves all values', () => {
        assert.deepEqual(doc.get(), {
          one: new NestedItem({
            string: 'abc'
          }),
          many: [new NestedItem({
            string: 'abc'
          })],
          undefined: undefined,
          immutable: 'immutable',
          transient: 'transient'
        });
      });
    });
  });
});