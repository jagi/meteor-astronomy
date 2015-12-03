Package.describe({
  summary: 'Model layer for Meteor',
  version: '2.0.0-rc.1',
  name: 'jagi:astronomy',
  git: 'https://github.com/jagi/meteor-astronomy.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jagi:reactive-map@2.0.0');
  api.use('mongo');
  api.use('minimongo');
  api.use('underscore');
  api.use('ejson');
  api.use('check');
  api.use('ecmascript');
  api.use('es5-shim');

  api.imply('mongo');
  api.imply('underscore');
  api.imply('ejson');
  api.imply('check');

  api.addFiles([
    'lib/core/global/astro.js',
    'lib/core/global/utils.js',
    'lib/core/global/config.js',
    'lib/core/global/ejson.js',
    'lib/core/global/non_enabled.js',
    // Astro.Module.
    'lib/core/module/module.js',
    'lib/core/module/modules.js',
    // Class.
    'lib/core/class/class.js',
    'lib/core/class/classes.js'
  ], ['client', 'server']);

  // Storage module.
  api.addFiles([
    'lib/modules/storage/module.js',
    // Utils.
    'lib/modules/storage/utils/utils.js',
    'lib/modules/storage/utils/throw_if_selector_is_not_id.js',
    'lib/modules/storage/utils/transform_to_class.js',
    // Class prototype methods.
    'lib/modules/storage/class_prototype_methods/class_prototype_methods.js',
    'lib/modules/storage/class_prototype_methods/save.js',
    'lib/modules/storage/class_prototype_methods/remove.js',
    'lib/modules/storage/class_prototype_methods/reload.js',
    'lib/modules/storage/class_prototype_methods/copy.js',
    'lib/modules/storage/class_prototype_methods/get_modified.js',
    'lib/modules/storage/class_prototype_methods/is_modified.js',
    // Static class methods.
    'lib/modules/storage/class_static_methods/class_static_methods.js',
    'lib/modules/storage/class_static_methods/get_collection.js',
    'lib/modules/storage/class_static_methods/get_type_field.js',
    'lib/modules/storage/class_static_methods/get_transform.js',
    // Collection methods.
    'lib/modules/storage/collection_methods/collection_methods.js',
    'lib/modules/storage/collection_methods/dispatch_event.js',
    'lib/modules/storage/collection_methods/find.js',
    'lib/modules/storage/collection_methods/insert.js',
    'lib/modules/storage/collection_methods/update.js',
    'lib/modules/storage/collection_methods/remove.js',
    'lib/modules/storage/collection_methods/validated_insert.js',
    'lib/modules/storage/collection_methods/validated_update.js',
    'lib/modules/storage/collection_methods/validated_remove.js',
    // Meteor methods.
    'lib/modules/storage/meteor_methods/meteor_methods.js',
    'lib/modules/storage/meteor_methods/save.js',
    // Class Events.
    'lib/modules/storage/class_events/class_events.js',
    'lib/modules/storage/class_events/before_init.js',
    'lib/modules/storage/class_events/after_init.js',
    'lib/modules/storage/class_events/from_json_value.js',
    'lib/modules/storage/class_events/to_json_value.js',
    // Hooks.
    'lib/modules/storage/module/init_schema.js',
    'lib/modules/storage/module/init_definition.js',
    'lib/modules/storage/module/parse_definition.js',
    'lib/modules/storage/module/merge_definitions.js',
    'lib/modules/storage/module/apply_definition.js',
    'lib/modules/storage/module/init_class.js'
  ], ['client', 'server']);

  // Behaviors module.
  api.addFiles([
    'lib/modules/behaviors/module.js',
    // Static class methods.
    'lib/modules/behaviors/class_static_methods/class_static_methods.js',
    'lib/modules/behaviors/class_static_methods/get_behavior.js',
    'lib/modules/behaviors/class_static_methods/get_behaviors.js',
    'lib/modules/behaviors/class_static_methods/has_behavior.js',
    // Global.
    'lib/modules/behaviors/global/behavior.js',
    'lib/modules/behaviors/global/behaviors.js',
    'lib/modules/behaviors/global/class_behavior.js',
    // Hooks.
    'lib/modules/behaviors/module/init_schema.js',
    'lib/modules/behaviors/module/init_definition.js',
    'lib/modules/behaviors/module/parse_definition.js',
    'lib/modules/behaviors/module/merge_definitions.js',
    'lib/modules/behaviors/module/apply_definition.js',
    'lib/modules/behaviors/module/init_class.js'
  ], ['client', 'server']);

  // Events module.
  api.addFiles([
    'lib/modules/events/module.js',
    // Static class methods.
    'lib/modules/events/class_static_methods/class_static_methods.js',
    'lib/modules/events/class_static_methods/get_events.js',
    'lib/modules/events/class_static_methods/has_event.js',
    // Global.
    'lib/modules/events/global/event_target.js',
    'lib/modules/events/global/event.js',
    'lib/modules/events/global/events.js',
    // Hooks.
    'lib/modules/events/module/init_schema.js',
    'lib/modules/events/module/init_definition.js',
    'lib/modules/events/module/parse_definition.js',
    'lib/modules/events/module/merge_definitions.js',
    'lib/modules/events/module/apply_definition.js',
    'lib/modules/events/module/init_class.js'
  ], ['client', 'server']);

  // Methods module.
  api.addFiles([
    'lib/modules/methods/module.js',
    // Static class methods.
    'lib/modules/methods/class_static_methods/class_static_methods.js',
    'lib/modules/methods/class_static_methods/get_method.js',
    'lib/modules/methods/class_static_methods/get_methods.js',
    'lib/modules/methods/class_static_methods/has_method.js',
    // Hooks.
    'lib/modules/methods/module/init_schema.js',
    'lib/modules/methods/module/init_definition.js',
    'lib/modules/methods/module/parse_definition.js',
    'lib/modules/methods/module/merge_definitions.js',
    'lib/modules/methods/module/apply_definition.js',
    'lib/modules/methods/module/init_class.js'
  ], ['client', 'server']);

  // Fields module.
  api.addFiles([
    'lib/modules/fields/module.js',
    // Utils.
    'lib/modules/fields/utils/utils.js',
    'lib/modules/fields/utils/is_nested_pattern.js',
    'lib/modules/fields/utils/traverse.js',
    'lib/modules/fields/utils/cast_nested.js',
    // Class prototype methods.
    'lib/modules/fields/class_prototype_methods/class_prototype_methods.js',
    'lib/modules/fields/class_prototype_methods/get_one.js',
    'lib/modules/fields/class_prototype_methods/get_many.js',
    'lib/modules/fields/class_prototype_methods/get_all.js',
    'lib/modules/fields/class_prototype_methods/get.js',
    'lib/modules/fields/class_prototype_methods/raw_one.js',
    'lib/modules/fields/class_prototype_methods/raw_many.js',
    'lib/modules/fields/class_prototype_methods/raw_all.js',
    'lib/modules/fields/class_prototype_methods/raw.js',
    'lib/modules/fields/class_prototype_methods/set_one.js',
    'lib/modules/fields/class_prototype_methods/set_many.js',
    'lib/modules/fields/class_prototype_methods/set_all.js',
    'lib/modules/fields/class_prototype_methods/set.js',
    // Static class methods.
    'lib/modules/fields/class_static_methods/class_static_methods.js',
    'lib/modules/fields/class_static_methods/get_field.js',
    'lib/modules/fields/class_static_methods/get_fields_names.js',
    'lib/modules/fields/class_static_methods/get_fields.js',
    'lib/modules/fields/class_static_methods/get_nested_fields_names.js',
    'lib/modules/fields/class_static_methods/get_nested_fields.js',
    'lib/modules/fields/class_static_methods/has_field.js',
    // Class events.
    'lib/modules/fields/class_events/class_events.js',
    'lib/modules/fields/class_events/from_json_value.js',
    'lib/modules/fields/class_events/to_json_value.js',
    // Global.
    // Global - Fields.
    'lib/modules/fields/global/fields/field.js',
    'lib/modules/fields/global/fields/nested_field.js',
    // Global - Types.
    'lib/modules/fields/global/types/type.js',
    'lib/modules/fields/global/types/types.js',
    'lib/modules/fields/global/types/boolean.js',
    'lib/modules/fields/global/types/date.js',
    'lib/modules/fields/global/types/number.js',
    'lib/modules/fields/global/types/string.js',
    // Hooks.
    'lib/modules/fields/module/init_schema.js',
    'lib/modules/fields/module/init_definition.js',
    'lib/modules/fields/module/parse_definition.js',
    'lib/modules/fields/module/merge_definitions.js',
    'lib/modules/fields/module/apply_definition.js',
    'lib/modules/fields/module/init_class.js'
  ], ['client', 'server']);

  // Indexes module.
  api.addFiles([
    'lib/modules/indexes/module.js',
    // Static class methods.
    'lib/modules/indexes/class_static_methods/class_static_methods.js',
    'lib/modules/indexes/class_static_methods/get_index.js',
    'lib/modules/indexes/class_static_methods/get_indexes.js',
    'lib/modules/indexes/class_static_methods/has_index.js',
    // Hooks.
    'lib/modules/indexes/module/init_schema.js',
    'lib/modules/indexes/module/init_definition.js',
    'lib/modules/indexes/module/parse_definition.js',
    'lib/modules/indexes/module/merge_definitions.js',
    'lib/modules/indexes/module/apply_definition.js',
    'lib/modules/indexes/module/init_class.js'
  ], 'server');

  // Validators module.
  api.addFiles([
    'lib/modules/validators/module.js',
    // Class prototype methods.
    'lib/modules/validators/class_prototype_methods/class_prototype_methods.js',
    'lib/modules/validators/class_prototype_methods/validate.js',
    'lib/modules/validators/class_prototype_methods/add_error.js',
    'lib/modules/validators/class_prototype_methods/get_error.js',
    'lib/modules/validators/class_prototype_methods/get_errors.js',
    'lib/modules/validators/class_prototype_methods/has_error.js',
    // Static class methods.
    'lib/modules/validators/class_static_methods/class_static_methods.js',
    'lib/modules/validators/class_static_methods/get_validators.js',
    // Class events.
    'lib/modules/validators/class_events/class_events.js',
    'lib/modules/validators/class_events/before_init.js',
    'lib/modules/validators/class_events/before_save.js',
    // Global.
    'lib/modules/validators/global/validation_error.js',
    // Hooks.
    'lib/modules/validators/module/init_schema.js',
    'lib/modules/validators/module/init_definition.js',
    'lib/modules/validators/module/parse_definition.js',
    'lib/modules/validators/module/merge_definitions.js',
    'lib/modules/validators/module/apply_definition.js',
    'lib/modules/validators/module/init_class.js'
  ], ['client', 'server']);

  api.export(['Astro', 'Validators'], ['client', 'server']);
});

////////////////////////////////////////////////////////////////////////////////

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
