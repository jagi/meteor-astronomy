import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.register({
	class: Date,
	validate(args) {
		Validators.date(args);
	}
});