import Type from '../type.js';
import Validators from '../../validators/validators.js';
import { Mongo } from 'meteor/mongo';

Type.create({
  name: 'MongoObjectID',
  class: Mongo.ObjectID,
  validate(args) {
    Validators.mongoObjectID(args);
  }
});