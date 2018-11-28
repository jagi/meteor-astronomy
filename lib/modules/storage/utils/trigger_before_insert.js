import Event from "../../events/event.js";

function triggerBeforeInsert(args) {
  const { doc, stopOnFirstError, fields, simulation, trusted } = args;
  // Trigger the "beforeInsert" event handlers.
  if (
    !doc.dispatchEvent(
      new Event("beforeInsert", {
        cancelable: true,
        propagates: true,
        doc,
        stopOnFirstError,
        fields,
        simulation,
        trusted
      })
    )
  ) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeInsert"
    });
  }
}

export default triggerBeforeInsert;
