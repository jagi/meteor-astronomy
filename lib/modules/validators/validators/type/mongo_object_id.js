import Validator from '../../validator.js';
import { Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

Validator.create({
  name: 'mongoObjectID',
  isValid({ value }) {
    if (value !== undefined && value !== null) {
      return Match.test(value, Mongo.ObjectID);;
    }
    return true;
  },
  resolveError({ name }) {
    return `"${name}" has to be a Mongo.ObjectID`;
  }
});