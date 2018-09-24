import Module from '../../core/module.js';
// Hooks.
import onInitSchema from './hooks/onInitSchema.js';
import onInitDefinition from './hooks/onInitDefinition.js';
import onParseDefinition from './hooks/onParseDefinition.js';
import onMergeDefinitions from './hooks/onMergeDefinitions.js';
import onApplyDefinition from './hooks/onApplyDefinition.js';
import onInitClass from './hooks/onInitClass.js';

Module.create({
  name: 'methods',
  aliases: ['helpers'],
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass
});