/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sectors");
  collection.createRule = "";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sectors");
  collection.createRule = "";
  return app.save(collection);
})
