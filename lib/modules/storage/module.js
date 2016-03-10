import Module from '../../core/module.js';
// Utils.
import throwIfSelectorIsNotId from './utils/throw_if_selector_is_not_id.js';
import isModified from './utils/is_modified.js';
import getModified from './utils/get_modified.js';
import getModifier from './utils/get_modifier.js';
import applyModifier from './utils/apply_modifier.js';
import transformToClass from './utils/transform_to_class.js';
import documentInsert from './utils/document_insert.js';
import documentUpdate from './utils/document_update.js';
import documentRemove from './utils/document_remove.js';
import classInsert from './utils/class_insert.js';
import classUpdate from './utils/class_update.js';
import classRemove from './utils/class_remove.js';

import triggerBeforeSave from './utils/trigger_before_save.js';
import triggerBeforeInsert from './utils/trigger_before_insert.js';
import triggerBeforeUpdate from './utils/trigger_before_update.js';
import triggerBeforeRemove from './utils/trigger_before_remove.js';
import triggerAfterSave from './utils/trigger_after_save.js';
import triggerAfterInsert from './utils/trigger_after_insert.js';
import triggerAfterUpdate from './utils/trigger_after_update.js';
import triggerAfterRemove from './utils/trigger_after_remove.js';
// Hooks.
import onInitSchema from './hooks/init_schema.js';
import onInitDefinition from './hooks/init_definition.js';
import onParseDefinition from './hooks/parse_definition.js';
import onMergeDefinitions from './hooks/merge_definitions.js';
import onApplyDefinition from './hooks/apply_definition.js';
import onInitClass from './hooks/init_class.js';

Module.create({
  name: 'storage',
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass,
  utils: {
    throwIfSelectorIsNotId,
    isModified,
    getModified,
    getModifier,
    applyModifier,
    transformToClass,
    documentInsert,
    documentUpdate,
    documentRemove,
    classInsert,
    classUpdate,
    classRemove,
    triggerBeforeSave,
    triggerBeforeInsert,
    triggerBeforeUpdate,
    triggerBeforeRemove,
    triggerAfterSave,
    triggerAfterInsert,
    triggerAfterUpdate,
    triggerAfterRemove
  }
});