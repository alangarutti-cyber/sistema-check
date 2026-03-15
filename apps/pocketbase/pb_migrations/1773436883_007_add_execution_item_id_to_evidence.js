/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const execution_itemsCollection = app.findCollectionByNameOrId("execution_items");
  const collection = app.findCollectionByNameOrId("evidence");

  const existing = collection.fields.getByName("execution_item_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("execution_item_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "execution_item_id",
    required: true,
    collectionId: execution_itemsCollection.id
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("evidence");
  collection.fields.removeByName("execution_item_id");
  return app.save(collection);
})
