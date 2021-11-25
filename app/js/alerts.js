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

function noSelectedAlert(message) {
  return swal(message, {
    icon: 'info',
    button: true,
    closeOnClickOutside: false,
  })
}

function errorNoOfferAlert(message, title) {
  return swal(message, { title: title, icon: 'error', timer: 1700 })
}

function errorGettingOffers(message) {
  return swal(message, { icon: 'error', button: true })
}

function interactiveAlert(message, icon) {
  return swal(message, { button: true, icon: icon, closeOnClickOutside: false })
}

export { confirmSendDataAlert, errorMissingDataAlert, loadingAlert, noSelectedAlert, errorNoOfferAlert, interactiveAlert, errorGettingOffers }
