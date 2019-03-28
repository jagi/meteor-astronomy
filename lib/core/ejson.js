import AstroClass from './class.js';
import Event from '../modules/events/event.js';

EJSON.addType('Astronomy', function(json) {
  let Class = AstroClass.get(json.class);

  // This sometimes happens on the client if a document arrives from a sub before all
  // classes have been initialized in the app.
  // One such sub can be the null-sub for user document, which sometimes can arrive before the
  // app is fully ready.
  if (!Class) {
    console.warn(`[Astronomy] a document of class ${json.class} arrived before class was initialized`);
    return EJSON.parse(json.values);
  }

  let doc = new Class();

  // Trigger the "fromJSONValue" event handlers.
  doc.dispatchEvent(new Event('fromJSONValue', {
    json: json
  }));

  return doc;
});