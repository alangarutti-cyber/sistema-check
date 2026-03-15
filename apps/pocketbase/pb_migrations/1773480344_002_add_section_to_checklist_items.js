/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("checklist_items");

  const existing = collection.fields.getByName("section");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("section"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "section",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("checklist_items");
  collection.fields.removeByName("section");
  return app.save(collection);
})
