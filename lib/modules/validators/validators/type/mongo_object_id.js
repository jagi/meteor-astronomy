import Validator from '../../validator.js';
import { Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

Validator.create({
  name: 'mongoObjectID',
  isValid({ value }) {
    return Match.test(value, Mongo.ObjectID);;
  },
  resolveError({ name }) {
    return `"${name}" has to be a Mongo.ObjectID`;
  }
});