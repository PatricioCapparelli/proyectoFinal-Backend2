import BusinessModel from "../models/business.model.js";

export default class Business {
  getBusiness = async () => {
    try {
      const Business = await BusinessModel.find();
      return Business;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  getBusinessById = async (id) => {
    try {
      const Business = await BusinessModel.findOne({ _id: id });
      return Business;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  createBusiness = async (Business) => {
    try {
      const result = await BusinessModel.create(Business);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  updateBusiness = async (id, Business) => {
    try {
      const result = await BusinessModel.updateOne({ _id: id }, { $set: Business });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
