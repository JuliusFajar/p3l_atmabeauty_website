import React, { useState, useEffect } from "react";
import { GetProdukTerlaris } from "../api/apiLaporan"; // Sesuaikan dengan path API Anda
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../assets/images/logo.jpg";
import "./Laporan.css";

const LaporanProdukTerlaris = () => {
  const [bulan, setBulan] = useState("1"); // Default bulan Januari
  const [tahun, setTahun] = useState("2024"); // Default tahun
  const [produk, setProduk] = useState([]); // State untuk menyimpan data perawatan
  const [loading, setLoading] = useState(false); // State untuk status loading
  const [error, setError] = useState(""); // State untuk error

  const fetchProduk = async () => {
    try {
      setLoading(true);
      setError(""); // Reset error
      const value = { bulan, tahun };
      console.log(value);
      const data = await GetProdukTerlaris(value);
      console.log("dah sampe sini");
      setProduk(data); // Set data ke state
    } catch (err) {
      setError("Gagal memuat data produk terlaris.");
    } finally {
      setLoading(false);
    }
  };

  // Memanggil fetchPerawatan saat bulan atau tahun berubah
  useEffect(() => {
    fetchProduk();
  }, [bulan, tahun]);

  // Fungsi untuk mengonversi tabel ke PDF
  const handlePrintPDF = () => {
    const doc = new jsPDF();

    // Menambahkan logo
    const logoImg = new Image();
    logoImg.src = logo;
    doc.addImage(logoImg, "PNG", 10, 10, 40, 40);

    // Menambahkan header teks
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Natural Beauty Center", 60, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Jl. Babarsari No. 43 Yogyakarta 55281", 60, 30);
    doc.text("Telp. (0274) 487711", 60, 40);

    // Menambahkan judul laporan
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN 10 PRODUK PALING LARIS", 60, 70);

    // Menambahkan informasi bulan dan tahun
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Tahun: ${tahun}`, 14, 85);
    doc.text(
      `Bulan: ${new Date(0, bulan - 1).toLocaleString("id-ID", {
        month: "long",
      })}`,
      14,
      90
    );

    // Menambahkan tanggal cetak
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Dicetak tanggal: ${currentDate}`, 14, 80);

    // Menambahkan garis pemisah
    doc.line(10, 55, 200, 55);

    // Menambahkan tabel otomatis
    const columns = ["No", "Nama Produk", "Harga", "Stock", "Jumlah Pembelian"];
    const rows = produk.map((item, index) => [
      (index + 1).toString(),
      item.nama_produk,
      item.harga_produk
        ? new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(item.harga_produk)
        : "Tidak tersedia",
      item.stock_produk,
      item.jumlah_pembelian.toString(),
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 95, // Posisi Y otomatis berdasarkan konten sebelumnya
      theme: "striped", // Pilihan tema untuk tabel
    });

    // Menyimpan PDF
    doc.save("laporan_produk_terlaris.pdf");
  };

  return (
    <div className="laporan-container mt-5">
      <h1>Laporan 10 Produk Terlaris</h1>

      {/* Form untuk memilih bulan dan tahun */}
      <div className="filter-container">
        <label>
          Bulan:{" "}
          <select value={bulan} onChange={(e) => setBulan(e.target.value)}>
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tahun:{" "}
          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            min="2000"
            max={new Date().getFullYear()}
          />
        </label>
      </div>

      {/* Menampilkan pesan loading atau error */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <button
        className="btn btn-success tampilkan-btn"
        onClick={fetchProduk}
      >
        Tampilkan
      </button>
      {/* Tombol untuk mencetak laporan */}
      <button
        className="btn btn-danger print-btn-left mb-3 mx-2"
        onClick={handlePrintPDF}
      >
        Print Laporan PDF
      </button>

      {/* Tabel perawatan terlaris */}
      <table className="produk-table table table-stripped">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Produk</th>
            <th>Harga</th> {/* Tambahkan kolom Harga */}
            <th>Stock</th>
            <th>Jumlah Transaksi</th>
          </tr>
        </thead>
        <tbody>
          {produk.length > 0 ? (
            produk.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.nama_produk}</td>
                <td>
                  {item.harga_produk
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.harga_produk)
                    : "Tidak tersedia"}
                </td>
                <td>{item.stock_produk}</td>
                <td>{item.jumlah_pembelian}</td>

                {/* Tampilkan harga jika ada */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Tidak ada data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LaporanProdukTerlaris;
