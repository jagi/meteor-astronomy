import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.register({
	class: Number,
	validate(args) {
		Validators.number(args);
	}
});