const homedir = require("os").homedir();
const path = require("path");
const expect = require("chai").expect;
const FileStore = require("../index").FileStore;
const fileName = "filestore.txt";

describe("Store initialization with default path", () => {
  it("This test should pass with correct path", () => {
    const store = new FileStore();
    const actual = store.path;
    const expected = path.join(homedir, fileName);
    expect(actual).to.equal(expected);
  });

  it("This test should fail with wrong path", () => {
    const store = new FileStore();
    const actual = store.path;
    const expected = path.join(filePath, "wrong_dir", fileName);
    expect(actual).to.equal(expected);
  });
});

describe("Store initialization with custom path", () => {
  it("This test should pass with correct path", () => {
    const filePath = path.join(homedir, "testing");
    const store = new FileStore(filePath);
    const actual = store.path;
    const expected = path.join(filePath, fileName);
    expect(actual).to.equal(expected);
  });

  it("This test should fail with wrong path", () => {
    const filePath = path.join(homedir, "testing");
    const store = new FileStore(filePath);
    const actual = store.path;
    const expected = path.join(filePath, "wrong_dir", fileName);
    expect(actual).to.equal(expected);
  });
});

describe("Testing CRUD operations", () => {
    it("Should be able to add entry", () => {
        const store = new FileStore();
        const actual = store.addEntry("Owais", {"data":1});
        const expected = 1;
        expect(actual).to.equal(expected);
    })

    it("Should not be able to add entry as key is duplicate", () => {
        const store = new FileStore();
        store.addEntry("Owais", {"data":2})
        const actual = store.addEntry("Owais", {"data":1});
        const expected = -1;
        expect(actual).to.equal(expected);
    })
    // it("Is store initilizing with custom path", () => {
    //     const filePath = path.join(homedir,"testing")
    //     const store = new FileStore(filePath);
    //     const actual = path.join(filePath, fileName);
    //     const expected = store.path;
    //     expect(actual).to.equal(expected);
    // })
})
