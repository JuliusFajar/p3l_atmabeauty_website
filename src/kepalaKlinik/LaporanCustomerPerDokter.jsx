import React, { useState, useEffect } from "react";
import { GetLaporanCustomerPerDokter } from "../api/apiLaporan"; // Adjust this import based on your actual API file
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../assets/images/logo.jpg";
import "./Laporan.css";

const LaporanCustomerPerDokter = () => {
  const [bulan, setBulan] = useState("1"); // Default month January
  const [tahun, setTahun] = useState("2024"); // Default year
  const [laporan, setLaporan] = useState({}); // Store data grouped by doctor
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Function to fetch data
  const fetchLaporan = async () => {
    try {
      setLoading(true);
      setError(""); // Reset error
      const data = await GetLaporanCustomerPerDokter(bulan, tahun); // Fetch the data
      console.log("tes masuk");
      console.log(data);

      // Pastikan ada laporan di dalam data yang diterima
      if (data) {
        setLaporan(data); // Set the laporan data
      } else {
        setError("Data laporan tidak ditemukan.");
      }
    } catch (err) {
      setError("Failed to load report data.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetch when month or year changes
  useEffect(() => {
    fetchLaporan();
  }, [bulan, tahun]);

  // Function to handle PDF export
  const handlePrintPDF = () => {
    const doc = new jsPDF();

    // Tambahkan bagian awal (header dan logo)
    const logoImg = new Image();
    logoImg.src = logo;
    doc.addImage(logoImg, "PNG", 10, 10, 40, 40);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Natural Beauty Center", 60, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Jl. Babarsari No. 43 Yogyakarta 55281", 60, 30);
    doc.text("Telp. (0274) 487711", 60, 40);

    // Tambahkan judul laporan
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Laporan Jumlah Customer", 60, 70);

    // Tambahkan info bulan dan tahun
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

    const currentDate = new Date().toLocaleDateString();
    doc.text(`Dicetak tanggal: ${currentDate}`, 14, 80);

    // Tambahkan tabel
    const columns = [
      "No",
      "Nama Dokter",
      "Nama Perawatan",
      "Jumlah Customer",
      "Subtotal",
    ];
    const rows = [];
    let counter = 1;
    let grandTotal = 0;

    Object.keys(laporan).forEach((dokter) => {
      let subtotal = 0;

      laporan[dokter].forEach((item) => {
        subtotal += item.jumlah_customer;
        rows.push([
          counter.toString(),
          dokter,
          item.nama_perawatan,
          item.jumlah_customer.toString(),
          "", // Subtotal ditambahkan hanya di akhir dokter
        ]);
        counter++;
      });

      // Tambahkan subtotal untuk dokter
      rows.push(["", "", "", "Subtotal", subtotal.toString()]);
      grandTotal += subtotal;
    });

    // Tambahkan total akhir
    rows.push(["", "", "", "Total", grandTotal.toString()]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 100,
      theme: "striped",
    });

    doc.save("laporan_customer_per_dokter.pdf");
  };

  return (
    <div className="laporan-container mt-5">
      <h1>Laporan Customer Per Dokter</h1>

      {/* Month and year filter */}
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

      {/* Display loading or error message */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <button className="btn btn-success tampilkan-btn" onClick={fetchLaporan}>
        Tampilkan
      </button>

      {/* PDF print button */}
      <button
        className="btn btn-danger print-btn-left mb-3 mx-2"
        onClick={handlePrintPDF}
      >
        Print Laporan PDF
      </button>

      {/* Customer report table */}
      <table className="perawatan-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Dokter</th>
            <th>Nama Perawatan</th>
            <th>Jumlah Customer</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(laporan).length > 0 ? (
            Object.keys(laporan).map((dokter, index) => {
              let subtotal = 0;
              laporan[dokter].forEach((item) => {
                subtotal += item.jumlah_customer;
              });

              return (
                <React.Fragment key={dokter}>
                  {laporan[dokter].map((item, idx) => (
                    <tr key={idx}>
                      <td>{index + 1}</td>
                      <td>{idx === 0 ? dokter : ""}</td>{" "}
                      {/* Tampilkan nama dokter hanya di baris pertama */}
                      <td>{item.nama_perawatan}</td>
                      <td>{item.jumlah_customer}</td>
                      <td>{idx === 0 ? subtotal : ""}</td>{" "}
                      {/* Tampilkan subtotal di baris pertama */}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Tidak ada data</td>
            </tr>
          )}
          <tr>
            <td colSpan="3" className="text-right">
              <strong>Total</strong>
            </td>
            <td colSpan="2">
              {Object.keys(laporan).reduce((total, dokter) => {
                return (
                  total +
                  laporan[dokter].reduce(
                    (subTotal, item) => subTotal + item.jumlah_customer,
                    0
                  )
                );
              }, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LaporanCustomerPerDokter;
