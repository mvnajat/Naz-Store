# Naz-Store — Prototype Point Blank Hub

Naz-Store adalah proyek pembelajaran web development yang kini fokus khusus pada Point Blank, dengan desain orisinal sendiri. Proyek independen dan tidak berafiliasi dengan Zepetto.

## Fitur versi pertama

- Beranda dan katalog PB Cash, voucher, serta E-PIN contoh.
- Halaman top-up dengan pilihan nominal dan ringkasan harga yang diperbarui langsung.
- Form ID Zepetto contoh untuk top-up via ID, serta tiga opsi pembayaran **demo**.
- Pembuatan kode pesanan **demo** dan pelacakan lokal via `localStorage`.
- Galeri karakter Point Blank **fiktif** berdasarkan pangkat, statistik, dan koleksi ilustratif.
- Halaman detail karakter tanpa checkout ataupun pengumpulan kredensial akun.
- Tampilan responsif untuk desktop dan smartphone.
- Radar event Point Blank dengan jadwal **Season Pass Deadlock (3 November–22 Desember 2026)** dan **Premium Shop Sale (3–9 November 2026)**, lengkap dengan status berdasarkan waktu WIB.
- Artwork karakter dari materi Point Blank/Zepetto dan logo game sebagai identifikasi game; bukan logo atau endorsement resmi Naz-Store.

## Cara menjalankan

Buka `dist/index.html` di browser. Tidak diperlukan server, database, atau instalasi paket.

Untuk latihan, ubah daftar `games` dan jadwal `pbEvents` di `dist/app.js`, warna/tata letak di `dist/styles.css` dan `dist/pb-events.css`, serta deskripsi berita di `dist/index.html`.

## Sumber berita dan visual

Radar event diperbarui **manual pada 7 November 2026**, bukan feed berita otomatis. Jangan lupa mengubah tanggal dan isi jika ada Season Pass baru; label aktif/berakhir mengikuti waktu perangkat dengan batas waktu WIB yang disimpan di kode.

- Detail Deadlock (disampaikan media dari sumber Zepetto): https://www.ggwp.id/esports/shooter/pre-order-season-pass-deadlock-point-blank-dibuka-cuma-9-000-pb-cash-00-c57ll-1837n0
- Detail Premium Shop Sale: https://www.ggwp.id/esports/shooter/premium-shop-sale-point-blank-diskon-50-persen-00-c57ll-nm30fx
- Pengumuman resmi: https://pointblank.id/news/list
- Logo Point Blank: akun **Point Blank Zepetto Official** (Giphy).
- Artwork Tarantula: DuniaGames, dikreditkan ke Point Blank/Zepetto.
- Gambar Rica, Keen Eyes, Tarantula: arsip 2019 pada CDN situs resmi Point Blank.
- Gambar Deadlock: materi Point Blank/Zepetto dalam artikel GGWP.

Gambar dimuat dari domain sumbernya dan membutuhkan koneksi internet. Seluruh merek dan artwork tetap milik pemegang hak; sebelum mengoperasikan toko komersial, pastikan hak penggunaan asset/promosi dan izin reseller.

## Catatan penting

Ini adalah **prototipe frontend**, bukan platform top-up yang siap menerima pembayaran. Semua karakter, statistik, dan harga adalah contoh. Tidak ada transaksi nyata, validasi akun game, penjualan/transfer akun, maupun pengiriman item digital. Data pesanan simulasi hanya disimpan pada browser lokal. Jangan memasukkan password atau kredensial akun.

Kebijakan resmi Point Blank/Zepetto menyatakan mereka tidak merekomendasikan memperjualbelikan ID/password dan karakter untuk uang nyata. Syarat layanan setiap produk wajib diperiksa sebelum membuka bisnis akun. Referensi: https://pointblank.id/eula/policy dan https://www.pointblank.id/voucherreseller.

Sebelum dipakai untuk bisnis, perlu integrasi backend, sistem keamanan, penyedia pembayaran resmi, pemasok produk digital berizin, serta mekanisme status dan penyelesaian pesanan.
