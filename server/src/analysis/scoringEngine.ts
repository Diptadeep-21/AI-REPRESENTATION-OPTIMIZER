import { IProduct } from "../models/Product";

export interface ProductScores {
  metadataScore: number;

  discoverabilityScore: number;

  trustScore: number;

  mediaScore: number;

  semanticScore: number;

  overallScore: number;
}

export const calculateProductScores =
  (
    product: IProduct
  ): ProductScores => {
    let metadataScore = 100;

    let discoverabilityScore = 100;

    let trustScore = 100;

    let mediaScore = 100;

    let semanticScore = 100;

    /*
     =========================
     METADATA SCORE
     =========================
    */

    if (
      !product.description ||
      product.description.length < 80
    ) {
      metadataScore -= 25;
    }

    if (
      !product.tags ||
      product.tags.length < 3
    ) {
      metadataScore -= 20;
    }

    if (
      !product.productType
    ) {
      metadataScore -= 15;
    }

    /*
     =========================
     DISCOVERABILITY SCORE
     =========================
    */

    if (
      product.title.length < 20
    ) {
      discoverabilityScore -= 20;
    }

    if (
      !product.category
    ) {
      discoverabilityScore -= 15;
    }

    if (
      product.tags.length === 0
    ) {
      discoverabilityScore -= 25;
    }

    /*
     =========================
     TRUST SCORE
     =========================
    */

    if (
      !product.vendor
    ) {
      trustScore -= 20;
    }

    if (
      product.price <= 0
    ) {
      trustScore -= 40;
    }

    /*
     =========================
     MEDIA SCORE
     =========================
    */

    if (
      !product.images ||
      product.images.length === 0
    ) {
      mediaScore -= 50;
    }

    if (
      product.images.length < 2
    ) {
      mediaScore -= 20;
    }

    /*
     =========================
     SEMANTIC SCORE
     =========================
    */

    if (
      !product.metadata
        ?.material
    ) {
      semanticScore -= 20;
    }

    if (
      !product.metadata
        ?.terrain ||
      product.metadata
        .terrain.length === 0
    ) {
      semanticScore -= 20;
    }

    /*
     =========================
     FINAL SCORE
     =========================
    */

    const overallScore =
      Math.round(
        (
          metadataScore +
          discoverabilityScore +
          trustScore +
          mediaScore +
          semanticScore
        ) / 5
      );

    return {
      metadataScore:
        Math.max(
          metadataScore,
          0
        ),

      discoverabilityScore:
        Math.max(
          discoverabilityScore,
          0
        ),

      trustScore:
        Math.max(
          trustScore,
          0
        ),

      mediaScore:
        Math.max(
          mediaScore,
          0
        ),

      semanticScore:
        Math.max(
          semanticScore,
          0
        ),

      overallScore,
    };
  };