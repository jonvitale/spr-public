// import Vue from 'vue';
import QdtComponents from 'qdt-components'

// import uslDef from "~/definitions/usl"

const config = {
  host: window.location.hostname,
  prefix: "",
  port: window.location.hostname === "localhost" ? 4848 : window.location.port,
  secure: window.location.protocol === "https:",
  appId:
      window.location.hostname === "localhost" ? "School Progress Reports" : "6c6a4d8a-129e-4681-bd39-7171deacebf1",
};
const connections = {
  vizApi: true, 
  engineApi: true 
}
const qdtComponents = new QdtComponents(config, connections);

export default async ({ app }, inject) => {
  inject('qdt', qdtComponents)
}



///////////////////////////////////// QLIK UTILITIY API ////////////////////////////

const clearField = async (fieldName) => {
  const engine = await qdtComponents.qDocPromise   
  const field = await engine.getField(fieldName)
  await field.clear()
  return true
}

const destroySessionObject = async (sessionObject) => {
  const engine = await qdtComponents.qDocPromise
  await engine.destroySessionObject(sessionObject.id)
  return true
}

const generateHypercubeObjectFromDef = async (qDef) => {
  const engine = await qdtComponents.qDocPromise
  const sessionObject = await engine.createSessionObject(qDef)
  return sessionObject
}

/**
 * 
 * @param {String} field 
 * @param {Object} sortBy See Qlik Engine API for qSortCriterians format
 */
const generateListObject = async (field, sortBy) => {
  let sortCriterias = {}
  const criteria = Object.keys(sortBy)
  criteria.forEach(criterion => {
    if (criterion == 'state') {
      sortCriterias["qSortByState"] = sortBy[criterion]
    } else if (criterion == 'numeric' || criterion == 'number') {
      sortCriterias["qSortByNumeric"] = sortBy[criterion]
    } else if (criterion == 'text' || criterion == 'ascii') {
      sortCriterias["qSortByAscii"] = sortBy[criterion]
    }     
  })

  const qDef =  {
    qInfo: { qType: "ListObject" },
    qListObjectDef: {
     qDef: { 
       qFieldDefs: [field], 
       qFieldLabels: [field],
       qSortCriterias: [sortCriterias],
     },
     qInitialDataFetch: [{ 
        qWidth: 1, 
        qHeight: 5000, 
      }],
      qShowAlternatives : true,
    }
  }    
  
  // create a session object that will respond to user selections, will use the update methods to get changes
  const engine = await qdtComponents.qDocPromise
  const object = await engine.createSessionObject(qDef)        
  return object  
}

const getObjectFromId = async qId => {
  const engine = await qdtComponents.qDocPromise
  return await engine.getObject(qId)
}

const getFieldValueByIndex = (values, index, targetField) => {
  if (typeof index == 'number' && index >= 0) {
    return values[targetField][index]
  } else if (Array.isArray(index) && index.length) {
    return values[targetField].filter((val, i) => index.includes(i))
  } else {
    return null
  }
}

/**
 * Creates a key-value object with the name of the dimension or measure as the key and the values in the
 * dimension or measure as an array value. Users should use another function from this API to lookup values.
 * @param {Object} hypercubeObject The Qlik hypercube object returned from a fulfilled call to generateHypercubeObjectFromDef
 */
const getValuesFromHypercubeObject = async hypercubeObject => {
  const layout = await hypercubeObject.getLayout()
  let fullMatrix = []
  layout.qHyperCube.qDataPages.forEach(obj => {
    fullMatrix = fullMatrix.concat(obj.qMatrix)
  })
  let valuesByField = {}
  let values, isNumeric

  // dimensions
  layout.qHyperCube.qDimensionInfo.forEach((dim, index) => {
    isNumeric = layout.qHyperCube.qDimensionInfo[index].qTags
      .filter(value => value.includes("numeric") || value.includes("integer")).length > 0

    values = fullMatrix.map(value => ({
        text: value[index].qText, 
        number: isNumeric ? value[index].qNum : null, 
        isSelected: value[index].qState == "S" ? true: false,
        isExcluded: value[index].qState == "X" ? true: false,
      })
    )
    valuesByField[dim.qFallbackTitle] = values  
  })
  const ndims = layout.qHyperCube.qDimensionInfo.length

  // measures - note the inner loop maps across measures and dimensions so the index should skip dims
  layout.qHyperCube.qMeasureInfo.forEach((dim, index) => {
    let mindex = index + ndims
    values = fullMatrix.map(value => ({
        text: value[mindex].qText, 
        number: value[mindex] != null ? value[mindex].qNum : null, 
        isSelected: value[mindex].qState == "S" ? true: false,        
        isExcluded: value[mindex].qState == "X" ? true: false,
      })
    )
    valuesByField[dim.qFallbackTitle] = values  
  })

  return valuesByField
}


const getValuesFromListObject = async listObject => {
  const layout = await listObject.getLayout()
  let fullMatrix = []
  layout.qListObject.qDataPages.forEach(obj => {
    fullMatrix = fullMatrix.concat(obj.qMatrix.map(value => value[0]))
  })
  const isNumeric = layout.qListObject.qDimensionInfo.qTags
    .filter(value => value.includes("numeric") || value.includes("integer")).length > 0
  let values = fullMatrix.map(value => ({
    text: value.qText,
    number: isNumeric ? value.qNum : null,
    isSelected: value.qState == "S" ? true: false,
    isExcluded: value.qState == "X" ? true: false,
  }))
  // if this is numeric sort by value
  // if (isNumeric) {
    // values.sort((a, b) => a.number < b.number ? -1 : 1)
  // }

  return values
}

/**
 * Returns the value of a variable stored in the Qlik Sense app.
 * @param {string} variableName The variable name inside the Qlik Sense app
 */
const getVariableValueByName = async (variableName) => {
  const variable = await engine.getVariableByName(variableName)
  return variable
}

/**
 * This function provides a way to locate, in the values array, the position(s) that match a specific value in a field.
 * The returned indices can be used to get values from other fields.
 * For example, if we look up the values "Network 1" in a "Network" field, a set of indices will be returned
 * with all of the "rows" corresponding to Network 1. These indices can then be used by the function
 * "getValuesByIndex" to retrieve other values corresponding to these rows.
 * @param {object} values The fieldname-values array Object returned by getValuesFromHypercubeObject or getValuesFromListObject
 * @param {*} sourceField The name of the field to filter for specific values
 * @param {*} sourceFieldValue The specific values to match
 * @param {*} returnMultiple Allow multiple indices to be returned, if false (default), return first.
 *                            If true, return an array of all matching values.
 */
const lookupIndexByFieldValue = (values, sourceField, sourceFieldValue, returnMultiple) => {
  // console.log("lookupIndexByFieldValue", values, sourceField, sourceFieldValue)
  if (values && Object.keys(values).includes(sourceField)) {
    const fieldValues = values[sourceField]
    // add the index in the values object
    let fieldValuesIndex = fieldValues.map((val, index) => ({...val, index}))
    // filter the source field to only the target value
    fieldValuesIndex = fieldValuesIndex.filter(val => val.text == sourceFieldValue)
    if (fieldValuesIndex.length > 0) {
      if (returnMultiple) {
        return fieldValuesIndex.map(v => v.index)
      } else {
        return fieldValuesIndex[0].index    
      }
    } else {
      // console.log("lookupIndexByFieldValue could not find index", values, sourceField, sourceFieldValue)
      return -1
    }
  } else {
    return -1
  }
}

const formatReturnValues = (returnValues, returnKey) => {
  if (typeof returnKey == 'string') {
    if (Array.isArray(returnValues)) {
      if (Object.keys(returnValues[0]).includes(returnKey)) {
        return returnValues.map(v => v[returnKey])
      } else {
        return returnValues
      }
    } else {
      if (Object.keys(returnValues).includes(returnKey)) {
        return returnValues[returnKey]
      } else {
        return returnValues
      }
    }
  } else {
    return returnValues
  }
}

const lookupValueByFieldValue = (values, sourceField, sourceFieldValue, targetField, returnMultiple, returnKey) => {
  if (values != null) {
    const index = lookupIndexByFieldValue(values, sourceField, sourceFieldValue, returnMultiple)
    // console.log(index, sourceField, sourceFieldValue, targetField, values)
    let returnValues = getFieldValueByIndex(values, index, targetField)
    return formatReturnValues(returnValues, returnKey)
  } else {
    return null
  }
}

const lookupIndexByMultipleFieldValues = (values, sourceFieldValueMap, returnMultiple) => {
  // console.log("lookupIndexByMultipleFieldValues", values, sourceFieldValueMap)
  if (values != null) {
    let sourceField, sourceFieldValue, fieldValues

    // we will filter the final indices from a set of all indices
    const length = values[Object.keys(values)[0]].length
    let finalIndices = [...Array(length).keys()]

    for (sourceField in sourceFieldValueMap) {
      sourceFieldValue = sourceFieldValueMap[sourceField]
      if(values[sourceField].length > 0) {
        fieldValues = values[sourceField]
        // add the index in the values object
        let fieldValuesIndex = fieldValues.map((val, index) => ({...val, index}))
        // filter the source field to only the target value
        let indices = fieldValuesIndex.filter(val => val.text == sourceFieldValue)
          .map(val => val.index)
        
        // get the intersection of the indices selected from this field with the accumulated, final indices
        finalIndices = finalIndices.filter(val => indices.includes(val))
      }
    } 
    if (finalIndices.length > 0) {
      if (returnMultiple) {
        return finalIndices
      } else {
        return finalIndices[0]
      }
    } else {
      // console.log("lookupIndexByFieldValue could not find index", values, sourceField, sourceFieldValue)
      return -1
    }
  } else {
    return -1
  }
}

const lookupValueByMultipleFieldValues = (values, sourceFieldValueMap, targetField, returnMultiple, returnKey) => {
  if (values != null) {
    const index = lookupIndexByMultipleFieldValues(values, sourceFieldValueMap, returnMultiple)
    // console.log(index, sourceField, sourceFieldValue, targetField, values)
    let returnValues = getFieldValueByIndex(values, index, targetField)
    return formatReturnValues(returnValues, returnKey)
  }
}

const selectFieldValues = async (fieldName, values) => {  
  const f = value => {
    let obj = null
    if (typeof value == "number") {
      obj =  {qIsNumeric: true, qNumber: value}
    } else if (typeof value == "string") {
      obj =  {qIsNumeric: false, qText: value}
    } else if (typeof value.number == "number") {
      obj =  {qIsNumeric: true, qNumber: value.number}
    } else if (typeof value.text == "string") {
      obj =  {qIsNumeric: false, qText: value.text}
    }
    return obj
  }
  
  const engine = await qdtComponents.qDocPromise        
  const field = await engine.getField(fieldName)
  const qValues = values.map ? values.map(value => f(value)) : [f(value)]  
  
  if (qValues) {
    const response = await field.selectValues(qValues)    
    if (response) {
      return values
    } else {
      return null
    }
  } else {
    return null
  }
}

// const qlikAPI = {
//   clearField,
//   destroySessionObject,
//   generateHypercubeObjectFromDef,
//   generateListObject, 
//   getFieldValueByIndex,
//   getObjectFromId,
//   getValuesFromListObject,
//   getValuesFromHypercubeObject,
//   getVariableValueByName,
//   lookupIndexByFieldValue,
//   lookupValueByFieldValue,
//   lookupIndexByMultipleFieldValues,
//   lookupValueByMultipleFieldValues,
//   selectFieldValues,
// }


