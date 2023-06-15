const asyncHandler = require ("express-async-handler");
const Firestore = require('@google-cloud/firestore');

const db = new Firestore
({
	projectID: 'destigo-2bac7', keyFilename: './serviceAccount/destigo-2bac7-firebase-adminsdk-k8o5w-bf217375d8.json',
});

const getHomepage = asyncHandler (async (req, res) => {
  try {
    // Mendapatkan daftar kota
    const kotaList = await getKota(req, res);

    // Mendapatkan daftar kategori
    const kategoriList = ['Alam', 'Budaya', 'Kuliner', 'Pusat Perbelanjaan', 'Taman Hiburan', 'Tempat Ibadah']; // Ganti dengan kategori yang sesuai

    // Mendapatkan wishlist pengguna
    const username = req.query.username;
    const wishlist = await getWishlist({ params: { username } }, res);

    // Menyusun data untuk homepage
    const homepageData = {
      kotaList: kotaList.data,
      kategoriList,
      wishlist: wishlist.data,
    };

    res.status(200).send({ status: 'Berhasil', data: homepageData });
  } catch (error) {        console.error('Content creation error:', error);
        res.status(500).json({ error: 'Content creation failed' });}
});

const getHomekota = asyncHandler(async (req, res) => {
  try {
    const kota = req.params.kota;
    const kategori = req.query.kategori;
    const nama_tempat = req.query.nama_tempat;

    let query = db.collection('datawisata').where('kota', '==', kota);

    if (kategori) {
      query = query.where('kategori', '==', kategori);
    }

    if (nama_tempat) {
      query = query.where('nama_tempat', '==', nama_tempat);
    }

    let response = [];

    await query.get().then((data) => {
      let docs = data.docs;

      docs.map((doc) => {
        const selectedData = {
          nama_tempat: doc.data().nama_tempat,
          kategori: doc.data().kategori,
          alamat: doc.data().alamat,
          kota: doc.data().kota,
          deskripsi: doc.data().deskripsi,
          lat: doc.data().lat,
          long: doc.data().long,
        };

        response.push(selectedData);
      });
      return response;
    });

    res.status(200).send({ status: 'Berhasil', data: response });
  } catch (error){        console.error('Content creation error:', error);
        res.status(500).json({ error: 'Content creation failed' });}
});


const getAbjad = asyncHandler (async(req,res) => {
	 try {
        let query = db.collection("datawisata");
        let response = [];
  
         await query.get().then((data) => 
		 {
			 let docs = data.docs; // query results
			 let responses = []

			 docs.forEach((doc)=>
			 {
				responses.push(doc.data());
			 });
				res.status(200).json(responses);
		});
		
        } 
        catch (error) 
        {        console.error('Content creation error:', error);
        res.status(500).json({ error: 'Content creation failed' });}
    });
	
    const getKategori = asyncHandler (async(req,res) => {
      try {
            const kategori = req.params.kategori; 
      
            if (!kategori) {
              return res.status(400).send({ status: "Gagal", msg: "Parameter kategori tidak ditemukan" });
            }
      
            let query = db.collection("datawisata").where("kategori", "==", kategori); // Mengubah query untuk memfilter berdasarkan kota
            let response = [];
      
            await query.get().then((data) => {
              let docs = data.docs; // query results
      
              docs.map((doc) => {
                const selectedData = {
                  nama_tempat: doc.data().nama_tempat,
                };
      
                response.push(selectedData);
              });
              return response;
            });
      
            return res.status(200).send({ status: "Berhasil", data: response });
          } 
        catch (error) 
        {        console.error('Content creation error:', error);
      res.status(500).json({ error: 'Content creation failed' });}
});

const getKota = asyncHandler (async(req,res) => {
	try {
        const kota = req.params.kota; 
  
        if (!kota) {
          return res.status(400).send({ status: "Gagal", msg: "Parameter kota tidak ditemukan" });
        }
  
        let query = db.collection("datawisata").where("kota", "==", kota); // Mengubah query untuk memfilter berdasarkan kota
        let response = [];
  
        await query.get().then((data) => {
          let docs = data.docs; // query results
  
          docs.map((doc) => {
            const selectedData = {
              nama_tempat: doc.data().nama_tempat,
            };
  
            response.push(selectedData);
          });
          return response;
        });
  
        return res.status(200).send({ status: "Berhasil", data: response });
      } 
	  catch (error) 
	  {        console.error('Content creation error:', error);
  res.status(500).json({ error: 'Content creation failed' });}
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
    return res.status(200).send({ status: "Berhasil", data: wishlist });
  } catch (error) {        console.error('Content creation error:', error);
  res.status(500).json({ error: 'Content creation failed' });}
});


module.exports = {getHomepage,getHomekota, getAbjad, getKategori, getKota, findWisata, getWishlist,}


























