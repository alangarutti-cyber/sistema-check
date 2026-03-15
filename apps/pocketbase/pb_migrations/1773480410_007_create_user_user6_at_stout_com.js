/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "user6@stout.com");
  record.setPassword("User@123456");
  record.set("name", "Usu\u00e1rio Franquia");
  const record_unit_idLookup = app.findFirstRecordByFilter("units", "name='Franquia Centro'");
  if (!record_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Franquia Centro'\""); }
  record.set("unit_id", record_unit_idLookup.id);
  const record_sector_idLookup = app.findFirstRecordByFilter("sectors", "name='Cozinha'");
  if (!record_sector_idLookup) { throw new Error("Lookup failed for sector_id: no record in 'sectors' matching \"name='Cozinha'\""); }
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
    const record = app.findFirstRecordByData("users", "email", "user6@stout.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
