const asyncHandler = require ("express-async-handler");
const Firestore = require('@google-cloud/firestore');

const db = new Firestore
({
	projectID: 'destigo-2bac7', keyFilename: './serviceAccount/destigo-2bac7-firebase-adminsdk-k8o5w-bf217375d8.json',
});

const register = asyncHandler (async(req,res) => {
  try {
    const { email, username, nama_lengkap, telepon, password } = req.body;
      const documentRef = db.collection('datalogin').doc();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Format Email Salah' });
        return;
      }

		const emailExists = await db
			.collection('datalogin')
			.where('email', '==', email)
			.get();

		const usernameExists = await db
			.collection('datalogin')
			.where('username', '==', username)
			.get();
		
		const nama_lengkapExists = await db
			.collection('datalogin')
			.where('nama_lengkap', '==', nama_lengkap)
			.get();

    const teleponExists = await db
      .collection('datalogin')
      .where('telepon', '==', telepon)
      .get();

      if (!emailExists.empty) {
        res.status(400).json({ message: 'Email telah terdaftar' });
        return;
      }

      if (!usernameExists.empty) {
        res.status(400).json({ message: 'Username telah terdaftar' });
        return;
      }
	  
	  if (!teleponExists.empty) {
        res.status(400).json({ message: 'Telefon telah terdaftar' });
        return;
      }

      if (telepon.length < 11) {
		 res.status(400).json({ message: 'nomor telepon minimal harus 11 angka' });
		 return;
	  }	
		  
      if (password.length < 8) {
        res.status(400).json({ message: 'password minimal harus 8 karakter' });
        return;
      }

      const documentData = {email, username, nama_lengkap, telepon, password};

      documentRef.set(documentData).then(() => {
        res.status(200).json({message: 'masuk'});
      })
    } 
	
	catch (error) {        console.error('Content creation error:', error);
  res.status(500).json({ error: 'Content creation failed' });}
});

const login = asyncHandler (async(req,res) => {
	try {
      const { email, password } = req.body;

      const emailExists = await db
        .collection('datalogin')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (emailExists.empty) {
        res.status(404).json({ message: 'Email not register'});
        return;
      }

      const penggunaDoc = emailExists.docs[0];
      const penggunaData = penggunaDoc.data();

      if (penggunaData.password !== password) {
        res.status(401).json({ message: 'Password salah' });
        return;
      }

      res.status(200).json
	 ({ 
		email: penggunaData.email, 
		your_id: penggunaDoc.id, 
		username: penggunaData.username,
		nama_lengkap: penggunaData.nama_lengkap,
		telepon: penggunaData.telepon,
		
		message: 'Login berhasil' 
	 });

    } 
	
	catch (error) {        console.error('Content creation error:', error);
  res.status(500).json({ error: 'Content creation failed' });}
});

const profile = asyncHandler(async(req, res) => {
	try {
      const id = req.body.id;
      const documentRef = db.collection('datalogin').doc(id);
      const documentSnaps = await documentRef.get();

      if (!documentSnaps.exists) {
        res.status(404).json({ message: 'User tidak ditemukan' });
        return;
      }

      const documentData = documentSnaps.data();

      res.status(200).json({
        Email: documentData.email,
        Username: documentData.username,
	    	nama_Lengkap: documentData.nama_lengkap,
		    Telepon: documentData.telepon,
      });
	  
    } 
	catch (error) {        console.error('Content creation error:', error);
  res.status(500).json({ error: 'Content creation failed' });}
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    // Ganti cara mengakses ID dari URL
    const id = req.params.id;

    // Tambahkan pemeriksaan untuk memastikan id tidak kosong
    if (!id || typeof id !== 'string') {
      res.status(400).json({ message: 'ID tidak valid' });
      return;
    }

    const documentRef = db.collection('datalogin').doc(id);

    const documentSnaps = await documentRef.get();

    if (!documentSnaps.exists) {
      res.status(404).json({ message: 'User tidak ditemukan' });
      return;
    }

    // Ganti cara mengakses data dari body request
    const updatedData = {
      email: req.body.Email || documentSnaps.data().email,
      username: req.body.Username || documentSnaps.data().username,
      nama_lengkap: req.body.nama_Lengkap || documentSnaps.data().nama_lengkap,
      telepon: req.body.Telepon || documentSnaps.data().telepon,
      password: req.body.password || documentSnaps.data().password,
    };

    await documentRef.update(updatedData);

    res.status(200).json({
      message: 'Profile berhasil diperbarui',
      Email: updatedData.email,
      Username: updatedData.username,
      nama_Lengkap: updatedData.nama_lengkap,
      Telepon: updatedData.telepon,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});


const logout = asyncHandler(async(req, res) => {
	 try {
      const {id} = req.params;
      const documentRef = db.collection('datalogin').doc(id);
      const documentSnaps = await documentRef.get();

      if (!documentSnaps.exists) {
        res.status(404).json({ message: 'User tidak ditemukan' });
        return;
      }

      const documentData = documentSnaps.data();

      res.status(200).json({ message: 'Berhasil Keluar' });

    } 
	catch (error) 
	{res.status(500).json({ message: 'Internal server error' });}
});

module.exports = {register, login, profile, updateProfile,logout}