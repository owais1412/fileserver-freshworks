const fs = require("fs");
const os = require("os");
const homedir = os.homedir();
const utils = require("./utils");

class FileStore {
  constructor(filePath = null) {
    try {
      this.path = (filePath ? filePath : homedir) + +
			(process.platform == "win32" ? "\\filestore.txt" : "/firestore.txt");
      // if (filePath != null) {
      //   path =
      //     filePath +
      //     (process.platform == "win32" ? "\\filestore.txt" : "/firestore.txt");
      // }

      fs.openSync(path, "w");
      return path;
    } catch (error) {
      console.error(error.message);
      return -1;
    }
  }
}
// path where the datastore file will be created

const validateKey = (key) => {
  return utils.isString(key);
};

const validateValue = (value) => {
  return utils.isJSON(value) && utils.IsValidJSONString(value);
};

const appendDataFromArray = (array) => {
  fs.openSync(path, "w");
  for (let i = 0; i < array.length; i++) {
    const pair = array[i];
    if (pair !== "") {
      let dataToWrite = `${pair}`;
      fs.appendFileSync(path, dataToWrite, { encoding: "utf8" });
      fs.appendFileSync(path, "\n", { encoding: "utf8" });
    }
  }
};

const isKeyAlive = (timeToLive) => {
  if (timeToLive - Date.now() >= 0) {
    return true;
  }
  return false;
};

const readFile = () => {
  return fs.readFileSync(path, "utf8");
};

const init = (filepath = null) => {};

const create = (key, value, timeToLive = null) => {
  try {
    // validate data before saving
    if (!key || !value) throw new Error("Insufficient data");

    if (!validateKey(key)) {
      throw new Error("Expected key of type 'string'");
    }

    if (!validateValue(value)) {
      throw new Error("Expected value of type 'json'");
    }

    const valueAsString = JSON.stringify(value);
    // let dataToWrite = `${key}-:-${valueAsString}\n`;
    let dataToWrite = `${key};`;

    // timeToLive logic goes here
    if (timeToLive != null) {
      if (typeof timeToLive != "number") {
        throw new Error("'timeToLive' must be a an integer/number");
      }
      let currentDate = new Date();
      currentDate.setSeconds(currentDate.getSeconds() + timeToLive);
      dataToWrite += currentDate.getTime();
    } else {
      // if no time to live is provided then 0 is stored to mark infinite time limit
      dataToWrite += "0";
    }

    dataToWrite += `-:-${valueAsString}\n`;

    // read the file
    const fileData = readFile().split("\n");

    // check whether the key already exists or not
    for (let pair of fileData) {
      const singleKeyWithTime = pair.split("-:-")[0];
      const singleKey = singleKeyWithTime.split(";")[0];
      if (key === singleKey) {
        throw new Error("Key already exist");
      }
    }

    // append data to the filestore
    fs.appendFileSync(path, dataToWrite);
  } catch (error) {
    console.log(error.message);
    return -1;
  }
};

const readByKey = (key) => {
  try {
    // validate key
    validateKey(key);

    // read the file
    const fileData = readFile().split("\n");

    // fetch value corresponds to the given key
    for (let pair of fileData) {
      // split each pair to separate key-value pair
      // Key and Values are in the form 'key-:-value'
      const pairSplit = pair.split("-:-");

      const singleKeyWithTime = pairSplit[0];

      const singleKeySplit = singleKeyWithTime.split(";");

      const singleKey = singleKeySplit[0];
      const timeToLive = parseInt(singleKeySplit[1]);
      if (key === singleKey) {
        const value = JSON.parse(pairSplit[1]);
        if (timeToLive != 0) {
          if (isKeyAlive(timeToLive)) {
            return value;
          } else {
            throw new Error("Cannot read entry. Exceeded time-to-live time.");
          }
        } else {
          return value;
        }
      }
    }

    // key does not exist
    throw new Error("Key does not exist");
  } catch (error) {
    console.error(error.message);
    return -1; // or return {}
  }
};

const deleteByKey = (key) => {
  try {
    // validate key
    validateKey(key);

    // read the file
    const fileData = readFile().split("\n");

    // initialize the index of the entry to be deleted as -1
    let index = -1;

    // get the index of the entry which is to be deleted
    for (let i = 0; i < fileData.length; i++) {
      const pair = fileData[i];
      const pairSplit = pair.split("-:-");

      const singleKeyWithTime = pairSplit[0];

      const singleKeySplit = singleKeyWithTime.split(";");

      const singleKey = singleKeySplit[0];
      const timeToLive = parseInt(singleKeySplit[1]);
      if (key === singleKey) {
        if (timeToLive != 0) {
          if (isKeyAlive(timeToLive)) {
            index = i;
          } else {
            throw new Error("Cannot delete entry. Exceeded time-to-live time.");
          }
        } else {
          index = i;
        }
      }
    }

    if (index === -1) {
      // entry does not exist
      throw new Error("No such entry exist for the given key");
    }

    fileData.splice(index, 1);
    // newFileData.push(fileData.slice(index,fileData.length))
    console.log(fileData);

    // re-write the filestore with updated data
    appendDataFromArray(fileData);
  } catch (error) {
    console.error(error.message);
    return -1; // or return {}
  }
};

const main = () => {
  try {
    let filePath = homedir + "\\testing";
    init(filePath);
    // create("Owais",{"data":1});
    // create("Owais0",{"data":2});
    // create("Owais3",{"data":3}, 60);
    // console.log(readByKey("Owais3"));
    // deleteByKey("Owais3");
  } catch (error) {
    console.error(error.message);
  }
};
main();
