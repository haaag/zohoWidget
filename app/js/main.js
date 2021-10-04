import { getFormData, validateFormData, userData, userLoop } from './functions.js'

const moduleName = 'Deals'

ZOHO.embeddedApp.init().then(function () {
  swal('Iniciando Widget', { buttons: false, timer: 1500 })
  setTimeout(() => {
    getFormData(moduleName, userData).then((formData) => {
      validateFormData(formData).then((proceed) => {
        if (proceed) {
          userLoop()
        }
      })
    })
  }, 1100)
})
