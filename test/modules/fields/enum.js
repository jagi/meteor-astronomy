import { assert } from 'meteor/practicalmeteor:chai';
import { Class, Enum } from 'meteor/jagi:astronomy';

const StatusA = Enum.create({
  name: 'StatusA',
  identifiers: ['ACTIVE', 'INACTIVE']
});

const StatusB = Enum.create({
  name: 'StatusB',
  identifiers: {
    ONE: 1,
    FOUR: 4
  }
});

const StatusC = Enum.create({
  name: 'StatusC',
  identifiers: {
    ZERO: null,
    ONE: null,
    STRING: 'string',
    BOOLEAN: true
  }
});

describe('Module', function() {
  describe('Fields', function() {
    describe('Enum', function() {
      it('has identifiers being consecutive numbers', function() {
        assert.deepEqual(StatusA.ACTIVE, 0);
        assert.deepEqual(StatusA.INACTIVE, 1);
      });
      it('has identifiers being non-consecutive numbers', function() {
        assert.deepEqual(StatusB.ONE, 1);
        assert.deepEqual(StatusB.FOUR, 4);
      });
      it('has identifiers being non-numbers', function() {
        assert.deepEqual(StatusC.ZERO, 0);
        assert.deepEqual(StatusC.ONE, 1);
        assert.deepEqual(StatusC.STRING, 'string');
        assert.deepEqual(StatusC.BOOLEAN, true);
      });
    });
  });
});