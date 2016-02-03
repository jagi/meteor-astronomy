Package.describe({
	summary: 'Model layer for Meteor',
	version: '2.0.0-rc.2',
	name: 'jagi:astronomy',
	git: 'https://github.com/jagi/meteor-astronomy.git'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.1');

	api.use('jagi:reactive-map@2.0.0');
	api.use('stevezhu:lodash@3.10.1');
	api.use('ecmascript');
	api.use('es5-shim');
	api.use('mongo');
	api.use('minimongo');
	api.use('ejson');
	api.use('check');

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
		// Utils.
		'lib/core/utils/utils.js',
		'lib/core/utils/override_method.js',
		'lib/core/utils/throw_parse_error.js',
		'lib/core/utils/warn.js',
		'lib/core/utils/wrap_callback.js',
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
		'lib/modules/storage/utils/get_modified.js',
		'lib/modules/storage/utils/apply_modifier.js',
		'lib/modules/storage/utils/transform_to_class.js',
		'lib/modules/storage/utils/document_insert.js',
		'lib/modules/storage/utils/document_update.js',
		'lib/modules/storage/utils/document_remove.js',
		'lib/modules/storage/utils/class_insert.js',
		'lib/modules/storage/utils/class_update.js',
		'lib/modules/storage/utils/class_remove.js',
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
		'lib/modules/storage/class_static_methods/find.js',
		'lib/modules/storage/class_static_methods/insert.js',
		'lib/modules/storage/class_static_methods/update.js',
		'lib/modules/storage/class_static_methods/remove.js',
		// Meteor methods.
		'lib/modules/storage/meteor_methods/meteor_methods.js',
		'lib/modules/storage/meteor_methods/insert.js',
		'lib/modules/storage/meteor_methods/update.js',
		'lib/modules/storage/meteor_methods/remove.js',
		// Class Events.
		'lib/modules/storage/class_events/class_events.js',
		'lib/modules/storage/class_events/before_init.js',
		'lib/modules/storage/class_events/after_init.js',
		'lib/modules/storage/class_events/from_json_value.js',
		'lib/modules/storage/class_events/to_json_value.js',
		// Hooks.
		'lib/modules/storage/hooks/init_schema.js',
		'lib/modules/storage/hooks/init_definition.js',
		'lib/modules/storage/hooks/parse_definition.js',
		'lib/modules/storage/hooks/merge_definitions.js',
		'lib/modules/storage/hooks/apply_definition.js',
		'lib/modules/storage/hooks/init_class.js'
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
		'lib/modules/behaviors/hooks/init_schema.js',
		'lib/modules/behaviors/hooks/init_definition.js',
		'lib/modules/behaviors/hooks/parse_definition.js',
		'lib/modules/behaviors/hooks/merge_definitions.js',
		'lib/modules/behaviors/hooks/apply_definition.js',
		'lib/modules/behaviors/hooks/init_class.js'
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
		// Hooks.
		'lib/modules/events/hooks/init_schema.js',
		'lib/modules/events/hooks/init_definition.js',
		'lib/modules/events/hooks/parse_definition.js',
		'lib/modules/events/hooks/merge_definitions.js',
		'lib/modules/events/hooks/apply_definition.js',
		'lib/modules/events/hooks/init_class.js'
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
		'lib/modules/methods/hooks/init_schema.js',
		'lib/modules/methods/hooks/init_definition.js',
		'lib/modules/methods/hooks/parse_definition.js',
		'lib/modules/methods/hooks/merge_definitions.js',
		'lib/modules/methods/hooks/apply_definition.js',
		'lib/modules/methods/hooks/init_class.js'
	], ['client', 'server']);

	// Fields module.
	api.addFiles([
		'lib/modules/fields/module.js',
		// Utils.
		'lib/modules/fields/utils/utils.js',
		'lib/modules/fields/utils/is_nested_pattern.js',
		'lib/modules/fields/utils/traverse.js',
		'lib/modules/fields/utils/cast_nested.js',
		'lib/modules/fields/utils/get_one.js',
		'lib/modules/fields/utils/get_many.js',
		'lib/modules/fields/utils/get_all.js',
		'lib/modules/fields/utils/raw_one.js',
		'lib/modules/fields/utils/raw_many.js',
		'lib/modules/fields/utils/raw_all.js',
		'lib/modules/fields/utils/set_one.js',
		'lib/modules/fields/utils/set_many.js',
		'lib/modules/fields/utils/set_all.js',
		// Class prototype methods.
		'lib/modules/fields/class_prototype_methods/class_prototype_methods.js',
		'lib/modules/fields/class_prototype_methods/get.js',
		'lib/modules/fields/class_prototype_methods/raw.js',
		'lib/modules/fields/class_prototype_methods/set.js',
		// Static class methods.
		'lib/modules/fields/class_static_methods/class_static_methods.js',
		'lib/modules/fields/class_static_methods/get_field.js',
		'lib/modules/fields/class_static_methods/get_fields_names.js',
		'lib/modules/fields/class_static_methods/get_fields.js',
		'lib/modules/fields/class_static_methods/get_object_fields.js',
		'lib/modules/fields/class_static_methods/get_list_fields.js',
		'lib/modules/fields/class_static_methods/has_field.js',
		// Class events.
		'lib/modules/fields/class_events/class_events.js',
		'lib/modules/fields/class_events/from_json_value.js',
		'lib/modules/fields/class_events/to_json_value.js',
		// Fields.
		'lib/modules/fields/fields/field.js',
		'lib/modules/fields/fields/scalar_field.js',
		'lib/modules/fields/fields/object_field.js',
		'lib/modules/fields/fields/list_field.js',
		// Types.
		'lib/modules/fields/types/type.js',
		'lib/modules/fields/types/types.js',
		'lib/modules/fields/types/boolean.js',
		'lib/modules/fields/types/date.js',
		'lib/modules/fields/types/number.js',
		'lib/modules/fields/types/object.js',
		'lib/modules/fields/types/string.js',
		// Hooks.
		'lib/modules/fields/hooks/init_schema.js',
		'lib/modules/fields/hooks/init_definition.js',
		'lib/modules/fields/hooks/parse_definition.js',
		'lib/modules/fields/hooks/merge_definitions.js',
		'lib/modules/fields/hooks/apply_definition.js',
		'lib/modules/fields/hooks/init_class.js'
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
		'lib/modules/indexes/hooks/init_schema.js',
		'lib/modules/indexes/hooks/init_definition.js',
		'lib/modules/indexes/hooks/parse_definition.js',
		'lib/modules/indexes/hooks/merge_definitions.js',
		'lib/modules/indexes/hooks/apply_definition.js',
		'lib/modules/indexes/hooks/init_class.js'
	], 'server');

	// Validators module.
	api.addFiles([
		'lib/modules/validators/module.js',
		// Utils.
		'lib/modules/validators/utils/utils.js',
		'lib/modules/validators/utils/document_validate.js',
		'lib/modules/validators/utils/parse_validators.js',
		// Class prototype methods.
		'lib/modules/validators/class_prototype_methods/class_prototype_methods.js',
		'lib/modules/validators/class_prototype_methods/validate.js',
		'lib/modules/validators/class_prototype_methods/add_error.js',
		'lib/modules/validators/class_prototype_methods/get_error.js',
		'lib/modules/validators/class_prototype_methods/get_errors.js',
		'lib/modules/validators/class_prototype_methods/has_error.js',
		// Static class methods.
		'lib/modules/validators/class_static_methods/class_static_methods.js',
		'lib/modules/validators/class_static_methods/get_resolve_error.js',
		'lib/modules/validators/class_static_methods/get_validation_order.js',
		'lib/modules/validators/class_static_methods/get_validators.js',
		// Meteor methods.
		'lib/modules/validators/meteor_methods/meteor_methods.js',
		'lib/modules/validators/meteor_methods/document_validate.js',
		// Class events.
		'lib/modules/validators/class_events/class_events.js',
		'lib/modules/validators/class_events/before_init.js',
		// Global.
		'lib/modules/validators/global/validation_error.js',
		// Validators.
		'lib/modules/validators/validators/validator.js',
		'lib/modules/validators/validators/validators.js',
		'lib/modules/validators/validators/comparison/choice.js',
		'lib/modules/validators/validators/comparison/equal.js',
		'lib/modules/validators/validators/comparison/regexp.js',
		'lib/modules/validators/validators/existence/empty.js',
		'lib/modules/validators/validators/existence/required.js',
		'lib/modules/validators/validators/logical/and.js',
		'lib/modules/validators/validators/logical/or.js',
		'lib/modules/validators/validators/size/gt.js',
		'lib/modules/validators/validators/size/gte.js',
		'lib/modules/validators/validators/size/length.js',
		'lib/modules/validators/validators/size/lt.js',
		'lib/modules/validators/validators/size/lte.js',
		'lib/modules/validators/validators/size/max_length.js',
		'lib/modules/validators/validators/size/min_length.js',
		'lib/modules/validators/validators/type/array.js',
		'lib/modules/validators/validators/type/boolean.js',
		'lib/modules/validators/validators/type/class.js',
		'lib/modules/validators/validators/type/date.js',
		'lib/modules/validators/validators/type/number.js',
		'lib/modules/validators/validators/type/object.js',
		'lib/modules/validators/validators/type/string.js',
		// Hooks.
		'lib/modules/validators/hooks/init_schema.js',
		'lib/modules/validators/hooks/init_definition.js',
		'lib/modules/validators/hooks/parse_definition.js',
		'lib/modules/validators/hooks/merge_definitions.js',
		'lib/modules/validators/hooks/apply_definition.js',
		'lib/modules/validators/hooks/init_class.js',
		// Init.
		'lib/modules/validators/init.js'
	], ['client', 'server']);

	api.export(['Astro', 'Validators'], ['client', 'server']);
});

////////////////////////////////////////////////////////////////////////////////

Package.onTest(function(api) {
	api.use([
		'tinytest',
		'insecure',
		'ecmascript',
		'es5-shim',
		'jagi:astronomy@2.0.0-rc.2',
		// 'jagi:astronomy-timestamp-behavior',
		// 'jagi:astronomy-slug-behavior',
		// 'jagi:astronomy-softremove-behavior',
		// 'jagi:astronomy-validators',
		// 'jagi:astronomy-simple-validators'
	]);

	api.addFiles('test/utils.js', ['client', 'server']);
	// Core.
	api.addFiles([
		'test/core/inherit.js',
		'test/core/extend.js',
		'test/core/state.js',
		'test/core/ejson.js'
	], ['client', 'server']);
	// Storage
	api.addFiles([
		'test/storage/init.js',
		'test/storage/transform.js',
		'test/storage/document_insert.js',
		'test/storage/document_update.js',
		'test/storage/document_remove.js',
		'test/storage/class_insert.js',
		'test/storage/class_update.js',
		// 'test/storage/class_upsert.js',
		// 'test/fields/modified.js',
		'test/storage/class_remove.js',
		'test/storage/reload.js',
		'test/storage/copy.js'
	], ['client', 'server']);
	// Events.
	api.addFiles([
		'test/events/order.js',
		'test/events/propagation.js',
		'test/events/cancelable.js'
	], ['client', 'server']);
	// Fields.
	api.addFiles([
		'test/fields/definition.js',
		'test/fields/default.js',
		'test/fields/set.js',
		'test/fields/get.js',
		'test/fields/raw.js'
	], ['client', 'server']);
	// Indexes.
	api.addFiles([
		// 'test/indexes/indexes_definition.js'
	], 'server');
	// Methods.
	api.addFiles([
		// 'test/methods/methods_definition.js'
	], ['client', 'server']);
	// Modules.
	api.addFiles([
		// // Validators
		// 'test/modules/validators_validate_single.js',
		// 'test/modules/validators_validate_multiple.js',
		// 'test/modules/validators_order.js',
		// // Simple Validators.
		// 'test/modules/simple_validators_parser.js'
	], ['client', 'server']);
	// Behaviors.
	api.addFiles([
		// 'test/behaviors/behaviors_timestamp.js',
		// 'test/behaviors/behaviors_slug.js',
		// 'test/behaviors/behaviors_softremove.js'
	], ['client', 'server']);
});