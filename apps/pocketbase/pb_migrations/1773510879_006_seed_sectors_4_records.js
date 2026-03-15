/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sectors");

  const record0 = new Record(collection);
    record0.set("name", "Cozinha");
    const record0_unit_idLookup = app.findFirstRecordByFilter("units", "name='Limeira'");
    if (!record0_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Limeira'\""); }
    record0.set("unit_id", record0_unit_idLookup.id);
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
    record1.set("name", "Limpeza");
    const record1_unit_idLookup = app.findFirstRecordByFilter("units", "name='Limeira'");
    if (!record1_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Limeira'\""); }
    record1.set("unit_id", record1_unit_idLookup.id);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("name", "Administrativo");
    const record2_unit_idLookup = app.findFirstRecordByFilter("units", "name='Limeira'");
    if (!record2_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Limeira'\""); }
    record2.set("unit_id", record2_unit_idLookup.id);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "Cozinha");
    const record3_unit_idLookup = app.findFirstRecordByFilter("units", "name='Americana'");
    if (!record3_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Americana'\""); }
    record3.set("unit_id", record3_unit_idLookup.id);
  try {
    app.save(record3);
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
