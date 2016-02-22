import Module from '../../core/module.js';
// Hooks.
import onInitSchema from './hooks/init_schema.js';
import onInitDefinition from './hooks/init_definition.js';
import onParseDefinition from './hooks/parse_definition.js';
import onMergeDefinitions from './hooks/merge_definitions.js';
import onApplyDefinition from './hooks/apply_definition.js';
import onInitClass from './hooks/init_class.js';

Module.create({
	name: 'methods',
	onInitSchema: onInitSchema,
	onInitDefinition: onInitDefinition,
	onParseDefinition: onParseDefinition,
	onMergeDefinitions: onMergeDefinitions,
	onApplyDefinition: onApplyDefinition,
	onInitClass: onInitClass
});