import Vue from 'vue';
import QdtComponents from 'qdt-components'

import uslDef from "~/definitions/usl"

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

const getVariableValueByName = async (variableName) => {
  const variable = await engine.getVariableByName(variableName)
  return variable
}

const lookupIndexByFieldValue = (values, sourceField, sourceFieldValue) => {
  // console.log("lookupIndexByFieldValue", values, sourceField, sourceFieldValue)
  if (values && values[sourceField].length) {
    const fieldValues = values[sourceField]
    // add the index in the values object
    let fieldValuesIndex = fieldValues.map((val, index) => ({...val, index}))
    // filter the source field to only the target value
    fieldValuesIndex = fieldValuesIndex.filter(val => val.text == sourceFieldValue)
    if (fieldValuesIndex.length > 0) {
      return fieldValuesIndex[0].index    
    } else {
      console.log("lookupIndexByFieldValue could not find index", values, sourceField, sourceFieldValue)
      return -1
    }
  } else {
    return -1
  }
}

const lookupValueByFieldValue = (values, sourceField, sourceFieldValue, targetField) => {
  const index = lookupIndexByFieldValue(values, sourceField, sourceFieldValue)
  if (index >= 0) {
    return values[targetField][index]
  } else {
    return null
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

const qlikAPI = {
  clearField,
  destroySessionObject,
  generateHypercubeObjectFromDef,
  generateListObject, 
  getObjectFromId,
  getValuesFromListObject,
  getValuesFromHypercubeObject,
  getVariableValueByName,
  lookupIndexByFieldValue,
  lookupValueByFieldValue,
  selectFieldValues,
}


export default async ({ app, store }) => {
  store.commit('setQdtComponents', qdtComponents)
  Vue.prototype.$qdt = qdtComponents
  Vue.prototype.$qlik = qlikAPI

  const sessionObject = await generateHypercubeObjectFromDef(uslDef)
  const values = await getValuesFromHypercubeObject(sessionObject)
  if (values[Object.keys(values)[0]].length < 1) {
    throw Error("USL is not returning any values, make sure to check definitions. < 10,000 cells")
  }
  store.dispatch("schools/set_schools", values)
}