/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const sectorsCollection = app.findCollectionByNameOrId("sectors");
  const collection = app.findCollectionByNameOrId("users");

  const existing = collection.fields.getByName("sector_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("sector_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "sector_id",
    collectionId: sectorsCollection.id
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.fields.removeByName("sector_id");
  return app.save(collection);
})
