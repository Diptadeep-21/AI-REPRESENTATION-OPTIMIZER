import Store
  from "../models/Store";

/*
 =====================================
 CREATE STORE
 =====================================
*/

export const createStoreService =
  async (
    userId: string,
    storeData: any
  ) => {

    console.log(
      "NEW STORE SERVICE RUNNING"
    );

    console.log(
      "USER ID:",
      userId
    );

    const existingStore =
      await Store.findOne({

        owner: userId,
      });

    console.log(
      "EXISTING STORE:",
      existingStore
    );

    if (existingStore) {

      throw new Error(
        "Merchant already has a store"
      );
    }

    return await Store.create({

      ...storeData,

      owner: userId,
    });
  };

/*
 =====================================
 GET CURRENT MERCHANT STORE
 =====================================
*/

export const getAllStoresService =
  async (
    userId: string
  ) => {

    return await Store.find({

      owner: userId,
    });
  };