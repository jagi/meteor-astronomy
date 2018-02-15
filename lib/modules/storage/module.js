import Module from "../../core/module.js";
// Utils.
import applyModifier from "./utils/apply_modifier.js";
import callMeteorMethod from "./utils/call_meteor_method.js";
import classInsert from "./utils/class_insert.js";
import classUpdate from "./utils/class_update.js";
import classRemove from "./utils/class_remove.js";
import documentInsert from "./utils/document_insert.js";
import documentUpdate from "./utils/document_update.js";
import documentRemove from "./utils/document_remove.js";
import getModified from "./utils/getModified";
import getModifier from "./utils/getModifier";
import hasMeteorMethod from "./utils/has_meteor_method.js";
import isModified from "./utils/isModified";
import isRemote from "./utils/is_remote.js";
import omitUndefined from "./utils/omit_undefined.js";
import throwIfSelectorIsNotId from "./utils/throw_if_selector_is_not_id.js";
import transformToClass from "./utils/transformToClass";
import triggerBeforeSave from "./utils/trigger_before_save.js";
import triggerBeforeInsert from "./utils/trigger_before_insert.js";
import triggerBeforeUpdate from "./utils/trigger_before_update.js";
import triggerBeforeRemove from "./utils/trigger_before_remove.js";
import triggerAfterSave from "./utils/trigger_after_save.js";
import triggerAfterInsert from "./utils/trigger_after_insert.js";
import triggerAfterUpdate from "./utils/trigger_after_update.js";
import triggerAfterRemove from "./utils/trigger_after_remove.js";
import wrapTransform from "./utils/wrapTransform.js";
// Hooks.
import onInitSchema from "./hooks/init_schema.js";
import onInitDefinition from "./hooks/init_definition.js";
import onParseDefinition from "./hooks/parse_definition.js";
import onMergeDefinitions from "./hooks/merge_definitions.js";
import onApplyDefinition from "./hooks/apply_definition.js";
import onInitClass from "./hooks/init_class.js";

Module.create({
  name: "storage",
  onInitSchema: onInitSchema,
  onInitDefinition: onInitDefinition,
  onParseDefinition: onParseDefinition,
  onMergeDefinitions: onMergeDefinitions,
  onApplyDefinition: onApplyDefinition,
  onInitClass: onInitClass,
  utils: {
    applyModifier,
    callMeteorMethod,
    classInsert,
    classUpdate,
    classRemove,
    documentInsert,
    documentUpdate,
    documentRemove,
    getModified,
    getModifier,
    hasMeteorMethod,
    isModified,
    isRemote,
    omitUndefined,
    throwIfSelectorIsNotId,
    transformToClass,
    triggerBeforeSave,
    triggerBeforeInsert,
    triggerBeforeUpdate,
    triggerBeforeRemove,
    triggerAfterSave,
    triggerAfterInsert,
    triggerAfterUpdate,
    triggerAfterRemove,
    wrapTransform
  }
});
