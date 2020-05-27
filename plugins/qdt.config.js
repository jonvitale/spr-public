import QdtComponents from 'qdt-components'

const config = {
  host: window.location.hostname,
  prefix: '',
  port: window.location.hostname === 'localhost' ? 4848 : window.location.port,
  secure: window.location.protocol === 'https:',
  appId:
    window.location.hostname === 'localhost'
      ? 'School Progress Reports'
      : '6c6a4d8a-129e-4681-bd39-7171deacebf1'
}
const connections = {
  vizApi: true,
  engineApi: true
}
const qdtComponents = new QdtComponents(config, connections)

export default ({ app }, inject) => {
  inject('qdt', qdtComponents)
}
