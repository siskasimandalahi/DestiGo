const asyncHandler = require ("express-async-handler");
const Firestore = require('@google-cloud/firestore');

const db = new Firestore
({
	projectID: 'destigo-2bac7', keyFilename: './serviceAccount/destigo-2bac7-3db7b9f0e1ca.json',
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
		{
        console.log(error);
        res.status(500).send({ status: "Gagal", msg: error });
		}
    });
	
const getKategori = asyncHandler (async(req,res) => {
     try {
        const kategori = req.params.kategori;
        let query = db.collection("datawisata").where("kategori", "==", kategori);
        let response = [];
  
        await query.get().then((data) => {
          let docs = data.docs; // query results
  
          docs.map((doc) => {
            const selectedData = {
                nama_tempat: doc.data().nama_tempat,
                kategori : doc.data.kategori,
                alamat : doc.data.alamat,
                kota : doc.data.kota,
                deskripsi : doc.data.deskripsi,
                lat : doc.data.lat,
                long : doc.data.long,
            };
  
            response.push(selectedData);
          });
          return response;
        });
  
        return res.status(200).send({ status: "Berhasil", data: response });
      } catch (error) 
	  {
        console.log(error);
        res.status(500).send({ status: "Gagal", msg: error });
      }
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
	  {
        console.log(error);
        res.status(500).send({ status: "Gagal", msg: error });
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
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Gagal", msg: error });
  }
});

constWishlist = asyncHandler(async (req, res) => {
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
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Gagal", msg: error });
  }
});





























