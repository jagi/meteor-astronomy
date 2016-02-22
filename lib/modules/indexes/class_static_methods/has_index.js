function hasIndex(indexName) {
	return _.has(this.schema.indexes, indexName);
};

export default hasIndex;