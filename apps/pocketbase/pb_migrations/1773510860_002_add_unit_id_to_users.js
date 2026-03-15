/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const unitsCollection = app.findCollectionByNameOrId("units");
  const collection = app.findCollectionByNameOrId("users");

  const existing = collection.fields.getByName("unit_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("unit_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "unit_id",
    collectionId: unitsCollection.id
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.fields.removeByName("unit_id");
  return app.save(collection);
})
