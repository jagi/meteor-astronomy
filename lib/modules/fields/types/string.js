import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.register({
	class: String,
	validate(args) {
		Validators.string(args);
	}
});