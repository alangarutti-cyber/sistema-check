/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("units");

  const record0 = new Record(collection);
    record0.set("name", "Limeira");
    const record0_company_idLookup = app.findFirstRecordByFilter("companies", "name='Stout Burger'");
    if (!record0_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"name='Stout Burger'\""); }
    record0.set("company_id", record0_company_idLookup.id);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "Americana");
    const record1_company_idLookup = app.findFirstRecordByFilter("companies", "name='Stout Burger'");
    if (!record1_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"name='Stout Burger'\""); }
    record1.set("company_id", record1_company_idLookup.id);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
