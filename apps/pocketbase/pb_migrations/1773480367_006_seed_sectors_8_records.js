/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sectors");

  const record0 = new Record(collection);
    record0.set("name", "Cozinha");
    const record0_unit_idLookup = app.findFirstRecordByFilter("units", "name='Limeira'");
    if (!record0_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Limeira'\""); }
    record0.set("unit_id", record0_unit_idLookup.id);
    record0.set("description", "Setor de prepara\u00e7\u00e3o de alimentos");
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
    record1.set("name", "Sal\u00e3o");
    const record1_unit_idLookup = app.findFirstRecordByFilter("units", "name='Limeira'");
    if (!record1_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Limeira'\""); }
    record1.set("unit_id", record1_unit_idLookup.id);
    record1.set("description", "Setor de atendimento ao cliente");
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
    record2.set("name", "Estoque");
    const record2_unit_idLookup = app.findFirstRecordByFilter("units", "name='Limeira'");
    if (!record2_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Limeira'\""); }
    record2.set("unit_id", record2_unit_idLookup.id);
    record2.set("description", "Setor de armazenamento");
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
    record3.set("name", "Produ\u00e7\u00e3o");
    const record3_unit_idLookup = app.findFirstRecordByFilter("units", "name='CPD'");
    if (!record3_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='CPD'\""); }
    record3.set("unit_id", record3_unit_idLookup.id);
    record3.set("description", "Setor de produ\u00e7\u00e3o em massa");
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Limpeza");
    const record4_unit_idLookup = app.findFirstRecordByFilter("units", "name='Americana'");
    if (!record4_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Americana'\""); }
    record4.set("unit_id", record4_unit_idLookup.id);
    record4.set("description", "Setor de limpeza e higiene");
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Manuten\u00e7\u00e3o");
    const record5_unit_idLookup = app.findFirstRecordByFilter("units", "name='Americana'");
    if (!record5_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Americana'\""); }
    record5.set("unit_id", record5_unit_idLookup.id);
    record5.set("description", "Setor de manuten\u00e7\u00e3o de equipamentos");
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "Expedi\u00e7\u00e3o");
    const record6_unit_idLookup = app.findFirstRecordByFilter("units", "name='CPD'");
    if (!record6_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='CPD'\""); }
    record6.set("unit_id", record6_unit_idLookup.id);
    record6.set("description", "Setor de expedi\u00e7\u00e3o de produtos");
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Administrativo");
    const record7_unit_idLookup = app.findFirstRecordByFilter("units", "name='Shopping'");
    if (!record7_unit_idLookup) { throw new Error("Lookup failed for unit_id: no record in 'units' matching \"name='Shopping'\""); }
    record7.set("unit_id", record7_unit_idLookup.id);
    record7.set("description", "Setor administrativo");
  try {
    app.save(record7);
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
