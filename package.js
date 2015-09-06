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
    'lib/modules/fields/global.js',

    'lib/modules/fields/base_field.js',
    'lib/modules/fields/null_field.js',
    'lib/modules/fields/string_field.js',
    'lib/modules/fields/number_field.js',
    'lib/modules/fields/boolean_field.js',
    'lib/modules/fields/date_field.js',
    'lib/modules/fields/nested_field.js',
    'lib/modules/fields/object_field.js',
    'lib/modules/fields/array_field.js',

    'lib/modules/fields/errors.js',
    'lib/modules/fields/utils.js',
    'lib/modules/fields/modifier.js',
    'lib/modules/fields/set_default.js',
    'lib/modules/fields/set.js',
    'lib/modules/fields/get_original.js',
    'lib/modules/fields/get.js',
    'lib/modules/fields/push.js',
    'lib/modules/fields/inc.js',
    'lib/modules/fields/modified.js',
    'lib/modules/fields/ejson.js',
    'lib/modules/fields/init_schema.js',
    'lib/modules/fields/init_class.js'
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
    'test/core/core_init.js',
    'test/core/core_transform.js',
    'test/core/core_inheritance.js',
    'test/core/core_state.js'
  ], ['client', 'server']);
  // Storage
  api.addFiles([
    'test/storage/storage_init.js',
    'test/storage/storage_insert.js',
    'test/storage/storage_update.js',
    'test/storage/storage_remove.js',
    'test/storage/storage_reload.js',
    'test/storage/storage_cloning.js',
    'test/storage/storage_direct_insert.js',
    'test/storage/storage_direct_update.js',
    'test/storage/storage_direct_upsert.js',
    'test/storage/storage_direct_remove.js'
  ], ['client', 'server']);
  // EJSON.
  api.addFiles([
    'test/ejson/ejson_init.js',
    'test/ejson/ejson_parsing.js'
  ], ['client', 'server']);
  // Events.
  api.addFiles([
    'test/events/events_order.js',
    'test/events/events_propagation.js',
    'test/events/events_prevent_default.js'
  ], ['client', 'server']);
  // Fields.
  api.addFiles([
    'test/fields/fields_init.js',
    'test/fields/fields_definition.js',
    'test/fields/fields_default.js',
    'test/fields/fields_casting.js',
    'test/fields/fields_setters.js',
    'test/fields/fields_getters.js',
    'test/fields/fields_modified.js',
    'test/fields/fields_push.js'
  ], ['client', 'server']);
  // Indexes.
  api.addFiles('test/indexes/indexes_init.js', 'server');
  // Methods.
  api.addFiles([
    'test/methods/methods_init.js',
    'test/methods/methods_definition.js'
  ], ['client', 'server']);
  // Modules.
  api.addFiles([
    // Validators
    'test/modules/validators_init.js',
    'test/modules/validators_validate_single.js',
    'test/modules/validators_validate_multiple.js',
    'test/modules/validators_order.js',
    // Simple Validators.
    'test/modules/simple_validators_parser.js'
  ], ['client', 'server']);
  // Behaviors.
  api.addFiles([
    'test/behaviors/behaviors_timestamp.js',
    'test/behaviors/behaviors_slug.js',
    'test/behaviors/behaviors_softremove.js'
  ], ['client', 'server']);
});
