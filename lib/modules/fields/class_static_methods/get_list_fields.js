import _ from 'lodash';

import ListField from '../ListField';

function getListFields(classOnly = false) {
  return _.filter(this.getFields(), function(field) {
    if (classOnly) {
			return field instanceof ListField && field.isClass;
		}
    return field instanceof ListField;
  });
};

export default getListFields;