const fs = require("fs");
const os = require("os");
const path = require("path");
const homedir = os.homedir();
const utils = require("./utils");

const validateKey = (key) => {
  return utils.isString(key);
};

const validateValue = (value) => {
  return utils.isJSON(value) && utils.IsValidJSONString(value);
};

const isKeyAlive = (timeToLive) => {
  if (timeToLive - Date.now() >= 0) {
    return true;
  }
  return false;
};

exports.FileStore = class {
  constructor(filePath = null) {
    try {
      this.fileName = "filestore.txt";
      this.path = path.join(filePath ? filePath : homedir, this.fileName);

      fs.openSync(this.path, "w");
    } catch (error) {
      console.error(error.message);
      return -1;
    }
  }

  appendDataFromArray(array) {
    fs.openSync(this.path, "w");
    for (let i = 0; i < array.length; i++) {
      const pair = array[i];
      if (pair !== "") {
        let dataToWrite = `${pair}\n`;
        fs.appendFileSync(this.path, dataToWrite, { encoding: "utf8" });
      }
    }
  }

  readFile() {
    return fs.readFileSync(this.path, "utf8");
  }

  getSize() {
    return fs.statSync(this.path).size;
  }

  addEntry(key, value, timeToLive = null) {
    try {
      // validate data before saving
      if (!key || !value) throw new Error("Insufficient data");

      if (!validateKey(key)) {
        throw new Error("Expected key of type 'string'");
      }

      if (!validateValue(value)) {
        throw new Error("Expected value of type 'json'");
      }

      // check file size whether it is less than 1 GB or not
      const fileSize = this.getSize();
      if(fileSize >= 1073741824) {
        throw new Error("File size cannot exceed 1 GB");
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
      const fileData = this.readFile().split("\n");

      // check whether the key already exists or not
      for (let pair of fileData) {
        const singleKeyWithTime = pair.split("-:-")[0];
        const singleKey = singleKeyWithTime.split(";")[0];
        if (key === singleKey) {
          throw new Error("Key already exist");
        }
      }

      // append data to the filestore
      fs.appendFileSync(this.path, dataToWrite);
      return 1;
    } catch (error) {
      console.log(error.message);
      return -1;
    }
  }

  readByKey(key) {
    try {
      // validate key
      validateKey(key);

      // read the file
      const fileData = this.readFile().split("\n");

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
  }

  deleteByKey(key) {
    try {
      // validate key
      validateKey(key);

      // read the file
      const fileData = this.readFile().split("\n");

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
              throw new Error(
                "Cannot delete entry. Exceeded time-to-live time."
              );
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

      // re-write the filestore with updated data
      this.appendDataFromArray(fileData);
      return 1;
    } catch (error) {
      console.error(error.message);
      return -1; // or return {}
    }
  }
}
