import { sendMailCRM, addNote, getCRMWares, getOffers, globalOffers, MODULE_NAME, closeWidget, closeWidgetReload } from './crm_functions.js'
import { errorMissingDataAlert, interactiveAlert, confirmSendDataAlert, loadingAlert, noSelectedAlert, errorNoOfferAlert } from './alerts.js'
import { CrmUser } from './crmuser.js'

let globalWares
let title = document.getElementById('title')
let container = document.getElementById('container')
let form = document.getElementById('item-display')
let buttonHolder = document.getElementById('buttons')
var crmUser = new CrmUser()

ZOHO.embeddedApp.on('PageLoad', function (entity) {
  const potentialID = entity.EntityId[0]
  crmUser.setPotentialID(potentialID)
})

function prepareCRMData(data) {
  let result = []

  data.forEach((ware) => {
    ware = { id: ware.wareID, name: ware.Name }
    result.push(ware)
  })

  return result
}

function getItemSelected(item) {
  if (item.name === 'offers') {
    const offer = globalOffers[item.value]
    crmUser.setOffer(offer)
  } else {
    const ware = globalWares[item.value]
    crmUser.setWare(ware)
  }
}

function makeRadioBox(data, name, index) {
  let radiobox = document.createElement('input')
  radiobox.type = 'radio'
  radiobox.id = data.id
  radiobox.value = index
  radiobox.name = name
  radiobox.addEventListener('click', () => {
    getItemSelected(radiobox)
  })

  let label = document.createElement('label')
  label.htmlFor = data.id

  let span = document.createElement('span')
  span.innerHTML = data.name
  label.appendChild(radiobox)
  label.appendChild(span)
  return label
}

function displayItemsList(data, type, form, container) {
  for (let i = 0; i < data.length; i++) {
    const radio = makeRadioBox(data[i], type, i)
    form.appendChild(radio)
  }
  container.style.position = 'center'
  container.appendChild(form)
}

async function validateRecordData(recordData, requiredField) {
  try {
    if (!recordData) return interactiveAlert('Error: On validate data', 'error').then(() => closeWidget())

    const missingField = hasFields(recordData, requiredField)

    if (missingField.length === 0) return true

    let itemPrefix = '\n- '
    let message = 'Completar los siguientes campos:\n'
    for (const field in missingField) {
      message = message + itemPrefix + missingField[field]
    }

    errorMissingDataAlert(message).then((clickOk) => {
      if (clickOk) return closeWidget()
    })

  } catch (error) {
    console.error('validateRecordData', error.name, error.message)
  }
}

function hasFields(recordData, checkField) {
    let missingField = []

    checkField.map((field) => {
      if (!recordData[field]) {
        missingField.push(field)
      }
    })

  return missingField
}


async function oldValidateRecordData(recordData, requiredField) {
  try {
    if (!recordData) return interactiveAlert('Error: On validate data', 'error').then(() => closeWidget())

    let missingField = []

    requiredField.map((elem) => {
      if (!recordData[elem]) {
        missingField.push(elem)
      }
    })

    if (missingField.length === 0) return true

    const test = hasFields(recordData, requiredField)
    console.log("test", test)
    let itemPrefix = '\n- '
    let message = 'Completar los siguientes campos:\n'
    for (const field in missingField) {
      message = message + itemPrefix + missingField[field]
    }

    let waitClickOk = await errorMissingDataAlert(message)
    if (waitClickOk) {
      console.log('Error: Missing data', missingField)
      closeWidget()
      return false
    }
  } catch (error) {
    console.error('validateRecordData', error.name, error.message)
  }
}

async function userLoop() {
  try {
    cleanDisplay()
    crmUser.cleanUserProperties()

    const rawData = await getCRMWares()
    const wares = prepareCRMData(rawData)
    globalWares = wares

    loadingAlert('Cargando Wares...').then(() => {
      displayItemsList(wares, 'wares', form, container)
      makeButton('Ver Ofertas', 'button-ofertas', displayOffers)
      title.innerHTML = 'Selecciona tu Ware'
    })
  } catch (error) {
    console.error('userLoop', error.name, error.message)
  }
}

function makeButton(inner, className, func) {
  let btn = document.createElement('button')
  btn.innerHTML = inner
  btn.classList = className
  btn.id = className
  btn.style.display = 'flex'
  btn.style.textAlign = 'center'
  btn.addEventListener('click', () => {
    func()
  })
  buttonHolder.appendChild(btn)

  return btn
}

async function displayOffers() {
  if (!crmUser.ware.id) return noSelectedAlert('Tienes que seleccionar un Ware')

  loadingAlert('Buscando Ofertas...', 4000)
  let offersAPI = await getOffers(crmUser.ware.url)
  let message = offersAPI.data.message

  if (offersAPI.code !== 200) return errorNoOfferAlert(`${crmUser.ware.name}`, message)

  loadingAlert('Cargando Ofertas...', 2000).then(() => {
    cleanDisplay()
    displayItemsList(offersAPI.data, 'offers', form, container)
    makeButton('Volver', 'button-back', userLoop)
    makeButton('Enviar Oferta', 'button-send', sendOffer)
    document.getElementById('title').innerHTML = 'Selecciona tu Oferta'
  })
}

function sendOffer() {
  if (!crmUser.offer.id) return noSelectedAlert('Tienes que seleccionar una Oferta')

  const message = `Seleccionaste Ware '${crmUser.ware.name}' con Oferta '${crmUser.offer.name}'`

  confirmSendDataAlert(message).then((isConfirm) => {
    if (isConfirm) {

      loadingAlert('Enviando información...', 6000)

      sendMailCRM(crmUser).then((response) => {
        if (!response) {
          return interactiveAlert('Hubo un error en el envío de Información.\nFavor ver notas.', 'error').then((closeOk) => {
            if (closeOk) {
              closeWidgetReload()
            }
          })
        }

        let message = 'Información enviada con éxito!'
        interactiveAlert(message, 'success').then((confirm) => {
          if (confirm) {
            let note_content = `Se envió información con Ware: ${crmUser.ware.name} y Oferta: ${crmUser.offer.name}`
            addNote(MODULE_NAME, note_content, crmUser.potential.id)
            closeWidgetReload()
          }
        })
      })
    }
  })
}


function cleanDisplay() {
  title.innerHTML = ''
  form.innerHTML = ''
  buttonHolder.innerHTML = ''
  container.innerHTML = ''
  // makeButton('User', 'nose', showUser)
}

function showUser() {
  console.log(crmUser)
}

export { userLoop, prepareCRMData, getItemSelected, makeRadioBox, displayItemsList, validateRecordData, crmUser, showUser }
