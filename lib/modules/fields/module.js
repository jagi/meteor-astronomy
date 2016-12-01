import Module from '../../core/module.js';
// Types.
import './types/boolean.js';
import './types/date.js';
import './types/mongo_object_id.js';
import './types/number.js';
import './types/object.js';
import './types/string.js';
// Utils.
import castNested from './utils/castNested';
import getAll from './utils/getAll';
import getMany from './utils/getMany';
import getOne from './utils/getOne';
import isNestedFieldName from './utils/isNestedFieldName';
import rawAll from './utils/rawAll';
import rawMany from './utils/rawMany';
import rawOne from './utils/rawOne';
import setAll from './utils/set_all.js';
import setMany from './utils/set_many.js';
import setOne from './utils/set_one.js';
import traverse from './utils/traverse.js';
// Hooks.
import onInitSchema from './hooks/init_schema.js';
import onInitDefinition from './hooks/init_definition.js';
import onParseDefinition from './hooks/parse_definition.js';
import onMergeDefinitions from './hooks/merge_definitions.js';
import onApplyDefinition from './hooks/apply_definition.js';
import onInitClass from './hooks/init_class.js';

Module.create({
  name: 'fields',
  onInitSchema,
  onInitDefinition,
  onParseDefinition,
  onMergeDefinitions,
  onApplyDefinition,
  onInitClass,
  utils: {
    castNested,
    getAll,
    getMany,
    getOne,
    isNestedFieldName,
    rawAll,
    rawMany,
    rawOne,
    setAll,
    setMany,
    setOne,
    traverse
  }
});