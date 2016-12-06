import resolveValues from '../../fields/utils/resolveValues';

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
    return transform(resolvedValues);
  }
}

export default wrapTransform;