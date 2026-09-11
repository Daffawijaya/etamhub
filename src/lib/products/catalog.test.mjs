import assert from "node:assert/strict";
import test from "node:test";
import { filterCatalogProducts } from "./catalog.ts";

const products = [
  {
    id: "1",
    slug: "amplang",
    nama: "Amplang Tenggiri",
    deskripsi: "Camilan khas Kukar",
    harga: 30_000,
    satuan: "bungkus",
    gambar: [],
    created_at: "2026-09-10T00:00:00.000Z",
    product_legalitas: [],
    umkm: {
      id: "u1",
      slug: "dapur-etam",
      nama: "Dapur Etam",
      kecamatan: "Tenggarong",
      kategori: "Industri",
      subkategori: "Makanan Olahan",
    },
  },
  {
    id: "2",
    slug: "tas-anyaman",
    nama: "Tas Anyaman",
    deskripsi: null,
    harga: null,
    satuan: null,
    gambar: [],
    created_at: "2026-09-11T00:00:00.000Z",
    product_legalitas: [],
    umkm: {
      id: "u2",
      slug: "kriya-mahakam",
      nama: "Kriya Mahakam",
      kecamatan: "Loa Kulu",
      kategori: "Industri",
      subkategori: "Kerajinan Tangan",
    },
  },
];

const baseFilters = {
  search: "",
  category: "",
  district: "",
  price: "",
  sort: "newest",
};

test("catalog search, filters, and price sorting stay consistent", () => {
  assert.deepEqual(
    filterCatalogProducts(products, {
      ...baseFilters,
      search: "dapur tenggarong",
    }).map((product) => product.slug),
    ["amplang"],
  );

  assert.deepEqual(
    filterCatalogProducts(products, {
      ...baseFilters,
      district: "Loa Kulu",
      price: "unpriced",
    }).map((product) => product.slug),
    ["tas-anyaman"],
  );

  assert.deepEqual(
    filterCatalogProducts(products, {
      ...baseFilters,
      sort: "price-low",
    }).map((product) => product.slug),
    ["amplang", "tas-anyaman"],
  );
});
