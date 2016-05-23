import _ from 'lodash';
import AstroClass from '../../../core/class.js';

function transformToClass(className, options = {}) {
  // Set default options.
  _.defaults(options, {
    defaults: true
  });

	return function(rawDoc) {
		let Class = AstroClass.get(className);

		if (Class) {
			const typeField = Class.getTypeField();
			if (typeField) {
				const TypeClass = AstroClass.get(rawDoc[typeField]);
				if (TypeClass) {
					Class = TypeClass;
				}
			}

			const doc = new Class(rawDoc, options);
			doc._isNew = false;
			return doc;
		}

		return rawDoc;
	};
};

export default transformToClass;