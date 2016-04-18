import _ from 'lodash';

function getFields() {
	return _.values(this.schema.fields);
};

export default getFields;