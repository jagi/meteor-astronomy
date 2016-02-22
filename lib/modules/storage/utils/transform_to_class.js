import AstroClass from '../../../core/class.js';

function transformToClass(className) {
	return function(attrs) {
		var Class = AstroClass.get(className);

		if (Class) {
			var typeField = Class.getTypeField();
			if (typeField) {
				var TypeClass = AstroClass.get(attrs[typeField]);
				if (TypeClass) {
					Class = TypeClass;
				}
			}

			var doc = new Class(attrs);
			doc._isNew = false;
			return doc;
		}

		return attrs;
	};
};

export default transformToClass;