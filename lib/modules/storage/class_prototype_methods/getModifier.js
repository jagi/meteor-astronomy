import utilGetModifier from '../utils/getModifier';

function getModifier() {
  let doc = this;

  return utilGetModifier({
    doc
  });
};

export default getModifier;