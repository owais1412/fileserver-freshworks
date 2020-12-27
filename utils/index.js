let stringConstructor = "test".constructor;
let objectConstructor = {}.constructor;

exports.isString = (s) => {
  return ((typeof s) == 'string') || (s instanceof String);
};

exports.isJSON = (json) => {
  return json.constructor == objectConstructor;
};

exports.IsValidJSONString = (str) => {
  try {
    str = JSON.stringify(str);
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
