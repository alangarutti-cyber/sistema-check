/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("units");

  const record0 = new Record(collection);
    record0.set("name", "Limeira");
    const record0_company_idLookup = app.findFirstRecordByFilter("companies", "name='Stout Burger'");
    if (!record0_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"name='Stout Burger'\""); }
    record0.set("company_id", record0_company_idLookup.id);
    record0.set("location", "Limeira, SP");
    record0.set("description", "Unidade de Limeira");
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
    record1.set("location", "Americana, SP");
    record1.set("description", "Unidade de Americana");
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
    record2.set("name", "Shopping");
    const record2_company_idLookup = app.findFirstRecordByFilter("companies", "name='Stout Burger'");
    if (!record2_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"name='Stout Burger'\""); }
    record2.set("company_id", record2_company_idLookup.id);
    record2.set("location", "Shopping Center, SP");
    record2.set("description", "Unidade em shopping");
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
    record3.set("name", "CPD");
    const record3_company_idLookup = app.findFirstRecordByFilter("companies", "name='CPD Produção'");
    if (!record3_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"name='CPD Produção'\""); }
    record3.set("company_id", record3_company_idLookup.id);
    record3.set("location", "Campinas, SP");
    record3.set("description", "Centro de Produ\u00e7\u00e3o");
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
    record4.set("name", "Franquia Centro");
    const record4_company_idLookup = app.findFirstRecordByFilter("companies", "name='Franquia Centro'");
    if (!record4_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"name='Franquia Centro'\""); }
    record4.set("company_id", record4_company_idLookup.id);
    record4.set("location", "Centro, SP");
    record4.set("description", "Unidade franquia");
  try {
    app.save(record4);
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
