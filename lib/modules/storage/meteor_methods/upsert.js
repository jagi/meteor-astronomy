import classUpsert from '../utils/class_upsert.js';
import { check, Match } from 'meteor/check';

function upsert(args) {
  check(args, Match.Any);

  return classUpsert(args);
};

export default upsert;