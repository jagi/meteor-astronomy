import _extend from 'lodash/extend';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Storage - Transform', function(test) {
  const Transforms = new Mongo.Collection(null);

  // Insert a document.
  Transforms.insert({
    name: 'name',
  });

  // Default transform function.
  const DefaultTransform = Class.create({
    name: 'DefaultTransform',
    collection: Transforms,
    fields: {
      name: {
        type: String
      }
    }
  });

  // Custom transform function.
  const CustomClass = class {
    constructor(values) {
      _extend(this, values);
    }
  };
  const CustomTransform = Class.create({
    name: 'CustomTransform',
    collection: Transforms,
    transform: function(values) {
      return new CustomClass(values);
    },
    fields: {
      name: {
        type: String
      }
    }
  });

  // No transform function.
  const NoTransform = Class.create({
    name: 'NoTransform',
    collection: Transforms,
    transform: null,
    fields: {
      name: {
        type: String
      }
    }
  });

  test.instanceOf(DefaultTransform.findOne(), DefaultTransform,
    'Default transform function should be applied to the fetched documents'
  );
  test.instanceOf(CustomTransform.findOne(), CustomClass,
    'Custom transform function should be applied to the fetched documents'
  );
  test.equal(NoTransform.findOne().constructor, Object,
    'No transform function should be applied to the fetched documents'
  );
});