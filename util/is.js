
let is  = {};
const str = is.str = str => typeof str === "string";
const fun = is.fun = fun => typeof fun === "function";
const arr = is.arr = arr => Array.isArray(arr);

export default is;