class CrmUser {
  constructor() {
    this.potential = { id: "" };
    this.ware = { id: "", name: "" };
    this.offer = { id: "", name: "" };
  }

  setPotentialID(recordID) {
    this.potential.id = recordID;
    return this;
  }

  setWare(ware) {
    this.ware = ware;
    return this;
  }

  getWare() {
    return this.ware;
  }

  setOffer(offer) {
    this.offer = offer;
    return this;
  }

  getOffers() {
    return this.offer;
  }

  cleanUserProperties() {
    this.ware = {};
    this.offer = {};
    return this;
  }
}

export { CrmUser };
