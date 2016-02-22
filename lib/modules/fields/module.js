import Module from '../../core/module.js';
// Types.
import './types/boolean.js';
import './types/date.js';
import './types/number.js';
import './types/object.js';
import './types/string.js';
// Utils.
import isNestedPattern from './utils/is_nested_pattern.js';
import traverse from './utils/traverse.js';
import castNested from './utils/cast_nested.js';
import getOne from './utils/get_one.js';
import getMany from './utils/get_many.js';
import getAll from './utils/get_all.js';
import rawOne from './utils/raw_one.js';
import rawMany from './utils/raw_many.js';
import rawAll from './utils/raw_all.js';
import setOne from './utils/set_one.js';
import setMany from './utils/set_many.js';
import setAll from './utils/set_all.js';
// Hooks.
import onInitSchema from './hooks/init_schema.js';
import onInitDefinition from './hooks/init_definition.js';
import onParseDefinition from './hooks/parse_definition.js';
import onMergeDefinitions from './hooks/merge_definitions.js';
import onApplyDefinition from './hooks/apply_definition.js';
import onInitClass from './hooks/init_class.js';

Module.create({
	name: 'fields',
	onInitSchema: onInitSchema,
	onInitDefinition: onInitDefinition,
	onParseDefinition: onParseDefinition,
	onMergeDefinitions: onMergeDefinitions,
	onApplyDefinition: onApplyDefinition,
	onInitClass: onInitClass,
	utils: {
		isNestedPattern: isNestedPattern,
		traverse: traverse,
		castNested: castNested,
		getOne: getOne,
		getMany: getMany,
		getAll: getAll,
		rawOne: rawOne,
		rawMany: rawMany,
		rawAll: rawAll,
		setOne: setOne,
		setMany: setMany,
		setAll: setAll
	}
});