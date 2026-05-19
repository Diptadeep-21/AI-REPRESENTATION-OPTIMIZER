import Store
from "../models/Store";

import Product
from "../models/Product";

import Analysis
from "../models/Analysis";

/*
 =====================================
 CREATE DEMO WORKSPACE
 =====================================
*/

export const setupDemoWorkspace =
  async (
    userId: string
  ) => {

    /*
     =====================================
     FIND OR CREATE USER STORE
     =====================================
    */

    let demoStore =
      await Store.findOne({

        owner: userId,
      });

    /*
     =====================================
     CREATE STORE IF NOT EXISTS
     =====================================
    */

    if (!demoStore) {

      demoStore =
        await Store.create({

          owner: userId,

          storeName:
            "Demo AI Store",

          shopifyDomain:
            `demo-${Date.now()}.myshopify.com`,

          accessToken:
            "demo-token",

          isConnected: true,
        });
    }

    /*
     =====================================
     CHECK EXISTING PRODUCTS
     =====================================
    */

    const existingProducts =
      await Product.countDocuments({

        storeId:
          demoStore._id,
      });

    if (existingProducts > 0) {

      throw new Error(
        "Demo workspace already initialized"
      );
    }

    /*
     =====================================
     FIND MASTER STORE
     =====================================
    */

    const masterStore =
      await Store.findOne({

        shopifyDomain:
          "ai-representation-optimizer.myshopify.com",
      });

    if (!masterStore) {

      throw new Error(
        "Master demo store not found"
      );
    }

    /*
     =====================================
     GET MASTER PRODUCTS
     =====================================
    */

    const masterProducts =
      await Product.find({

        storeId:
          masterStore._id,
      });

    const productMap =
      new Map();

    /*
     =====================================
     CLONE PRODUCTS
     =====================================
    */

    for (const product of masterProducts) {

      const clonedProduct =
        await Product.create({

          storeId:
            demoStore._id,

          title:
            product.title,

          description:
            product.description,

          price:
            product.price,

          images:
            product.images,

          category:
            product.category,

          tags:
            product.tags,

          vendor:
            product.vendor,

          productType:
            product.productType,

          status:
            product.status,

          metadata:
            product.metadata,
        });

      productMap.set(

        product._id.toString(),

        clonedProduct._id
      );
    }

    /*
     =====================================
     GET MASTER ANALYSES
     =====================================
    */

    const masterAnalyses =
      await Analysis.find({

        storeId:
          masterStore._id,
      });

    /*
     =====================================
     CLONE ANALYSES
     =====================================
    */

    for (const analysis of masterAnalyses) {

      const newProductId =
        productMap.get(

          analysis.productId.toString()
        );

      if (!newProductId) {

        continue;
      }

      await Analysis.create({

        storeId:
          demoStore._id,

        productId:
          newProductId,

        scores:
          analysis.scores,

        issues:
          analysis.issues,

        recommendations:
          analysis.recommendations,

        aiInsights:
          analysis.aiInsights,

        analyzedAt:
          analysis.analyzedAt,
      });
    }

    /*
     =====================================
     RETURN
     =====================================
    */

    return {

      success: true,

      storeId:
        demoStore._id,
    };
  };