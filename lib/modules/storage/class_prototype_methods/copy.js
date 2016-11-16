function copy(save) {
  const doc = this;
  save = save || false;

  // Use EJSON to clone object.
  const copy = EJSON.clone(doc);

  // Clear the "_id" field so when saving it will store it as a new document
  // instead of updating the old one.
  copy._id = null;

  if (save) {
    copy.save();
  }

  return copy;
};

export default copy;