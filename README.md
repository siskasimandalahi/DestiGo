# Bangkit Capstone Project

This is a repository for DestiGo Apps which is the Product Based Capstone Project for Bangkit Academy 2023 Batch 1. This apps is created by team C23-PR578 with 3 Machine Learning Student, 2 Cloud Computing Student, and 1 Mobile Development Student.

## About DestiGo

Destigo (Destination & Go) is an application that has features of various destination options according to user preferences where not only natural destinations but can be culinary destinations, arts and cultural destinations, and historical destinations. This will make it easier for tourists to choose tours according to their preferences

# Team Members

|            Member           |   Student ID  |        Path          |               University                   |                                     Contacts                                      |
| :-------------------------: | :-----------: | :------------------: | :----------------------------------------: | :-------------------------------------------------------------------------------: |
| Dyah Wahyu Permatasari      | M287DSY0062   |  Machine Learning    |        Universitas Negeri Surabaya         |   [LinkedIn](https://www.linkedin.com/in/dyah-wahyu-permatasari-742470201/)       |
| Roro Ayu Fasha Dewatri      | M287DSY2928   |  Machine Learning    |        Universitas Negeri Surabaya         |   [LinkedIn](https://www.linkedin.com/in/roro-ayu-fasha/)                         |
| Siskawati Simandalahi       | M181DSY2366   |  Machine Learning    |        Universitas Indonesia               |   [LinkedIn](https://www.linkedin.com/in/siskawatisimandalahi/)                   |
| Dzaky Hanif Arjuna          | C038DSX1603   |  Cloud Computing     |        Institut Teknologi Sepuluh November |   [LinkedIn](https://www.linkedin.com/in/junajunajeki/)                           |
| Dimas Triananda Murti Putra | C038DSX4911   |  Cloud Computing     |        Institut Teknologi Sepuluh November |   [LinkedIn](https://www.linkedin.com/in/dimas-triananda-murti-putra-971715190/)  |
| Sesilia Tiara Rahayu Ada    | A305DSY2752   |  Mobile Development  |        UPN Veteran Jawa Timur              |   [LinkedIn](https://www.linkedin.com/in/sesilia-tiara-rahayu-ada-b88678220/)     |

# Cloud Computing
## Endpoints
### Register (POST)
```
Request: /create
```
body:
``` json
{
"email" : "example@email.com",
"username" : "username",
"nama_lengkap" : "nama lengkapmu",
"telepon" : "081234567898",
"password" : "password"
}
```
Response:
``` json
{
"message": "masuk"
}
```
### Login (POST)
```
Request: /login
```
Body:
``` json
{
"email" : "example@email.com",
"password" : "password"
}
```
Response:
``` json
{
"email": "example@email.com",
"your_id": "qpxMbvV2AkwYSsQN1b9",
"username": "username",
"nama_lengkap": "Nama Lengkapmu",
"telepon": "081234567898",
"message": "Login berhasil"
}
```
### Account (POST)
```
request: /account
```
body:
``` json
{
"id": " qpxMbvV2AkwYSsQN1b9"
}
```
Response:
``` json
{
"Email": "example@email.com",
"Username": "username",
"nama_Lengkap": "Nama Lengkapmu",
"Telepon": "081234567898"
}
```
### Logout (GET)
```
request: /logout/:id
```
Response:
``` json
{
"message": "Berhasil Keluar"
}
```
### Homepage (GET)
```
request: /homepage
```
Response:
``` json
{
"kota": "Jakarta Barat",
"kategori": "Budaya",
"id": 217,
"deskripsi": "Museum Bank Indonesia adalah sebuah museum di Jakarta, Indonesia yang terletak di Jl. Pintu Besar Utara No.3, Jakarta Barat (depan stasiun Beos Kota), dengan menempati area bekas gedung Bank Indonesia Kota yang merupakan cagar budaya peninggalan De Javasche Bank yang beraliran neo-klasikal, dipadu dengan pengaruh lokal, dan dibangun pertama kali pada tahun 1828.\\nPada tahun 1625, di tempat ini pernah dibangun sebuah gereja sederhana untuk umat Protestan. Pada tahun 1628, gereja ini dibongkar karena digunakan untuk tempat meriam besar ketika puluhan ribu tentara Sultan Agung menyerang Batavia untuk pertama kali.Museum ini menyajikan informasi peran Bank Indonesia dalam perjalanan sejarah bangsa yang dimulai sejak sebelum kedatangan bangsa barat di Nusantara hingga terbentuknya Bank Indonesia pada tahun 1953 dan kebijakan-kebijakan Bank Indonesia, meliputi pula latar belakang dan dampak kebijakan Bank Indonesia bagi masyarakat sampai dengan tahun 2005. Penyajiannya dikemas sedemikian rupa dengan memanfaatkan teknologi modern dan multi media, seperti display elektronik, panel statik, televisi plasma, dan diorama sehingga menciptakan kenyamanan pengunjung dalam menikmati Museum Bank Indonesia. Selain itu terdapat pula fakta dan koleksi benda bersejarah pada masa sebelum terbentuknya Bank Indonesia, seperti pada masa kerajaan-kerajaan Nusantara, antara lain berupa koleksi uang numismatik yang ditampilkan juga secara menarik.\\nPeresmian Museum Bank Indonesia dilakukan melalui dua tahap, yaitu peresmian tahap I dan mulai dibuka untuk masyarakat (soft opening) pada tanggal 15 Desember 2006 oleh Gubernur Bank Indonesia saat itu, Burhanuddin Abdullah, dan peresmian tahap II (grand opening) oleh Presiden RI Susilo Bambang Yudhoyono, pada tanggal 21 Juli 2009.\\nMuseum Bank Indonesia buka setiap hari kecuali Senin dan hari libur nasional.", 
"nama_tempat": "Museum Bank Indonesia",
"lat": -6.137127,
 "long": 106.813005,
 "alamat": "Jl. Pintu Besar Utara No.3, RT.3/RW.6, Pinangsia, Kec. Taman Sari, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11110"
}
```
### Abjad (GET)
```
request:/Abjad
```
Response: 
``` json
{
"kota": "Jakarta Barat",
"kategori": "Kuliner",
"id": 249,
 "deskripsi": "Bagi Wisatawan yang mencari makanan spesialis steak dapat mencoba Abuba Steak. Abuba Steak didirikan oleh abu bakar dari warung pinggiran/warung tenda didaerah kemang dan terus berkembang menjadi jaringan restoran kelas atas. hebatnya lagi, bapak abu bakar tidak memiliki  modal yang besar dan pendidikan formal hanya sampai kelas 5 SD. Abuba Steak benar-benar restoran brand lokal, yang menantang brand-brand asing. Nama Abuba singkatan dari nama pemiliknya Abu Bakar. Selain itu, kita dapat merasakan makan steak ala restoran-restoran asing dengan harga yang jauh lebih murah tapi kualitas tidaklah kalah.",
 "nama_tempat": "Abuba Steak",
"lat": -6.173821,
 "long": 106.782243,
 "alamat": "Jl. Tj. Duren Barat 1 No.17, RT.1/RW.4, Tj. Duren Utara, Kec. Grogol petamburan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11470"
},
{
"kota": "Surabaya",
"kategori": "Taman Hiburan",
"id": 490,
 "deskripsi": "Jembatan Kenjeran dengan air mancur menarinya sejatinya bukan hanya sebuah jembatan penghubung jalan saja, namun juga dimanfaatkan sebagai destinasi wisata oleh pemerintah kota Surabaya. Posisi air mancur menari sendiri berada di ujung jembatan Kenjeran dekat dengan anjungan penyeberangan atau di Taman Hiburan Pantai (THP). Lokasi ini sangat ramah kaum difabel karena tersedia lift yang dapat mereka gunakan untuk mempermudah perjalanan mereka. Sembari menunggu pertunjukan air mancur menari yang spektakuler di jembatan Kenjeran ini, Anda dapat menikmati pemandangan indah matahari terbenam (sunset) di jembatan ini. Jangan lewatkan untuk berfoto dengan laut lepas yang memesona sebagai latar belakangnya. Anda juga dapat menikmati berbagai kuliner lezat khas Jawa Timur di lokasi ini karena banyak pedagang kaki lima yang berjualan di sini. Berbagai mainan anak-anak pun dijual di lokasi ini. Jadi tidak perlu kuatir bahwa anak-anak akan merasa bosan menunggu pertunjukan air mancur menari yang mereka tunggu-tunggu. Silakan atur jadwal kunjungan Anda untuk menyaksikan taman air mancur menari Kenjeran ini dan buktikan sendiri keindahannya. Pastikan bahwa mobilitas Anda terjamin dengan sewa mobil Surabaya karena di lokasi ini masih minim transportasi online pada malam hari.",
"nama_tempat": "Air Mancur Menari",
"lat": -7.235693,
"long": 112.795523,
"alamat": "Kenjeran, Kec. Bulak, Surabaya, Jawa Timur 60123"
},
```
### Kategori (GET)
```
request: /Kategori/:Kategori
```
Response:
``` json
{
"nama_tempat": "Taman Lapangan Banteng"
},
{
"nama_tempat": "Taman Hiburan Rakyat"
},
```
### Kota (GET)
```
request: /Kota/:kota
```
Response:
``` json
{
"nama_tempat": "Sunrise Point Cukul",
"url1": "https://asset.kompas.com/crops/nG2HXjKEC1s4eEeJNAM3m2W9X0E=/0x23:700x373/750x500/data/photo/2020/09/07/5f5581f1e138a.jpg"
},
{
"nama_tempat": "Atmosphere Resort Cafe",
"url1": "https://media-cdn.tripadvisor.com/media/photo-s/02/ce/15/c8/beautiful.jpg"
},
```
### Search (GET)
```
request: /search/:nama_tempa
```
Response:
``` json
{
"nama_tempat": "Sunrise Point Cukul",
"kota": "Bandung"
}
```
### Wishlist (GET)
```
request: /wishlist/:username
```
Response: 
{
"nama_tempat": "Sunrise Point Cukul",
"url1": "https://asset.kompas.com/crops/nG2HXjKEC1s4eEeJNAM3m2W9X0E=/0x23:700x373/750x500/data/photo/2020/09/07/5f5581f1e138a.jpg"
}
```
### Add wishlist wisata (POST)
```
request: /add
```
body:
``` json 
{
"username" : "username",
"nama_tempat" : " Sunrise Point Cukul "
}
```
Response:
``` json
{
"status": "Sukses",
"nama_tempat": "Trans Studio Bandung",
"username": "username",
"url1": "https://www.pinhome.id/info-area/wp-content/uploads/2021/06/trans-studio-bandung-untuk-liburan-akhir-pekan-seru.jpg"
}
```
### Information (GET)
```
request: informasi/:nama_tempat
```
Response:
``` json
{
"status": "Berhasil",
“data": [
{
"nama_tempat": "Sunrise Point Cukul",
"kota": "Bandung",
"deskripsi": "Sunrise Point Cukul adalah sebuah lokasi yang terletak di daerah Cukul, Kabupaten Bandung. Tempat ini terkenal karena pemandangan matahari terbit yang memukau yang dapat dinikmati dari titik tertentu di lokasi tersebut. Saat matahari mulai muncul di cakrawala, pengunjung dapat menyaksikan keindahan alam yang menakjubkan dengan langit yang terang dan pemandangan pegunungan yang mempesona. Keindahan alam yang dipadukan dengan warna-warni langit saat matahari terbit menciptakan momen yang sangat indah dan fotogenik. Sunrise Point Cukul juga menawarkan area yang nyaman untuk duduk atau berdiri sambil menikmati pemandangan alam yang spektakuler. ",
"kategori": "Alam",
"alamat": "Jl. Cukul, Sukaluyu, Kec. Pangalengan, Kabupaten Bandung",
"lat": -7.233689,
 "long": 107.5342933,
 "url1": "https://asset.kompas.com/crops/nG2HXjKEC1s4eEeJNAM3m2W9X0E=/0x23:700x373/750x500/data/photo/2020/09/07/5f5581f1e138a.jpg",
"url2": "https://djavatoday.com/wp-content/uploads/2022/08/IMG-20220802-WA0054_compress87-768x500.jpg",
"url3": "https://assets.ayobandung.com/crop/0x0:0x0/750x500/webp/photo/2021/12/26/3217957826.jpg",
"url4": "",
"url5": ""
        }
    ]
}
```

### Delete wishlist wisata (DELETE)
```
request: /delete
```
body: 
``` json
{
"username" : "username",
"nama_tempat" : "Sunrise Point Cukul"
}
```
Response:
``` json
{
"status": "Berhasil",
"msg": "Tempat wisata berhasil dihapus dari wishlist"
}
```
### test h5 api
```
http://34.143.242.67/recommendation/Trans Studio Bandung
```
Responses : 
``` json
[
"Taman Begonia",
"Bandung",
"Taman Hiburan",
"Jl. Maribaya No.120 A, Langensari, Kec. Lembang, Kabupaten Bandung Barat",-6.8260163, 107.6383564,
 "Taman Begonia adalah sebuah taman bunga yang terletak di Lembang, Bandung. Taman ini terkenal karena keindahan dan keragaman koleksi begonia yang tumbuh di sana. Begonia adalah jenis bunga yang memiliki berbagai warna dan bentuk yang menawan. Pengunjung dapat menjelajahi taman ini dan menikmati keindahan ribuan begonia yang bermekaran dengan warna-warna yang cerah dan segar. Taman Begonia juga menawarkan berbagai spot foto yang indah, di mana pengunjung dapat mengambil foto yang cantik di antara taman bunga yang indah. Selain itu, terdapat pula berbagai fasilitas seperti area bermain anak, restoran, dan kafe yang menyediakan tempat bersantai sambil menikmati keindahan taman"
],
```
----
## Using Local Host : 
```
http://localhost:8080
```
####using deployed url:
```
https://backend-dot-destigo-2bac7.et.r.appspot.com
```
