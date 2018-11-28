import Event from "../../events/event.js";

function triggerAfterInsert(args) {
  const { doc, stopOnFirstError, fields, simulation, trusted } = args;
  // Trigger the "afterInsert" event handlers.
  doc.dispatchEvent(
    new Event("afterInsert", {
      propagates: true,
      doc,
      stopOnFirstError,
      fields,
      simulation,
      trusted
    })
  );
}

export default triggerAfterInsert;
