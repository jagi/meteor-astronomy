Tinytest.add('Core - Transform', function(test) {
  Transforms = new Mongo.Collection(null);
  FunctionTransforms = new Mongo.Collection(null);
  MultiTransforms = new Mongo.Collection(null);

  // Remove all previously stored documents.
  Transforms.find({}, {
    transform: null
  }).forEach(function(item) {
    Transforms.remove(item._id);
  });
  FunctionTransforms.find({}, {
    transform: null
  }).forEach(function(item) {
    FunctionTransforms.remove(item._id);
  });
  MultiTransforms.find({}, {
    transform: null
  }).forEach(function(item) {
    MultiTransforms.remove(item._id);
  });

  Transform = Astro.Class({
    name: 'Transform',
    collection: Transforms,
    fields: {
      name: 'string'
    }
  });

  CustomClass = function(attrs) {
    this.name = attrs.name;
  };
  FunctionTransform = Astro.Class({
    name: 'FunctionTransform',
    collection: FunctionTransforms,
    transform: function(attrs) {
      return new CustomClass(attrs);
    },
    fields: {
      name: 'string'
    }
  });

  MultiATransform = Astro.Class({
    name: 'MultiATransform',
    collection: MultiTransforms,
    typeField: 'type',
    fields: {
      name: 'string'
    }
  });
  MultiBTransform = Astro.Class({
    name: 'MultiBTransform',
    collection: MultiTransforms,
    typeField: 'type',
    fields: {
      name: 'string'
    }
  });

  var transform = new Transform({
    name: 'abc'
  });
  transform.save();
  test.instanceOf(Transforms.findOne(), Transform,
    'The document fetched from the "Transforms" collection should be an ' +
    'instance of the "Transform" class'
  );

  var functionTransform = new FunctionTransform({
    name: 'abc'
  });
  functionTransform.save();
  test.instanceOf(FunctionTransforms.findOne(), CustomClass,
    'The document fetched from the "FunctionTransforms" collection should be ' +
    'an instance of the "CustomClass" class'
  );

  var multiATransform = new MultiATransform({
    name: 'a'
  });
  multiATransform.save();
  var multiBTransform = new MultiBTransform({
    name: 'b'
  });
  multiBTransform.save();
  test.instanceOf(MultiTransforms.findOne({name: 'a'}), MultiATransform,
    'The first document fetched from the "MultiTransforms" collection ' +
    'should be an instance of the "MultiATransform" class'
  );
  test.instanceOf(MultiTransforms.findOne({name: 'b'}), MultiBTransform,
    'The second document fetched from the "MultiTransforms" collection ' +
    'should be an instance of the "MultiBTransform" class'
  );
  test.isNotNull(MultiATransform.getField('type'),
    'The "MultiATransform" class should have the "type" field'
  );
  test.isNotNull(MultiBTransform.getField('type'),
    'The "MultiBTransform" class should have the "type" field'
  );
});
