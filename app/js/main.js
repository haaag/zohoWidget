import { validateFormData, userData, userLoop } from './functions.js'
import { getFormData, moduleName } from './crm_functions.js'

ZOHO.embeddedApp.init().then(function () {
  swal('Iniciando Widget', { buttons: false, timer: 1500 })
  try {
    setTimeout(() => {
      getFormData(moduleName, userData).then((formData) => {
        validateFormData(formData).then((proceed) => {
          if (proceed) {
            userLoop()
          }
        })
      })
    }, 1100)
  } catch (err) {
    console.error(err)
  }
})
