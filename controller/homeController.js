const asyncHandler = require ("express-async-handler");
const Firestore = require('@google-cloud/firestore');

const db = new Firestore
({
	projectID: 'destigo-2bac7', keyFilename: './serviceAccount/destigo-2bac7-firebase-adminsdk-k8o5w-bf217375d8.json',
});

const getHomepage = asyncHandler(async (req, res) => {
  try {
    const dataWisata = await db.collection('datawisata').get();
    const dataGambar = await db.collection('datagambar').get();
    const dataWishlist = await db.collection('datawishlist').get();

    const dataWisataArray = dataWisata.docs.map(doc => doc.data());
    const dataGambarArray = dataGambar.docs.map(doc => doc.data());
    const dataWishlistArray = dataWishlist.docs.map(doc => doc.data());

    const data = {
      dataWisata: dataWisataArray,
      dataGambar: dataGambarArray,
      dataWishlist: dataWishlistArray,
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Content creation error:', error);
    res.status(500).json({ error: 'Content creation failed' });
  }
});



const getAbjad = asyncHandler(async (req, res) => {
  try {
    let queryDataWisata = db.collection("datawisata");
    let queryDataGambar = db.collection("datagambar");
    let response = [];

    await queryDataWisata.get().then(async (data) => {
      let docs = data.docs; // query results
      let responses = [];

      for (const doc of docs) {
        let docData = doc.data();
        let namaTempat = docData.nama_tempat;

        // Get corresponding datagambar document
        let gambarDoc = await queryDataGambar.where("nama_tempat", "==", namaTempat).limit(1).get();
        if (!gambarDoc.empty) {
          let gambarData = gambarDoc.docs[0].data();
          docData.url1 = gambarData.url1;
        }

        responses.push(docData);
      }

      // Menambahkan fungsi ascending berdasarkan A-Z
      responses.sort((a, b) => {
        if (a.nama_tempat < b.nama_tempat) {
          return -1;
        }
        if (a.nama_tempat > b.nama_tempat) {
          return 1;
        }
        return 0;
      });

      res.status(200).json(responses);
    });
  } catch (error) {
    console.error("Content creation error:", error);
    res.status(500).json({ error: "Content creation failed" });
  }
});

	
const getKategori = asyncHandler(async (req, res) => {
  try {
    const kategori = req.params.kategori;

    if (!kategori) {
      return res
        .status(400)
        .send({ status: "Gagal", msg: "Parameter kategori tidak ditemukan" });
    }

    let queryWisata = db
      .collection("datawisata")
      .where("kategori", "==", kategori);
    let queryGambar = db.collection("datagambar");

    let response = [];

    await Promise.all([
      queryWisata.get(),
      queryGambar.get(),
    ]).then(([dataWisata, dataGambar]) => {
      let docsWisata = dataWisata.docs;
      let docsGambar = dataGambar.docs;

      docsWisata.map((docWisata) => {
        const nama_tempat = docWisata.data().nama_tempat;
        let url1;

        docsGambar.map((docGambar) => {
          if (docGambar.data().nama_tempat === nama_tempat) {
            url1 = docGambar.data().url1;
          }
        });

        const selectedData = {
          nama_tempat: nama_tempat,
          url1: url1,
        };

        response.push(selectedData);
      });
    });

    return res.status(200).send({ status: "Berhasil", data: response });
  } catch (error) {
    console.error("Content creation error:", error);
    res.status(500).json({ error: "Content creation failed" });
  }
});


const getKota = asyncHandler(async (req, res) => {
  try {
    const kota = req.params.kota;

    if (!kota) {
      return res.status(400).send({ status: "Gagal", msg: "Parameter kota tidak ditemukan" });
    }

    let query = db.collection("datawisata").where("kota", "==", kota); // Mengubah query untuk memfilter berdasarkan kota
    let response = [];

    await query.get().then(async (data) => {
      let docs = data.docs; // query results

      for (const doc of docs) {
        const nama_tempat = doc.data().nama_tempat;

        // Pemanggilan collection 'datagambar'
        let queryGambar = db.collection("datagambar").where("nama_tempat", "==", nama_tempat);
        let url1;

        await queryGambar.get().then((gambarData) => {
          gambarData.forEach((gambarDoc) => {
            url1 = gambarDoc.data().url1;
          });
        });

        const selectedData = {
          nama_tempat: nama_tempat,
          url1: url1,
        };

        response.push(selectedData);
      }
      return response;
    });

    return res.status(200).send({ status: "Berhasil", data: response });
  } catch (error) {
    console.error("Content creation error:", error);
    res.status(500).json({ error: "Content creation failed" });
  }
});


  
const findWisata = asyncHandler(async (req, res) => {
  try {
    const nama_tempat = req.params.nama_tempat;

    if (!nama_tempat) {
      return res.status(400).send({ status: "Gagal", msg: "Parameter nama_tempat tidak ditemukan" });
    }

    let query = db.collection("datawisata").where("nama_tempat", "==", nama_tempat);
    let response = [];

    await query.get().then((data) => {
      let docs = data.docs;

      docs.map((doc) => {
        const selectedData = {
          nama_tempat: doc.data().nama_tempat,
          kota: doc.data().kota,
        };

        response.push(selectedData);
      });
      return response;
    });

    return res.status(200).send({ status: "Berhasil", data: response });
  } catch (error) {        console.error('Content creation error:', error);
  res.status(500).json({ error: 'Content creation failed' });}
});

const getWishlist = asyncHandler(async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return res.status(400).send({ status: "Gagal", msg: "Parameter username tidak ditemukan" });
    }

    // Ubah referensi koleksi menjadi "datawishlist"
    const wishlistRef = db.collection("datawishlist").doc(username);
    const wishlistSnapshot = await wishlistRef.get();

    if (!wishlistSnapshot.exists) {
      return res.status(404).send({ status: "Gagal", msg: "Wishlist pengguna tidak ditemukan" });
    }

    const wishlist = wishlistSnapshot.data().wishlist;
    const wishlistWithUrl1 = [];

    // Ambil url1 dari datagambar untuk setiap nama_tempat dalam wishlist
    for (const nama_tempat of wishlist) {
      const dataGambarRef = db.collection("datagambar").where("nama_tempat", "==", nama_tempat);
      const dataGambarSnapshot = await dataGambarRef.get();

      if (!dataGambarSnapshot.empty) {
        const url1 = dataGambarSnapshot.docs[0].data().url1;
        wishlistWithUrl1.push({ nama_tempat, url1 });
      } else {
        wishlistWithUrl1.push({ nama_tempat, url1: null });
      }
    }

    return res.status(200).send({ status: "Berhasil", data: wishlistWithUrl1 });
  } catch (error) {
    console.error('Content creation error:', error);
    res.status(500).json({ error: 'Content creation failed' });
  }
});



module.exports = {getHomepage,getAbjad, getKategori, getKota, findWisata, getWishlist,}

