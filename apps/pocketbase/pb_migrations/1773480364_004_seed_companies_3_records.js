/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("companies");

  const record0 = new Record(collection);
    record0.set("name", "Stout Burger");
    record0.set("description", "Unidade principal Stout");
    const record0_network_idLookup = app.findFirstRecordByFilter("networks", "name='Stout'");
    if (!record0_network_idLookup) { throw new Error("Lookup failed for network_id: no record in 'networks' matching \"name='Stout'\""); }
    record0.set("network_id", record0_network_idLookup.id);
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
    record1.set("name", "CPD Produ\u00e7\u00e3o");
    record1.set("description", "Centro de Produ\u00e7\u00e3o e Distribui\u00e7\u00e3o");
    const record1_network_idLookup = app.findFirstRecordByFilter("networks", "name='Stout'");
    if (!record1_network_idLookup) { throw new Error("Lookup failed for network_id: no record in 'networks' matching \"name='Stout'\""); }
    record1.set("network_id", record1_network_idLookup.id);
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
    record2.set("name", "Franquia Centro");
    record2.set("description", "Franquia localizada no centro");
    const record2_network_idLookup = app.findFirstRecordByFilter("networks", "name='Stout'");
    if (!record2_network_idLookup) { throw new Error("Lookup failed for network_id: no record in 'networks' matching \"name='Stout'\""); }
    record2.set("network_id", record2_network_idLookup.id);
  try {
    app.save(record2);
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
