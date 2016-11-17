import utilGetModified from '../utils/getModified';

function getModified() {
  let doc = this;

  return utilGetModified({
    doc,
    transient: true
  });
};

export default getModified;