Package.describe({
  summary: 'Model layer for Meteor',
  version: '1.1.0',
  name: 'jagi:astronomy',
  git: 'https://github.com/jagi/meteor-astronomy.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('mongo');
  api.use('minimongo');
  api.use('underscore');
  api.use('ejson');
  api.use('check');

  api.imply('mongo');
  api.imply('underscore');
  api.imply('ejson');
  api.imply('check');

  api.addFiles([
    'lib/modules/core/global.js',
    'lib/modules/core/config.js',
    'lib/modules/core/utils.js',
    'lib/modules/core/events.js',
    'lib/modules/core/event.js',
    'lib/modules/core/event_manager.js',
    'lib/modules/core/base_class.js',
    'lib/modules/core/schema.js',
    'lib/modules/core/classes.js'
  ], ['client', 'server']);

  // Storage module.
  api.addFiles([
    'lib/modules/storage/init_class.js',
    'lib/modules/storage/init_definition.js'
  ], ['client', 'server']);

  // Behaviors module.
  api.addFiles([
    'lib/modules/behaviors/global.js',
    'lib/modules/behaviors/behavior.js',
    'lib/modules/behaviors/class_behavior.js',
    'lib/modules/behaviors/create_behavior.js',
    'lib/modules/behaviors/init_class.js',
    'lib/modules/behaviors/init_definition.js',
  ], ['client', 'server']);

  // Events module.
  api.addFiles([
    'lib/modules/events/init_class.js',
    'lib/modules/events/init_definition.js',
  ], ['client', 'server']);

  // EJSON module.
  api.addFiles('lib/modules/ejson/init_module.js', ['client', 'server']);

  // Methods module.
  api.addFiles([
    'lib/modules/methods/init_class.js',
    'lib/modules/methods/init_definition.js',
  ], ['client', 'server']);

  // Fields module.
  api.addFiles([
    'lib/modules/fields/global.js',
    'lib/modules/fields/create_type.js',
    'lib/modules/fields/base_field.js',
    'lib/modules/fields/types/null_field.js',
    'lib/modules/fields/types/string_field.js',
    'lib/modules/fields/types/number_field.js',
    'lib/modules/fields/types/boolean_field.js',
    'lib/modules/fields/types/date_field.js',
    'lib/modules/fields/types/object_field.js',
    'lib/modules/fields/types/array_field.js',
    'lib/modules/fields/utils.js',
    'lib/modules/fields/modifiers.js',
    'lib/modules/fields/set_default.js',
    'lib/modules/fields/set.js',
    'lib/modules/fields/get.js',
    'lib/modules/fields/raw.js',
    'lib/modules/fields/push.js',
    'lib/modules/fields/pop.js',
    'lib/modules/fields/pull.js',
    'lib/modules/fields/inc.js',
    'lib/modules/fields/modified.js',
    'lib/modules/fields/ejson.js',
    'lib/modules/fields/init_class.js',
    'lib/modules/fields/init_definition.js',
  ], ['client', 'server']);

  // Indexes module.
  api.addFiles([
    'lib/modules/indexes/init_class.js',
    'lib/modules/indexes/init_definition.js'
  ], 'server');

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

  api.addFiles('test/utils.js', ['client', 'server']);
  // Core.
  api.addFiles([
    'test/core/core_transform.js',
    'test/core/core_inheritance.js',
    'test/core/core_extend.js',
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
    'test/fields/fields_definition.js',
    'test/fields/fields_default.js',
    'test/fields/fields_casting.js',
    'test/fields/fields_set.js',
    'test/fields/fields_get.js',
    'test/fields/fields_raw.js',
    'test/fields/fields_push.js',
    'test/fields/fields_pop.js',
    'test/fields/fields_inc.js',
    'test/fields/fields_modified.js',
    'test/fields/fields_immutable.js',
    'test/fields/fields_transient.js'
  ], ['client', 'server']);
  // Indexes.
  api.addFiles([
    'test/indexes/indexes_definition.js'
  ], 'server');
  // Methods.
  api.addFiles([
    'test/methods/methods_definition.js'
  ], ['client', 'server']);
  // Modules.
  api.addFiles([
    // Validators
    'test/modules/validators_validate_single_nested.js',
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
