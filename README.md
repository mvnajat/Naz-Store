# Naz-Store
website jual beli akun game

Naz-Store adalah proyek pembelajaran web development yang kini fokus khusus pada Point Blank, dengan desain orisinal sendiri. Proyek independen dan tidak berafiliasi dengan Zepetto.

## Fitur versi pertama

- Beranda dan katalog PB Cash, voucher, serta E-PIN contoh.
- Halaman top-up dengan pilihan nominal dan ringkasan harga yang diperbarui langsung.
- Form ID Zepetto contoh untuk top-up via ID, serta tiga opsi pembayaran **demo**.
- Pembuatan kode pesanan **demo** dan pelacakan lokal via `localStorage`.
- Galeri karakter Point Blank **fiktif** berdasarkan pangkat, statistik, dan koleksi ilustratif.
- Halaman detail karakter tanpa checkout ataupun pengumpulan kredensial akun.
- Tampilan responsif untuk desktop dan smartphone.

## Cara menjalankan

Buka `dist/index.html` di browser. Tidak diperlukan server, database, atau instalasi paket.

Untuk latihan, ubah daftar `games` di `dist/app.js` dan warna/tata letak di `dist/styles.css`.

## Catatan penting

Ini adalah **prototipe frontend**, bukan platform top-up yang siap menerima pembayaran. Semua karakter, statistik, dan harga adalah contoh. Tidak ada transaksi nyata, validasi akun game, penjualan/transfer akun, maupun pengiriman item digital. Data pesanan simulasi hanya disimpan pada browser lokal. Jangan memasukkan password atau kredensial akun.

Kebijakan resmi Point Blank/Zepetto menyatakan mereka tidak merekomendasikan memperjualbelikan ID/password dan karakter untuk uang nyata. Syarat layanan setiap produk wajib diperiksa sebelum membuka bisnis akun. Referensi: https://pointblank.id/eula/policy dan https://www.pointblank.id/voucherreseller.

Sebelum dipakai untuk bisnis, perlu integrasi backend, sistem keamanan, penyedia pembayaran resmi, pemasok produk digital berizin, serta mekanisme status dan penyelesaian pesanan.
