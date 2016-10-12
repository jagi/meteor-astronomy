import classRemove from '../utils/class_remove.js';
import { check, Match } from 'meteor/check';

function remove(args) {
  check(args, Match.Any);

  return classRemove(args);
};

export default remove;