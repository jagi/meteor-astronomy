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
    'lib/modules/core/global.js',
    'lib/modules/core/errors.js',
    'lib/modules/core/utils.js',
    'lib/modules/core/events.js',
    'lib/modules/core/event.js',
    'lib/modules/core/base_class.js',
    'lib/modules/core/schema.js',
    'lib/modules/core/classes.js'
  ], ['client', 'server']);

  // Events module.
  api.addFiles([
    'lib/modules/events/init_module.js',
    'lib/modules/events/init_class.js'
  ], ['client', 'server']);

  // Types module.
  api.addFiles([
    'lib/modules/types/type_definition.js',
    'lib/modules/types/init_module.js',
    'lib/modules/types/types.js'
  ], ['client', 'server']);

  // Indexes module.
  api.addFiles([
    'lib/modules/indexes/errors.js',
    'lib/modules/indexes/init_class.js'
  ], 'server');

  // EJSON module.
  api.addFiles('lib/modules/ejson/init_module.js', ['client', 'server']);

  // Methods module.
  api.addFiles([
    'lib/modules/methods/init_class.js'
  ], ['client', 'server']);

  // Fields module.
  api.addFiles([
    'lib/modules/fields/errors.js',
    'lib/modules/fields/utils.js',
    'lib/modules/fields/field_definition.js',
    'lib/modules/fields/init_module.js',
    'lib/modules/fields/init_schema.js',
    'lib/modules/fields/init_class.js'
  ], ['client', 'server']);

  // Embed module.
  api.addFiles([
    'lib/modules/embed/embed_one_field.js',
    'lib/modules/embed/embed_many_field.js',
    'lib/modules/embed/init_class.js'
  ], ['client', 'server']);

  // Storage module.
  api.addFiles([
    'lib/modules/storage/init_class.js',
    'lib/modules/storage/init_schema.js'
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
    'test/core_inheritance.js'
  ], ['client', 'server']);
  // Storage
  api.addFiles([
    'test/storage_init.js',
    'test/storage_insert.js',
    'test/storage_update.js',
    'test/storage_remove.js',
    'test/storage_reload.js',
    'test/storage_cloning.js'
  ], ['client', 'server']);
  // EJSON.
  api.addFiles([
    'test/ejson_init.js',
    'test/ejson_parsing.js'
  ], ['client', 'server']);
  // Events.
  api.addFiles([
    'test/events_order.js',
    'test/events_propagation.js',
    'test/events_default.js'
  ], ['client', 'server']);
  // Fields.
  api.addFiles([
    'test/fields_init.js',
    'test/fields_definition.js',
    'test/fields_default.js',
    'test/fields_setters.js',
    'test/fields_getters.js',
    'test/fields_modified.js'
  ], ['client', 'server']);
  // Types.
  api.addFiles('test/types_casting.js', ['client', 'server']);
  // Indexes.
  api.addFiles('test/indexes_init.js', 'server');
  // Methods.
  api.addFiles([
    'test/methods_init.js',
    'test/methods_definition.js'
  ], ['client', 'server']);
  // Validators.
  api.addFiles([
    'test/validators_init.js',
    'test/validators_validate_single.js',
    'test/validators_validate_multiple.js',
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
