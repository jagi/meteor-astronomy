import resolveValues from '../../fields/utils/resolveValues';
import { replaceTypes, replaceMongoAtomWithMeteor } from './replace_types';

function wrapTransform(args = {}) {
  const {
    Class,
    transform
  } = args;
  return function(rawDoc) {
    const resolvedValues = resolveValues({
      Class,
      rawDoc
    });
    resolvedValues._isNew = false;
    resolvedValues.rawDoc = replaceTypes(resolvedValues.rawDoc, replaceMongoAtomWithMeteor);
    return transform(resolvedValues);
  }
}

export default wrapTransform;
