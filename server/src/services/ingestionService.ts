import Product from "../models/Product";

import Store from "../models/Store";

import { fetchProductsFromShopify } from "../integrations/shopifyService";

import { normalizeProduct } from "../utils/normalizeProduct";

export const syncShopifyProductsService =
  async () => {
    const rawProducts =
      await fetchProductsFromShopify();

    const store = await Store.findOne();

    if (!store) {
      throw new Error(
        "No connected store found"
      );
    }

    let syncedCount = 0;

    for (const rawProduct of rawProducts) {
      try {
        const normalized =
          normalizeProduct(rawProduct);

        // prevent duplicate products
        const existingProduct =
          await Product.findOne({
            "metadata.shopifyProductId":
              rawProduct.id,
          });

        if (existingProduct) {
          continue;
        }

        await Product.create({
          storeId: store._id,

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

    return {
      syncedCount,
    };
  };