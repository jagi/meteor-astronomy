import AstroClass from '../../../core/class.js';
import documentInsert from './document_insert.js';

function classInsert(className, plainDoc, trusted = false) {
	let Class = AstroClass.get(className);
	let Collection = Class.getCollection();

	// Create a new document.
	let doc = new Class(plainDoc);

	// Insert a document.
	return documentInsert(doc, trusted);
};

export default classInsert;