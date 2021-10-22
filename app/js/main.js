import { validateRecordData, crmUser, userLoop } from './functions.js'
import { getRecordData, MODULE_NAME } from './crm_functions.js'
import { loadingAlert } from './alerts.js'

const requiredAPIField = ['Phone', 'Email', 'Pais']


ZOHO.embeddedApp.init().then(function () {
  loadingAlert("Iniciando Widget...")
  try {
    setTimeout(() => {
      getRecordData(MODULE_NAME, crmUser.potential.id).then((recordData) => {
        validateRecordData(recordData, requiredAPIField).then((proceed) => {
          if (proceed) {
            userLoop()
          }
        })
      })
    }, 1100)
  } catch (err) {
    console.error('On init', err)
  }
})
