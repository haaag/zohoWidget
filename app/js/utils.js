import { sendMailCRM, addNote, getCRMWares, getOffers, globalOffers, MODULE_NAME, closeWidget, closeWidgetReload } from './utilsCrm.js'
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

async function validateFields(recordData, requiredField) {
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
    console.error('validateFields', error.name, error.message)
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

async function userLoop() {
  try {
    cleanDisplay()
    crmUser.cleanUserProperties()

    const rawData = await getCRMWares()
    const wares = prepareCRMData(rawData)
    globalWares = wares

    loadingAlert('Cargando Clusters...').then(() => {
      displayItemsList(wares, 'wares', form, container)
      makeButton('Ver Beneficio', 'button-ofertas', displayOffers)
      title.innerHTML = 'Selecciona tu Cluster'
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
  if (!crmUser.ware.id) return noSelectedAlert('Tienes que seleccionar un Cluster')

  loadingAlert('Buscando Beneficios...', 4000)
  let offersAPI = await getOffers(crmUser.ware.url)
  let message = offersAPI.data.message

  if (offersAPI.code !== 200) return errorNoOfferAlert(`${crmUser.ware.name}`, message)

  loadingAlert('Cargando Beneficios...', 2000).then(() => {
    cleanDisplay()
    displayItemsList(offersAPI.data, 'offers', form, container)
    makeButton('Volver', 'button-back', userLoop)
    makeButton('Enviar Beneficio', 'button-send', sendOffer)
    document.getElementById('title').innerHTML = 'Selecciona tu Beneficio'
  })
}

function sendOffer() {
  if (!crmUser.offer.id) return noSelectedAlert('Tienes que seleccionar una Beneficio')

  const message = `Seleccionaste Cluster '${crmUser.ware.name}' con Beneficio '${crmUser.offer.name}'`

  confirmSendDataAlert(message).then((isConfirm) => {
    if (isConfirm) {
      loadingAlert('Enviando información...', 6500)

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
            // let note_content = `Se envió información con Cluster: ${crmUser.ware.name} y Beneficio: ${crmUser.offer.name}`
            // addNote(MODULE_NAME, note_content, crmUser.potential.id)
            closeWidgetReload()
          }
        })
      })
    }
  })
}

async function validateStages(recordData, validStages) {
  try {
    if (!recordData) return interactiveAlert('Error: Validate Stages', 'error').then(() => closeWidget())
    const formStage = recordData['Stage']

    let message = `Stage No Valido: ${formStage}`
    if (!validStages.includes(formStage)) return interactiveAlert(message, 'error').then(() => closeWidget())
    return true
  } catch (error) {
    console.log('validateStages', error.name, error.message)
  }
}

function cleanDisplay() {
  title.innerHTML = ''
  form.innerHTML = ''
  buttonHolder.innerHTML = ''
  container.innerHTML = ''
}

function showUser() {
  console.log(crmUser)
}

export { userLoop, prepareCRMData, getItemSelected, makeRadioBox, displayItemsList, validateFields, crmUser, showUser, validateStages }
