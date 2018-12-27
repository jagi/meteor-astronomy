import utilGetModified from "../utils/getModified";

function getModified(options = {}) {
  const doc = this;
  const { fields } = options;

  return utilGetModified({
    doc,
    transient: true,
    fields
  });
}

export default getModified;
