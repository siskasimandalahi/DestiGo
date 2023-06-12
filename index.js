const Cloud = require('@google-cloud/storage')

const { Storage } = Cloud
	const storage = new Storage
	({
	projectID: 'destigo',
	keyFilename: ''
	});
	
module.exports = storage