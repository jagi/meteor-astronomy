import _has from 'lodash/has';

function hasIndex(indexName) {
	return _has(this.schema.indexes, indexName);
};

export default hasIndex;