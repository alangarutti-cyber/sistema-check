/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("checklist_items");

  const existing = collection.fields.getByName("instruction");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("instruction"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "instruction",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("checklist_items");
  collection.fields.removeByName("instruction");
  return app.save(collection);
})
