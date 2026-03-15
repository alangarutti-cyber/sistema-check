/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("checklist_templates");

  const existing = collection.fields.getByName("template_builder_data");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("template_builder_data"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "template_builder_data"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("checklist_templates");
  collection.fields.removeByName("template_builder_data");
  return app.save(collection);
})
