import {
  assert
}
from 'meteor/practicalmeteor:chai';
import {
  Class
}
from 'meteor/jagi:astronomy';

const DefaultNested = Class.create({
  name: 'DefaultNested',
  fields: {
    string: {
      type: String,
      default: 321
    },
    number: {
      type: Number,
      default: '123'
    },
    boolean: {
      type: Boolean,
      default: 1
    },
    date: {
      type: Date,
      default: 572137200000
    }
  }
});

const Default = Class.create({
  name: 'Default',
  fields: {
    one: {
      type: DefaultNested,
      default() {
        return {};
      }
    },
    many: {
      type: [DefaultNested],
      default() {
        return [{}];
      }
    },
    string: {
      type: String,
      default: 'abc'
    },
    number: {
      type: Number,
      default: 123
    },
    boolean: {
      type: Boolean,
      default: true
    },
    date: {
      type: Date,
      default() {
        return new Date(1988, 1, 18);
      }
    }
  }
});

describe('Module', function() {
  describe('Fields', function() {
    describe('Default', function() {
      it('sets default values on construction', function() {
        const doc = new Default();
        assert.deepEqual(doc.string, 'abc');
        assert.deepEqual(doc.number, 123);
        assert.deepEqual(doc.boolean, true);
        assert.deepEqual(doc.date, new Date(1988, 1, 18));
      });
      it('sets default values and cast them on construction', function() {
        const doc = new Default();
        assert.instanceOf(doc.one, DefaultNested);
        assert.instanceOf(doc.many[0], DefaultNested);
        assert.deepEqual(doc.one.string, '321');
        assert.deepEqual(doc.one.number, 123);
        assert.deepEqual(doc.one.boolean, true);
        assert.deepEqual(doc.one.date, new Date(1988, 1, 18));
      });
    });
  });
});