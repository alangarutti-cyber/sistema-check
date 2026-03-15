/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const companiesCollection = app.findCollectionByNameOrId("companies");
  const collection = app.findCollectionByNameOrId("checklist_executions");

  const existing = collection.fields.getByName("company_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("company_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "company_id",
    required: true,
    collectionId: companiesCollection.id,
    maxSelect: 1
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("checklist_executions");
  collection.fields.removeByName("company_id");
  return app.save(collection);
})
