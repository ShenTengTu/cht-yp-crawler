const fs = require('fs')
const crypto = require('crypto');



/**
* test file access or not
* @return Boolean
*/
function fsAcess (path) {
  try {
    fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
    return true
  } catch (err) {
    return false
  }
}

/**
* Hash
* @return String
*/
function hashOf(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
* Check an object's property is exist or not.
* @return [Boolean,ERROR]
*/
function hasProp(obj,prop) {
  if(obj === null || obj === undefined) return [false,new Error(`null & undefined have no property`)]

  if(!obj[`${prop}`]) return [false,new Error(`${prop} is undefined`)]

  return [true,null]
}

/**
* AS JSDOM querySelector Method.
* @return [Node,ERROR]
*/
function queryElChild(el,selector){
  let [bool,err] = hasProp(el,'querySelector')
  if(err) return [null,err]

  let proxy = el.querySelector(`${selector}`)

  if(proxy === null) return [null,new Error(`No result when use Selector: ${selector}`)]

  return [proxy,null]
}

/**
* AS JSDOM querySelectorAll Method.
* @return [Node,ERROR]
*/
function queryElChildren(el,selector){
  let [bool,err] = hasProp(el,'querySelectorAll')
  if(err) return [null,err]

  let proxy = el.querySelectorAll(`${selector}`)

  if(proxy.length === 0) return [null,new Error(`No result when use Selector: ${selector}`)]

  return [proxy,null]
}

module.exports = {
  hasProp:hasProp,
  queryElChild:queryElChild,
  queryElChildren:queryElChildren,
  fsAcess:fsAcess,
  hashOf:hashOf
}
