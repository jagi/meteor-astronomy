function copy(save) {
	let doc = this;
	save = save || false;

	// Use EJSON to clone object.
	let copy = EJSON.clone(doc);

	// Remove the "_id" value and set the "_isNew" flag to false so that it will
	// save the object as a new document instead updating the old one.
	copy._id = null;
	copy._isNew = true;

	if (save) {
		copy.save();
	}

	return copy;
};

export default copy;