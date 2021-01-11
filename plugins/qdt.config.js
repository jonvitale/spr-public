import QdtComponents from 'qdt-components'

const host = 'dashboards.philasd.org' // window.location.hostname

const config = {
  host,
  prefix: '',
  port: host === 'localhost' ? 4848 : 443, // window.location.port,
  secure: host === 'localhost' ? window.location.protocol === 'https:' : true,
  appId:
    host === 'localhost'
      ? 'School Progress Reports'
      : '6c6a4d8a-129e-4681-bd39-7171deacebf1'
}
const connections = {
  vizApi: true,
  engineApi: true
}
const qdtComponents = new QdtComponents(config, connections)

console.log('opening port', config.port)

export default ({ app }, inject) => {
  inject('qdt', qdtComponents)
}
