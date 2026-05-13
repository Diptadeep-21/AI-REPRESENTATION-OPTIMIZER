import Store from "../models/Store";

export const createStoreService = async (
  storeData: any
) => {
  return await Store.create(storeData);
};

export const getAllStoresService = async () => {
  return await Store.find();
};