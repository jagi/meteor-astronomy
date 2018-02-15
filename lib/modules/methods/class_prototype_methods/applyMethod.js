import callStandardMeteorMethod from "../../storage/utils/callStandardMeteorMethod";
import rawAll from "../../fields/utils/rawAll";

function applyMethod(methodName, methodArgs, callback) {
  const doc = this;
  const Class = doc.constructor;

  // Prepare arguments to be sent to the "/Astronomy/execute" method.
  const meteorMethodArgs = {
    className: Class.getName(),
    methodName,
    methodArgs,
    rawDoc: rawAll(doc, {
      transient: false
    })
  };

  return callStandardMeteorMethod(
    Class,
    "/Astronomy/execute",
    [meteorMethodArgs],
    callback
  );
}

export default applyMethod;
