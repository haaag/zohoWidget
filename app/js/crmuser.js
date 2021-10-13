class CrmUser {
  constructor() {
    this.potential = {}
    this.ware = {}
    this.offer = {}
  }

  setPotentialID(recordID) {
    this.potential.id = recordID
    return this
  }

  setWare(ware) {
    const wareUrl = `https://0ptnz0iwzg.execute-api.us-east-1.amazonaws.com/qa/wares/${ware.id}/offers`
    this.ware = ware
    this.ware.url = wareUrl
    return this
  }

  getWare() {
    return this.ware
  }

  setOffer(offer) {
    this.offer = offer
    return this
  }

  getOffers() {
    return this.offer
  }

  cleanUserProperties() {
    this.ware = {}
    this.offer = {}
    return this
  }
}

export { CrmUser }
