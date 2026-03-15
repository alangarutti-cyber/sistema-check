/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "operador3@stout.com");
  record.setPassword("Operador@123456");
  record.set("name", "Operador Sal\u00e3o 1");
  record.set("role", "operator");
  const record_unit_idLookup = app.findFirstRecordByFilter("units", "name='Limeira'");
  if (!record_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Limeira'\""); }
  record.set("unit_id", record_unit_idLookup.id);
  const record_sector_idLookup = app.findFirstRecordByFilter("sectors", "name='Salão'");
  if (!record_sector_idLookup) { throw new Error("Lookup failed for sector_id: no record in 'sectors' matching \"name='Salão'\""); }
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
    const record = app.findFirstRecordByData("users", "email", "operador3@stout.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
