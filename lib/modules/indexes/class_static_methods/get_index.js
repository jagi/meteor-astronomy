function getIndex(indexName) {
	return this.schema.indexes[indexName];
};

export default getIndex;