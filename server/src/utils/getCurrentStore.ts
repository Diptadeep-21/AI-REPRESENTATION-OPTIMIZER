import Store
from "../models/Store";

export const getCurrentStore =
  async (
    userId: string
  ) => {

    /*
    =====================================
    FIND MERCHANT STORE
    =====================================
    */

    const store =
      await Store.findOne({

        owner: userId,
      });

    /*
    =====================================
    STORE NOT FOUND
    =====================================
    */

    if (!store) {

      throw new Error(
        "Store not found for merchant"
      );
    }

    return store;
  };