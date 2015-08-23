Package.describe({
  summary: 'Model layer for Meteor',
  version: '0.12.1',
  name: 'jagi:astronomy',
  git: 'https://github.com/jagi/meteor-astronomy.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('mongo');
  api.use('minimongo');
  api.use('underscore');
  api.use('ejson');

  api.addFiles([
    'lib/core/global.js',
    'lib/core/utils.js',
    'lib/core/events.js',
    'lib/core/event.js',
    'lib/core/base_class.js',
    'lib/core/schema.js',
    'lib/core/classes.js'
  ], ['client', 'server']);

  // Events module.
  api.addFiles('lib/modules/events/init_module.js', ['client', 'server']);
  api.addFiles('lib/modules/events/init_class.js', ['client', 'server']);

  // Types module.
  api.addFiles([
    'lib/modules/types/type_definition.js',
    'lib/modules/types/init_module.js',
    'lib/modules/types/types.js'
  ], ['client', 'server']);

  // Indexes module.
  api.addFiles('lib/modules/indexes/init_class.js', ['client', 'server']);

  // EJSON module.
  api.addFiles('lib/modules/ejson/init_module.js', ['client', 'server']);

  // Methods module.
  api.addFiles([
    'lib/modules/methods/init_class.js'
  ], ['client', 'server']);

  // Fields module.
  api.addFiles('lib/modules/fields/utils.js', ['client', 'server']);
  api.addFiles('lib/modules/fields/field_definition.js', ['client', 'server']);
  api.addFiles('lib/modules/fields/init_module.js', ['client', 'server']);
  api.addFiles('lib/modules/fields/init_class.js', ['client', 'server']);

  // Embed module.
  api.addFiles([
    'lib/modules/embed/embed_one_field.js',
    'lib/modules/embed/embed_many_field.js',
    'lib/modules/embed/init_class.js'
  ], ['client', 'server']);

  // Storage module.
  api.addFiles([
    'lib/modules/storage/init_class.js'
  ], ['client', 'server']);

  api.export(['Astro', 'Astronomy'], ['client', 'server']);
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'insecure',
    'jagi:astronomy',
    'jagi:astronomy-timestamp-behavior',
    'jagi:astronomy-slug-behavior',
    'jagi:astronomy-softremove-behavior',
    'jagi:astronomy-validators',
    'jagi:astronomy-simple-validators'
  ]);

  // Core.
  api.addFiles([
    'test/core_init.js',
    'test/core_transform.js',
    'test/core_insert.js',
    'test/core_update.js',
    'test/core_remove.js'
  ], ['client', 'server']);
  // EJSON.
  api.addFiles([
    'test/ejson_init.js',
    'test/ejson_parsing.js'
  ], ['client', 'server']);
  // Events.
  api.addFiles([
    'test/events_init.js',
    'test/events_order.js'
  ], ['client', 'server']);
  // Fields.
  api.addFiles([
    'test/fields_init.js',
    'test/fields_definition.js',
    'test/fields_default.js',
    'test/fields_setters.js',
    'test/fields_getters.js'
  ], ['client', 'server']);
  // Types.
  api.addFiles('test/types_casting.js', ['client', 'server']);
  // Methods.
  api.addFiles([
    'test/methods_init.js',
    'test/methods_definition.js'
  ], ['client', 'server']);
  // Validators.
  api.addFiles([
    'test/validators_init.js',
    'test/validators_validate.js',
    'test/validators_order.js'
  ], ['client', 'server']);
  // Simple Validators.
  api.addFiles([
    'test/simple_validators_init.js',
    'test/simple_validators_parser.js'
  ], ['client', 'server']);
  // Behaviors.
  api.addFiles([
    'test/behaviors_timestamp.js',
    'test/behaviors_slug.js',
    'test/behaviors_softremove.js'
  ], ['client', 'server']);
});
