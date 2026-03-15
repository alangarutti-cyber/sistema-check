/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("checklist_templates");

  const existing = collection.fields.getByName("active");
  if (existing) {
    if (existing.type === "bool") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("active"); // exists with wrong type, remove first
  }

  collection.fields.add(new BoolField({
    name: "active",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("checklist_templates");
  collection.fields.removeByName("active");
  return app.save(collection);
})
