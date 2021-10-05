var globalOffers

async function sendEmail(ware, offerToken, potentialID, wareName, offerName) {
  /*
   * @ware: string - ware_id seleccionado por el usuario
   * @offer_token: string - token seleccionado por el usuario
   * @potentialID: string - potential id
   * @wareName: string - potential id
   * @offerName: string - potential id
   * The return value is 'bool'
   */
  swal('Enviando información', {
    icon: false,
    button: false,
    timer: 3000,
  })
  let connName = 'widget_send'
  let sendData = {
    arguments: JSON.stringify({
      offer_token: offerToken,
      ware_id: ware,
      form_id: potentialID,
      ware_name: wareName,
      offer_name: offerName,
    }),
  }
  const send = await ZOHO.CRM.FUNCTIONS.execute(connName, sendData).then((data) => {
    const result = data['details']['output']
    const response = JSON.parse(result)
    if (response.code !== 201) {
      return false
    }
    return true
  })
  return send
}

function addNote(moduleName, content, potentialID) {
  /*
   * @content: string - note's content
   * The return value is 'none'
   */
  ZOHO.CRM.API.addNotes({
    Entity: moduleName,
    RecordID: potentialID,
    Title: 'Selección Wares & Ofertas',
    Content: content,
  })
}

async function getCRMWares() {
  const moduleName = 'Wares'
  const crmWares = await ZOHO.CRM.API.getAllRecords({
    Entity: moduleName,
  }).then(function (data) {
    return data['data']
  })
  return await crmWares
}

async function getOffers(wareURL) {
  let connName = 'widget_offers'
  let sendData = {
    ware_url: wareURL,
  }
  const res = await ZOHO.CRM.FUNCTIONS.execute(connName, sendData)
  const offersList = JSON.parse(res['details']['output'])
  globalOffers = offersList['data']
  return offersList
}

export { sendEmail, addNote, getCRMWares, getOffers, globalOffers }
