function afterInit(e) {
	let doc = e.currentTarget;
	let Class = doc.constructor;

	doc[Class.getTypeField()] = Class.getName();
};

export default afterInit;