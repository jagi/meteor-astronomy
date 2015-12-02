let collectionMethods = Astro.Module.modules.storage.collectionMethods;

collectionMethods.dispatchEvent = function(event) {
  console.log('Collection Method');

  return true;
};