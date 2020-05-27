// note: qdtComponents must be loaded into the Vue prototype
// in a project plugin. Look for qdt.config.js

import uslDef from '~/definitions/usl'

// console.log("init.store.js", Vue.prototype, Vue.prototype.$qdt, Vue.prototype.$qlik)

export default async ({ app, store }) => {
  const sessionObject = await app.$qlik.generateHypercubeObjectFromDef(uslDef)
  const values = await app.$qlik.getValuesFromHypercubeObject(sessionObject)
  if (values[Object.keys(values)[0]].length < 1) {
    throw new Error(
      'USL is not returning any values, make sure to check definitions. < 10,000 cells'
    )
  }
  store.dispatch('schools/set_schools', values)
}
