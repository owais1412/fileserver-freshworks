const homedir = require("os").homedir();
const path = require("path");
const expect = require("chai").expect;
const FileStore = require("../index").FileStore;
const fileName = "filestore.txt";

describe("Store initialization with default path", () => {
  it("Should pass with correct path", () => {
    const store = new FileStore();
    const actual = store.path;
    const expected = path.join(homedir, fileName);
    expect(actual).to.equal(expected);
  });

  it("Should fail with wrong path", () => {
    const store = new FileStore();
    const actual = store.path;
    const expected = path.join(homedir, "wrong_dir", fileName);
    expect(actual).to.equal(expected);
  });
});

describe("Store initialization with custom path", () => {
  it("Should pass with correct path", () => {
    // In custom path all folders should exist
    const filePath = path.join(homedir, "testing");
    const store = new FileStore(filePath);
    const actual = store.path;
    const expected = path.join(filePath, fileName);
    expect(actual).to.equal(expected);
  });

  it("Should fail with wrong path", () => {
    // In custom path all folders should exist
    const filePath = path.join(homedir, "testing");
    const store = new FileStore(filePath);
    const actual = store.path;
    const expected = path.join(filePath, "wrong_dir", fileName);
    expect(actual).to.equal(expected);
  });


  /**
   * This test case should be run separately with no filestore prebuilt
   */
  it("Should fail with multiple access of same filestore", () => {
    // In custom path all folders should exist
    const filePath = path.join(homedir, "testing1");
    // create a new store
    const store = new FileStore(filePath);
    // add some entry to the store
    store.addEntry("key2", { data: 1 });
    // create another store at the same path
    const store1 = new FileStore(filePath);
    // errorFileExists should be come true
    const actual = store1.errorFileExists;
    const expected = true;
    expect(actual).to.equal(expected);
  });
});

describe("Testing CRD operations", () => {
  it("Should be able to add entry", () => {
    const store = new FileStore();
    const actual = store.addEntry("key1", { data: 1 });
    const expected = 1;
    expect(actual).to.equal(expected);
  });

  it("Should not be able to add entry as key is duplicate", () => {
    const store = new FileStore();
    store.addEntry("key1", { data: 2 });
    const actual = store.addEntry("key1", { data: 1 });
    const expected = -1;
    expect(actual).to.equal(expected);
  });

  it("Should be able to read an entry by key", () => {
    const store = new FileStore();
    const dataValue = { data: 1 };
    store.addEntry("key1", dataValue);
    const actual = JSON.stringify(store.readByKey("key1")); // store.readByKey returns a JSON object
    const expected = JSON.stringify(dataValue);
    expect(actual).to.equal(expected);
  });

  it("Should be able to delete an entry by key", () => {
    const store = new FileStore();
    store.addEntry("key1", { data: 1 });
    const actual = store.deleteByKey("key1");
    const expected = 1;
    expect(actual).to.equal(expected);
  });

  it("Should be able to delete an entry by key with providing big timeToLive parameter", () => {
    const store = new FileStore();
    // timeToLive is provided as 100 seconds
    store.addEntry("key1", { data: 1 }, 100);
    const actual = store.deleteByKey("key1");
    const expected = 1;
    expect(actual).to.equal(expected);
  });

  it("Should not be able to delete an entry by key with providing very small timeToLive parameter", () => {
    const store = new FileStore();
    // timeToLive is provided as 10 milliseconds
    store.addEntry("key1", { data: 1 }, 0.01);
    const actual = store.deleteByKey("key1");
    const expected = -1;
    expect(actual).to.equal(expected);
  });
});
