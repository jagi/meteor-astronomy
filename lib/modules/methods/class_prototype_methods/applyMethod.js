import callMeteorMethod from "../../storage/utils/call_meteor_method";
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

  try {
    return callMeteorMethod(
      Class,
      "/Astronomy/execute",
      [meteorMethodArgs],
      callback
    );
  } catch (err) {
    if (callback) {
      callback(err);
      return null;
    }
    throw err;
  }
}

export default applyMethod;
