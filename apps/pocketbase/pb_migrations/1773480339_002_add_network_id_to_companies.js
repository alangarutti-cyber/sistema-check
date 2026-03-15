/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const networksCollection = app.findCollectionByNameOrId("networks");
  const collection = app.findCollectionByNameOrId("companies");

  const existing = collection.fields.getByName("network_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("network_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "network_id",
    required: false,
    collectionId: networksCollection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("companies");
  collection.fields.removeByName("network_id");
  return app.save(collection);
})
