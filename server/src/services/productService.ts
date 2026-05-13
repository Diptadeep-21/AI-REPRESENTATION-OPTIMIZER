import Product from "../models/Product";

export const getAllProductsService = async () => {
  return await Product.find();
};

export const createProductService = async (
  productData: any
) => {
  return await Product.create(productData);
};