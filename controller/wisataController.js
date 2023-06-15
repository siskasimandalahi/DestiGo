const asyncHandler = require ("express-async-handler");
const Firestore = require('@google-cloud/firestore');

const db = new Firestore
({
	projectID: 'destigo-2bac7', keyFilename: './serviceAccount/destigo-2bac7-firebase-adminsdk-k8o5w-bf217375d8.json',
});
//const {uploadImage} = require

//const supabase = createClient ('https://pfxabfbcaljnbvrvsyqj.supabase.co', process.env.SUPABASE_KEY);

// const supabaseUrl = 'https://bpsmobjqnwxpsawzapnn.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)


const detailWisata = asyncHandler(async (req, res) => {
  try {
    const nama_tempat = req.params.nama_tempat;

    if (!nama_tempat) {
      return res.status(400).send({ status: "Gagal", msg: "Parameter nama_tempat tidak ditemukan" });
    }

    let query = db.collection("datawisata").where("nama_tempat", "==", nama_tempat);
    let response = [];

    await query.get().then(async (data) => {
      let docs = data.docs;

      for (const doc of docs) {
        const selectedData = {
          nama_tempat: doc.data().nama_tempat,
          kota: doc.data().kota,
          deskripsi: doc.data().deskripsi,
          kategori: doc.data().kategori,
          alamat: doc.data().alamat,
          lat: doc.data().lat,
          long: doc.data().long,
        };

        // Ambil data gambar dari koleksi datagambar
        const dataGambarRef = db.collection("datagambar").where("nama_tempat", "==", nama_tempat);
        const dataGambarSnapshot = await dataGambarRef.get();

        if (!dataGambarSnapshot.empty) {
          // Ambil url1, url2, url3, url4, dan url5 dari data gambar
          const dataGambar = dataGambarSnapshot.docs[0].data();
          selectedData.url1 = dataGambar.url1;
          selectedData.url2 = dataGambar.url2;
          selectedData.url3 = dataGambar.url3;
          selectedData.url4 = dataGambar.url4;
          selectedData.url5 = dataGambar.url5;
        }

        response.push(selectedData);
      }
      return response;
    });

    return res.status(200).send({ status: "Berhasil", data: response });
  } catch (error) {
    console.error('Content creation error:', error);
    res.status(500).json({ error: 'Content creation failed' });
  }
});


const addWishlist = asyncHandler(async (req, res) => {
  try {
    const username = req.body.username;
    const nama_tempat = req.body.nama_tempat;

    if (!username || !nama_tempat) {
      return res.status(400).send({ status: "Gagal", msg: "Parameter username atau nama_tempat tidak ditemukan" });
    }

    // Cek apakah tempat wisata ada di database
    const tempatWisataRef = db.collection("datawisata").where("nama_tempat", "==", nama_tempat);
    const tempatWisataSnapshot = await tempatWisataRef.get();

    if (tempatWisataSnapshot.empty) {
      return res.status(404).send({ status: "Gagal", msg: "Tempat wisata tidak ditemukan" });
    }

    // Tambahkan tempat wisata ke wishlist pengguna
    const wishlistRef = db.collection("datawishlist").doc(username);
    const wishlistSnapshot = await wishlistRef.get();

    if (!wishlistSnapshot.exists) {
      // Buat dokumen baru jika belum ada
      await wishlistRef.set({ wishlist: [nama_tempat] });
    } else {
      // Tambahkan tempat wisata ke wishlist yang sudah ada
      const wishlist = wishlistSnapshot.data().wishlist;
      if (!wishlist.includes(nama_tempat)) {
        wishlist.push(nama_tempat);
        await wishlistRef.update({ wishlist });
      } else {
        return res.status(400).send({ status: "Gagal", msg: "Tempat wisata sudah ada di wishlist" });
      }
    }

    // Ambil data gambar dari koleksi datagambar
    const dataGambarRef = db.collection("datagambar").where("nama_tempat", "==", nama_tempat);
    const dataGambarSnapshot = await dataGambarRef.get();

    if (dataGambarSnapshot.empty) {
      return res.status(404).send({ status: "Gagal", msg: "Data gambar tidak ditemukan" });
    }

    // Ambil url1 dari data gambar
    const url1 = dataGambarSnapshot.docs[0].data().url1;

    // Kirim respons dengan nama_tempat, username, dan url1
    return res.status(200).send({ status: "Sukses", nama_tempat, username, url1 });

  } catch (error) {
    return res.status(500).send({ status: "Gagal", msg: "Terjadi kesalahan pada server" });
  }
});


const deleteWishlist = asyncHandler(async (req, res) => {
  try {
    const username = req.body.username;
    const nama_tempat = req.body.nama_tempat;

    if (!username || !nama_tempat) {
      return res.status(400).send({ status: "Gagal", msg: "Parameter username atau nama_tempat tidak ditemukan" });
    }

    // Cek apakah wishlist pengguna ada di database
    const wishlistRef = db.collection("datawishlist").doc(username); // Ubah referensi koleksi menjadi "datawishlist"
    const wishlistSnapshot = await wishlistRef.get();

    if (!wishlistSnapshot.exists) {
      return res.status(404).send({ status: "Gagal", msg: "Wishlist pengguna tidak ditemukan" });
    }

    // Hapus tempat wisata dari wishlist pengguna
    const wishlist = wishlistSnapshot.data().wishlist;
    const index = wishlist.indexOf(nama_tempat);

    if (index !== -1) {
      wishlist.splice(index, 1);
      await wishlistRef.update({ wishlist });
      return res.status(200).send({ status: "Berhasil", msg: "Tempat wisata berhasil dihapus dari wishlist" });
    } else {
      return res.status(400).send({ status: "Gagal", msg: "Tempat wisata tidak ditemukan di wishlist" });
    }
  } catch (error) {        console.error('Content creation error:', error);
  res.status(500).json({ error: 'Content creation failed' });}
});


module.exports = {detailWisata, addWishlist, deleteWishlist}