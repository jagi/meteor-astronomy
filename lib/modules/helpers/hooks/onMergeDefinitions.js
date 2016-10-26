import {
  each
}
from 'lodash';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  each(sourceDefinition.helpers, function(helper, helperName) {
    targetDefinition.helpers[helperName] = helper;
  });
};

export default onMergeDefinitions;