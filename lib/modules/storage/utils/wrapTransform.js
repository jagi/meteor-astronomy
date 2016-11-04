import resolveValues from '../../fields/utils/resolveValues';

function wrapTransform(args = {}) {
  const {
    Class,
    transform
  } = args;
  return function(rawDoc) {
    return transform(resolveValues({
      Class,
      rawDoc
    }));
  }
}

export default wrapTransform;