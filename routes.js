const express = require("express");

const {register, login, profile, logout} = require("./controller/penggunaController");
const {homePage, getAbjad, getKategori, getKota, findWisata, getWishlist} = require("./controller/homeController");
const {detailWisata, addWishlist, deleteWishlist} = require("./controller/wisataController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/account", profile);
router.get("/logout/:id", logout);

//router.get("/home", homePage); //1
// router.get("/Abjad", getAbjad);
// router.get("/Kategori", getKategori);
// router.get("/Kota", getKota);
// router.get("/search", findWisata);
// router.get("/wishlist", getWishlist); 

router.get("/informasi", detailWisata);
router.post("/add/:nama_tempat", addWishlist);
router.delete("/delete/:nama_tempat", deleteWishlist);

module.exports = router;
