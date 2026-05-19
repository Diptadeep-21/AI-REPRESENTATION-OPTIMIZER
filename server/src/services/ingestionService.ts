import Product from "../models/Product";

import Store from "../models/Store";

import {
  fetchProductsFromShopify,
}
from "../integrations/shopifyService";

import {
  normalizeProduct,
}
from "../utils/normalizeProduct";

/*
 =====================================
 SYNC SHOPIFY PRODUCTS
 =====================================
*/

export const syncShopifyProductsService =
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

    if (!store) {

      throw new Error(
        "No connected store found"
      );
    }

    /*
     =====================================
     FETCH PRODUCTS
     =====================================
    */

    const rawProducts =
      await fetchProductsFromShopify(

        store.shopifyDomain,

        store.accessToken
      );

    let syncedCount = 0;

    /*
     =====================================
     LOOP PRODUCTS
     =====================================
    */

    for (const rawProduct of rawProducts) {

      try {

        const normalized =
          normalizeProduct(
            rawProduct
          );

        /*
         =====================================
         PREVENT DUPLICATES
         =====================================
        */

        const existingProduct =
          await Product.findOne({

            "metadata.shopifyProductId":
              rawProduct.id,

            storeId:
              store._id,
          });

        if (existingProduct) {

          continue;
        }

        /*
         =====================================
         CREATE PRODUCT
         =====================================
        */

        await Product.create({

          storeId:
            store._id,

          title:

            normalized.title ||

            "Untitled Product",

          description:

            normalized.description ||

            "No description provided",

          price:
            normalized.price || 0,

          images:
            normalized.images || [],

          tags:
            normalized.tags || [],

          vendor:
            normalized.vendor || "",

          productType:
            normalized.productType || "",

          status:
            normalized.status || "active",

          metadata: {

            shopifyProductId:
              rawProduct.id,
          },
        });

        syncedCount++;

      } catch (error) {

        console.error(

          "Failed to ingest product:",

          rawProduct?.title,

          error
        );
      }
    }

    /*
     =====================================
     RETURN
     =====================================
    */

    return {

      syncedCount,
    };
  };