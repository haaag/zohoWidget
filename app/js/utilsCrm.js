import { errorNoClusters } from './alerts'

const MODULE_NAME = 'Deals'
var globalOffers

async function sendMailCRM(potentialData) {
  /*
   * @potentialData - userCrm object
   * @return bool
   */
  const { ware, offer, potential } = potentialData
  const start = Date.now()
  try {
    let functionName = 'widget_send'
    let sendArgs = {
      arguments: JSON.stringify({
        offer_token: offer.token,
        ware_id: ware.id,
        form_id: potential.id,
        ware_name: ware.name,
        offer_name: offer.name,
      }),
    }

    const crmSend = await ZOHO.CRM.FUNCTIONS.execute(functionName, sendArgs).then((data) => {
      const result = data['details']['output']
      const response = JSON.parse(result)
      if (response.code !== 201) {
        return false
      }
      return true
    })

    return crmSend
  } catch (err) {
    console.error(err)
  } finally {
    console.info(Date.now() - start)
  }
}

function addNote(moduleName, content, potentialID) {
  /*
   * @moduleName: string
   * @content: string - note's content
   * @potentialID: string
   * The return value is 'none'
   */
  ZOHO.CRM.API.addNotes({
    Entity: moduleName,
    RecordID: potentialID,
    Title: 'Selección Cluster & Beneficio',
    Content: content,
  })
}

async function getCRMWares() {
  const moduleWares = 'Wares'
  const crmWares = await ZOHO.CRM.API.getAllRecords({
    Entity: moduleWares,
  }).then(function (data) {
    let clusterList = data['data']

    if (clusterList.length > 0) {
      errorNoClusters('Por favor si persiste el problema, comunicate con el administrador.', 'No hay Clusters').then((clickOk) => {
        if (clickOk) return closeWidget()
      })
    }

    // return data['data']
    return clusterList
  })
  return await crmWares
}

async function getOffers(wareID) {
  /*
   * @wareURL: string
   * The return value is Array(objects)
   */
  let connName = 'widget_offers'
  let sendData = {
    ware_id: wareID,
  }
  const response = await ZOHO.CRM.FUNCTIONS.execute(connName, sendData)
  const offersList = JSON.parse(response['details']['output'])
  globalOffers = offersList['data']
  return offersList
}

async function getRecordData(moduleName, potentialID) {
  /*
   * @moduleName: string
   * @userData: string
   * The return value is object
   */
  const formData = await ZOHO.CRM.API.getRecord({
    Entity: moduleName,
    RecordID: potentialID,
  }).then(function (data) {
    if (data.status != 204) {
      return data['data'][0]
    } else {
      return null
    }
  })
  return await formData
}

const closeWidget = ZOHO.CRM.UI.Popup.close
const closeWidgetReload = ZOHO.CRM.UI.Popup.closeReload

export { addNote, getCRMWares, getOffers, globalOffers, getRecordData, MODULE_NAME, sendMailCRM, closeWidget, closeWidgetReload }
