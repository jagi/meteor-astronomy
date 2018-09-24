import {
  assert
}
from 'meteor/practicalmeteor:chai';
import {
  Class
}
from 'meteor/jagi:astronomy';
import {
  Mongo
}
from 'meteor/mongo';

describe('Module', function() {
  describe('Storage', function() {
    describe('_isNew', function() {
      const NestedItem = Class.create({
        name: 'NestedItem'
      });

      const Item = Class.create({
        name: 'Item',
        collection: new Mongo.Collection(null)
      });

      it('should have the "_isNew" property set to "true"', () => {
        const doc = new Item();
        assert.isTrue(doc._isNew);
      });
      it('should have the "_isNew" property set to "false"', () => {
        let doc = new Item();
        doc.save();
        doc = Item.findOne();
        assert.isFalse(doc._isNew);
      });
      it('should not have the "_isNew" property defined', () => {
        const doc = new NestedItem();
        assert.isUndefined(doc._isNew);
      });
    });
  });
});