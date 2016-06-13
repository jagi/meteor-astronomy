function afterInit(e) {
  let doc = e.currentTarget;
  let Class = doc.constructor;

  let typeField = Class.getTypeField();
  if (!doc[typeField]) {
    doc[typeField] = Class.getName();
  }
};

export default afterInit;