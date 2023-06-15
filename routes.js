const express = require("express");

const {register, login, profile, logout} = require("./controller/penggunaController");
const {getHomepage,  getAbjad, getKategori, getKota, findWisata, getWishlist} = require("./controller/homeController");
const {detailWisata, addWishlist, deleteWishlist} = require("./controller/wisataController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/account", profile);
router.get("/logout/:id", logout);

router.get("/homepage", getHomepage); 
router.get("/Abjad", getAbjad);
router.get("/Kategori/:kategori", getKategori);
router.get("/Kota/:kota", getKota);
router.get("/search/:nama_tempat", findWisata);
router.get("/wishlist/:username", getWishlist); 

router.get("/informasi/:nama_tempat", detailWisata);
router.post("/add", addWishlist);
router.delete("/delete", deleteWishlist);

module.exports = router;
