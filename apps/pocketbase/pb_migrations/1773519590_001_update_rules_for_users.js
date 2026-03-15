/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.createRule = "@request.auth.role = \"administrator\"";
  collection.updateRule = "@request.auth.role = \"administrator\" || @request.auth.id = id";
  collection.deleteRule = "@request.auth.role = \"administrator\"";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.createRule = "@request.auth.role = \"admin\"";
  collection.updateRule = "@request.auth.role = \"admin\" || @request.auth.id = id";
  collection.deleteRule = "@request.auth.role = \"admin\"";
  return app.save(collection);
})
