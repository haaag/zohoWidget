import { sendEmail, addNote, getCRMWares, getOffers, globalOffers } from './crm_functions.js'

let title = document.getElementById('title')
let globalWares
var userData = {}
let container = document.getElementById('container')
let form = document.getElementById('item-display')
let buttonHolder = document.getElementById('buttons')

const closeWidget = ZOHO.CRM.UI.Popup.close
const closeWidgetReload = ZOHO.CRM.UI.Popup.closeReload
const moduleName = 'Deals'
const sendDataAlert = (message) => swal({ title: 'Estas seguro?', text: message, icon: 'info', buttons: true })

// INFO: Populate userData object
ZOHO.embeddedApp.on('PageLoad', function (entity) {
  userData = {
    potential_id: entity.EntityId[0],
    ware: {
      id: '',
      name: '',
      url: '',
      offer: {
        id: '',
        token: '',
        name: '',
      },
    },
  }
})

function cleanCRMData(data) {
  let result = []
  data.forEach((ware) => {
    ware = { id: ware.wareID, name: ware.Name }
    result.push(ware)
  })
  return result
}

const getItemChossed = (item) => {
  if (item.name === 'offers') {
    userData.ware.offer.id = globalOffers[item.value].id
    userData.ware.offer.token = globalOffers[item.value].token
    userData.ware.offer.name = globalOffers[item.value].name
  } else {
    userData.ware.url = `https://0ptnz0iwzg.execute-api.us-east-1.amazonaws.com/qa/wares/${globalWares[item.value].wareID}/offers`
    userData.ware.id = globalWares[item.value].wareID
    userData.ware.name = globalWares[item.value].Name
  }
}

function createRadioBox(data, name, index) {
  let radiobox = document.createElement('input')
  radiobox.type = 'radio'
  radiobox.id = data.id
  radiobox.value = index
  radiobox.name = name
  radiobox.addEventListener('click', () => {
    getItemChossed(radiobox)
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
    const radio = createRadioBox(data[i], type, i)
    form.appendChild(radio)
  }
  container.style.position = 'center'
  container.appendChild(form)
}

async function getFormData(moduleName, userData) {
  const formData = await ZOHO.CRM.API.getRecord({
    Entity: moduleName,
    RecordID: userData.potential_id,
  }).then(function (data) {
    if (data.status != 204) {
      return data['data'][0]
    } else {
      return null
    }
  })
  return await formData
}

async function validateFormData(formData) {
  if (formData != null || formData != undefined) {
    const requiredKey = ['Pais', 'Phone', 'Email']
    let logErrors = []
    requiredKey.map((elem) => {
      // if (formData[elem] === null || formData[elem] === '') {
      if (!formData[elem]) {
        logErrors.push(elem)
      }
    })
    if (logErrors.length > 0) {
      let newLine = '\n- '
      let message = 'Falta completar los siguientes campos:\n'
      for (const error in logErrors) {
        message = message + newLine + logErrors[error]
      }
      let waitOk = await swal(message, {
        title: 'Falta Información',
        icon: 'warning',
        button: true,
        closeOnClickOutside: false,
      })
      if (waitOk) {
        console.log('Error: Falta de Datos')
        closeWidget()
      }
    } else {
      // console.log('Datos Validados')
      return true
    }
  } else {
    console.log('Error: on Validate')
    swal('Error: On validate data.')
    return false
  }
}

async function userLoop() {
  cleanDisplay()
  clearUserData()
  const data = await getCRMWares()
  globalWares = data
  const wares = cleanCRMData(data)
  swal('Cargando Wares', {
    buttons: false,
    timer: 1500,
  }).then(() => {
    displayItemsList(wares, 'wares', form, container)
    createButton('Ver Ofertas', 'button-ofertas', newShowOffers)
    title.innerHTML = 'Selecciona tu Ware'
  })
}

function createButton(inner, className, func) {
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

async function showOffers() {
  const container = document.getElementById('container')
  const form = document.getElementById('item-display')
  if (!userData.ware.id) {
    // if (userData.ware.id === '' || userData.ware.id === null) {
    let message = 'Tienes que seleccionar un Ware'
    swal(message, {
      icon: 'info',
      button: true,
      closeOnClickOutside: false,
    })
  } else {
    const offers = await getOffers(userData.ware.url)
    let message = offers['data']['message']
    if (offers.code === 200) {
      cleanDisplay()
      swal('Buscando Ofertas!', {
        button: false,
        timer: 2000,
      }).then(() => {
        displayItemsList(offers['data'], 'offers', form, container)
        document.getElementById('title').innerHTML = 'Selecciona tu Oferta'
        createButton('Enviar Oferta', 'button-send', sendOffer)
      })
    } else {
      swal(`${userData.ware.name}`, {
        title: message,
        icon: 'error',
        button: false,
        timer: 1500,
      })
    }
  }
}

async function newShowOffers() {
  const container = document.getElementById('container')
  const form = document.getElementById('item-display')
  // if (userData.ware.id === '' || userData.ware.id === null) {
  if (!userData.ware.id) {
    let message = 'Tienes que seleccionar un Ware'
    swal(message, {
      icon: 'info',
      button: true,
      closeOnClickOutside: false,
    })
  } else {
    swal('Buscando Ofertas', {
      button: false,
      timer: 1000,
    }).then(async () => {
      let offers = await getOffers(userData.ware.url)
      let message = offers['data']['message']
      if (offers.code === 200) {
        cleanDisplay()
        displayItemsList(offers['data'], 'offers', form, container)
        document.getElementById('title').innerHTML = 'Selecciona tu Oferta'
        createButton('Volver', 'button-back', userLoop)
        createButton('Enviar Oferta', 'button-send', sendOffer)
      } else {
        let title = `${userData.ware.name}`
        swal(title, {
          title: message,
          icon: 'error',
          button: false,
          timer: 1800,
        })
      }
    })
  }
}

function sendOffer() {
  // if (userData.ware.offer.id === "" || userData.ware.offer.id === null) {
  if (!userData.ware.offer.id) {
    let message = 'Tienes que seleccionar una Oferta'
    swal(message, {
      icon: 'info',
      button: true,
      closeOnClickOutside: false,
    })
  } else {
    const message = `Seleccionaste Ware '${userData.ware.name}' con Oferta '${userData.ware.offer.name}'`
    sendDataAlert(message).then((readyToSend) => {
      if (readyToSend) {
        sendEmail(userData.ware.id, userData.ware.offer.token, userData.potential_id, userData.ware.name, userData.ware.offer.name).then((response) => {
          if (!response) {
            let message = 'Hubo un error en el envío de Información.\nFavor ver notas.'
            swal(message, {
              button: true,
              icon: 'error',
              closeOnClickOutside: false,
            }).then((click) => {
              if (click) {
                closeWidgetReload()
              }
            })
          } else {
            let note_content = `Se envió información con Ware: ${userData.ware.name} y Oferta: ${userData.ware.offer.name}`
            addNote(moduleName, note_content, userData.potential_id)
            swal('Información enviada con éxito!', {
              icon: 'success',
              button: true,
              closeOnClickOutside: false,
            }).then((click) => {
              if (click) {
                closeWidgetReload()
              }
            })
          }
        })
      }
    })
  }
}

function cleanDisplay() {
  title.innerHTML = ''
  form.innerHTML = ''
  buttonHolder.innerHTML = ''
  container.innerHTML = ''
  // document.getElementById('button-ofertas').style.display = 'none'
}

function clearUserData() {
  userData.ware = {
    id: '',
    name: '',
    url: '',
    offer: {
      id: '',
      token: '',
      name: '',
    },
  }
}

function showMeUser() {
  console.log(userData)
}

export { userLoop, cleanCRMData, getItemChossed, createRadioBox, displayItemsList, getFormData, validateFormData, userData }
