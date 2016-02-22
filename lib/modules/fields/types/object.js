import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.register({
	class: Object,
	validate(args) {
		Validators.object(args);
	}
});