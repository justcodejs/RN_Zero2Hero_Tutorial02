export default class Helper {

  static isNotNullAndUndefined(obj, props = []) {
    let bIsNullorUndefined =  obj === null || obj === undefined;
    let curObj = null;

    if(!bIsNullorUndefined) {
      curObj = obj;
      if(props !== null) {
        for(let idx=0; idx < props.length; idx++) {
          bIsNullorUndefined = curObj[props[idx]] === null || curObj[props[idx]] === undefined;
          curObj =  curObj[props[idx]]; // Set the curObj[props[idx]] to curObj so that it will recursive down the depth of the object

          if(bIsNullorUndefined)
            break;
        }
      }
    }
    
    return !bIsNullorUndefined;
  }

  static carefullyGetValue(obj, props = [], defaultValue='') {
    let bIsNullorUndefined =  obj === null || obj === undefined;
    let curObj = null;

    if(!bIsNullorUndefined) {
      curObj = obj;
      if(props !== null) {
        for(let idx=0; idx < props.length; idx++) {
          bIsNullorUndefined = curObj[props[idx]] === null || curObj[props[idx]] === undefined;
          curObj =  curObj[props[idx]]; // Set the curObj[props[idx]] to curObj so that it will recursive down the depth of the object

          if(bIsNullorUndefined)
            break;
        }
      }
    }
    
    if(bIsNullorUndefined)
      return defaultValue;
    else
      return curObj;
  }

  static capitalize(str) {
    if (typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}