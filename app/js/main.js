import { validateFields, crmUser, userLoop, validateStages } from './utils.js'
import { getRecordData, MODULE_NAME } from './utilsCrm.js'
import { loadingAlert } from './alerts.js'

const requiredAPIField = ['Phone', 'Email', 'Pais']
const validStages = ['Información enviada', 'Interesado - Nivel 2', 'Próximo a cerrar', 'Boton de Pago Enviado']

ZOHO.embeddedApp.init().then(function () {
  loadingAlert('Iniciando Widget...')
  try {
    setTimeout(() => {
      getRecordData(MODULE_NAME, crmUser.potential.id).then((recordData) => {
        validateStages(recordData, validStages).then((validated) => {
          if (validated) {
            validateFields(recordData, requiredAPIField).then((proceed) => {
              if (proceed) {
                userLoop()
              }
            })
          }
        })
      })
    }, 1100)
  } catch (err) {
    console.error('On init', err)
  }
})
