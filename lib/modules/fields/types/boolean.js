import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.register({
	class: Boolean,
	validate(args) {
		Validators.boolean(args);
	}
});