/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "pedro@stout.com");
  record.setPassword("password123");
  record.set("name", "Pedro Costa");
  record.set("position", "Cozinheiro");
  record.set("role", "operator");
  record.set("status", "active");
  record.set("hire_date", "2023-09-20");
  const record_company_idLookup = app.findFirstRecordByFilter("companies", "name='Stout Burger'");
  if (!record_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"name='Stout Burger'\""); }
  record.set("company_id", record_company_idLookup.id);
  const record_unit_idLookup = app.findFirstRecordByFilter("units", "name='Americana'");
  if (!record_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Americana'\""); }
  record.set("unit_id", record_unit_idLookup.id);
  const record_sector_idLookup = app.findFirstRecordByFilter("sectors", "name='Cozinha' && unit_id.name='Americana'");
  if (!record_sector_idLookup) { throw new Error("Lookup failed for sector_id: no record in 'sectors' matching \"name='Cozinha' && unit_id.name='Americana'\""); }
  record.set("sector_id", record_sector_idLookup.id);
  try {
    return app.save(record);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const record = app.findFirstRecordByData("users", "email", "pedro@stout.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
