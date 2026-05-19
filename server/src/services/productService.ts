import Product
from "../models/Product";

import {
  getCurrentStore,
} from "../utils/getCurrentStore";

/*
 =====================================
 GET ALL PRODUCTS
 =====================================
*/

export const getAllProductsService =
  async (
    userId: string
  ) => {

    const store =
      await getCurrentStore(
        userId
      );

    return await Product.find({

      storeId:
        store._id,
    });
  };

/*
 =====================================
 CREATE PRODUCT
 =====================================
*/

export const createProductService =
  async (

    userId: string,

    productData: any
  ) => {

    const store =
      await getCurrentStore(
        userId
      );

    return await Product.create({

      ...productData,

      storeId:
        store._id,
    });
  };

  /*
 =====================================
 GET SINGLE PRODUCT
 =====================================
*/

export const getSingleProductService =
  async (

    userId: string,

    productId: string
  ) => {

    const store =
      await getCurrentStore(
        userId
      );

    const product =
      await Product.findOne({

        _id: productId,

        storeId:
          store._id,
      });

    if (!product) {

      throw new Error(
        "Product not found"
      );
    }

    return product;
  };