function confirmSendDataAlert(message) {
  return swal({ title: 'Estas seguro?', buttons: ['Volver', 'Enviar'], text: message, icon: 'info' })
}

function errorMissingDataAlert(message) {
  return swal(message, {
    title: 'Falta Información',
    icon: 'warning',
    button: true,
    closeOnClickOutside: false,
  })
}

function loadingAlert(message, timer = 1500) {
  return swal(message, { buttons: false, timer: timer })
}

const noSelectedAlert = (message) =>
  swal(message, {
    icon: 'info',
    button: true,
    closeOnClickOutside: false,
  })

const errorNoOfferAlert = (message, title) => swal(message, { title: title, icon: 'error', button: false, timer: 1500 })

const interactiveAlert = (message, icon) => swal(message, { button: true, icon: icon, closeOnClickOutside: false })

export { confirmSendDataAlert, errorMissingDataAlert, loadingAlert, noSelectedAlert, errorNoOfferAlert, interactiveAlert }
