import has from 'lodash/has';

function hasIndex(indexName) {
	return has(this.schema.indexes, indexName);
};

export default hasIndex;