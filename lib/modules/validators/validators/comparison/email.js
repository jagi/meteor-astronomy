import Validator from '../../validator.js';

// The e-mail address regular expression from http://emailregex.com/.
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

Validator.create({
  name: 'email',
  isValid({ value }) {
    return re.test(value);
  },
  resolveError({ name, param }) {
    return `"${name}" should be a valid email address`;
  }
});