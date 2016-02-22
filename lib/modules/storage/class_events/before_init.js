function beforeInit(e) {
	let doc = e.currentTarget;

	// Create the "_isNew" property to indicate if a document had been
	// stored in a database. A default value of this property is set
	// to false. Astronomy can modify this property and it can not appear
	// in the list of the object properties.
	if (Object.defineProperty) {
		Object.defineProperty(doc, '_isNew', {
			writable: true,
			enumerable: false
		});
	}
	doc._isNew = true;
};

export default beforeInit;