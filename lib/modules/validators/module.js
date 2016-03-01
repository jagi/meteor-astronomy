import Module from '../../core/module.js';
// Validators.
import './validators/comparison/choice.js';
import './validators/comparison/email.js';
import './validators/comparison/equal.js';
import './validators/comparison/not_equal.js';
import './validators/comparison/regexp.js';
import './validators/existence/empty.js';
import './validators/existence/not_empty.js';
import './validators/existence/required.js';
import './validators/logical/and.js';
import './validators/logical/or.js';
import './validators/size/gt.js';
import './validators/size/gte.js';
import './validators/size/length.js';
import './validators/size/lt.js';
import './validators/size/lte.js';
import './validators/size/max_length.js';
import './validators/size/min_length.js';
import './validators/type/array.js';
import './validators/type/boolean.js';
import './validators/type/class.js';
import './validators/type/date.js';
import './validators/type/number.js';
import './validators/type/object.js';
import './validators/type/string.js';
// Utils.
import documentValidate from './utils/document_validate.js';
import parseValidators from './utils/parse_validators.js';
// Hooks.
import onInitSchema from './hooks/init_schema.js';
import onInitDefinition from './hooks/init_definition.js';
import onParseDefinition from './hooks/parse_definition.js';
import onMergeDefinitions from './hooks/merge_definitions.js';
import onApplyDefinition from './hooks/apply_definition.js';
import onInitClass from './hooks/init_class.js';

Module.create({
	name: 'validators',
	onInitSchema: onInitSchema,
	onInitDefinition: onInitDefinition,
	onParseDefinition: onParseDefinition,
	onMergeDefinitions: onMergeDefinitions,
	onApplyDefinition: onApplyDefinition,
	onInitClass: onInitClass,
	utils: {
		documentValidate: documentValidate,
		parseValidators: parseValidators
	}
});