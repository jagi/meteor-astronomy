import classInsert from '../utils/class_insert.js';
import { check, Match } from 'meteor/check';

function insert(args) {
  check(args, Match.Any);

  return classInsert(args);
};

export default insert;