import React, { useState, useEffect } from "react";
import { GetLaporanPendapatan } from "../api/apiLaporan";
import {
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Alert,
  Table,
  Button,
} from "react-bootstrap";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../assets/images/logo.jpg"; // Pastikan logo ada di path yang benar
import "./Laporan.css";
import {
  Chart,
  CategoryScale,
  BarElement,
  BarController,
  LinearScale, 
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Mendaftarkan elemen-elemen yang diperlukan untuk Chart.js
Chart.register(
  CategoryScale,
  BarElement,
  BarController,
  LinearScale, 
  Title,
  Tooltip,
  Legend
);

const LaporanPendapatan = () => {
  const [laporan, setLaporan] = useState([]);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLaporan();
  }, [tahun]);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await GetLaporanPendapatan(tahun);
      setLaporan(response.data);
      setTotalPendapatan(response.total_tahunan);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear - 10; i <= currentYear; i++) {
      yearOptions.push(i);
    }
    return yearOptions;
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();

    // Menambahkan logo
    const logoImg = new Image();
    logoImg.src = logo;
    doc.addImage(logoImg, "PNG", 10, 10, 40, 40); // Mengatur posisi logo

    // Menambahkan header teks
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Natural Beauty Center", 60, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Jl. Babarsari No. 43 Yogyakarta 55281", 60, 30);
    doc.text("Telp. (0274) 487711", 60, 40);

    // Menambahkan judul laporan
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN PENDAPATAN", 60, 70);

    // Menambahkan informasi tahun
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Tahun: ${tahun}`, 14, 85);

    // Menambahkan tanggal cetak
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Dicetak tanggal: ${currentDate}`, 14, 90);

    // Menambahkan garis pemisah
    doc.line(10, 55, 200, 55);

    // Menambahkan tabel otomatis
    const columns = ["No", "Bulan", "Perawatan", "Produk", "Total"];
    const rows = laporan.map((item, index) => [
      (index + 1).toString(),
      item.bulan,
      formatRupiah(item.perawatan),
      formatRupiah(item.produk),
      formatRupiah(item.total),
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 95, // Posisi Y untuk tabel
      theme: "striped", // Tema untuk tabel
      styles: {
        fontSize: 10, // Ukuran font untuk tabel
      },
      foot: [
        [
          "", // Kolom No kosong
          "", // Kolom Bulan kosong
          "", // Kolom Perawatan kosong
          "TOTAL", // Kolom judul Total di baris bawah
          formatRupiah(totalPendapatan), // Nilai total pendapatan
        ],
      ],
      footStyles: {
        fontStyle: "bold", // Teks tebal untuk footer
      },
    });

    // Menambahkan halaman baru untuk grafik
    doc.addPage();

    // Membuat grafik batang menggunakan Chart.js
    const canvas = document.createElement("canvas");
    canvas.width = 800; // Lebar canvas
    canvas.height = 400; // Tinggi canvas
    const ctx = canvas.getContext("2d");

    // Render grafik Chart.js
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: laporan.map((item) => item.bulan), // Bulan sebagai label
        datasets: [
          {
            label: "Perawatan",
            backgroundColor: "blue",
            data: laporan.map((item) => item.perawatan),
          },
          {
            label: "Produk",
            backgroundColor: "red",
            data: laporan.map((item) => item.produk),
          },
          {
            label: "Total",
            backgroundColor: "green",
            data: laporan.map((item) => item.total),
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });

    // Tunggu sejenak hingga grafik selesai merender sebelum menambahkan ke PDF
    setTimeout(() => {
      const imageData = canvas.toDataURL("image/png");
      doc.addImage(imageData, "PNG", 10, 20, 180, 90); // Posisi dan ukuran grafik

      // Menyimpan file PDF
      doc.save("laporan_pendapatan.pdf");
    }, 1000); // Tunggu 1 detik sebelum menambahkan gambar
  };

  return (
    <Container className="laporan-container mt-5">
      <Row className="text-center">
        <Col>
          <h3>LAPORAN PENDAPATAN</h3>
        </Col>
      </Row>

      {/* Pilihan Tahun (Dropdown) dan Tombol Print PDF */}
      <Row className="mb-4 align-items-center justify-content-between">
        <Col md="auto">
          <Form.Group as={Row} controlId="tahun">
            <Form.Label column md="auto" className="me-2">
              Pilih Tahun
            </Form.Label>
            <Col>
              <Form.Control
                as="select"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="laporan-dropdown"
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>
        </Col>
        <Col md="auto">
          <Button className="btn btn-primary" onClick={handlePrintPDF}>
            Print Laporan PDF
          </Button>
        </Col>
      </Row>

      {/* Tabel Laporan Pendapatan */}
      {loading ? (
        <Row className="text-center">
          <Col>
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      ) : error ? (
        <Row className="text-center">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Table striped bordered hover responsive className="laporan-table">
              <thead className="table">
                <tr>
                  <th>No</th>
                  <th>Bulan</th>
                  <th>Perawatan</th>
                  <th>Produk</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {laporan.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.bulan}</td>
                    <td>{formatRupiah(item.perawatan)}</td>
                    <td>{formatRupiah(item.produk)}</td>
                    <td>{formatRupiah(item.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end fw-bold">
                    TOTAL
                  </td>
                  <td className="fw-bold">{formatRupiah(totalPendapatan)}</td>
                </tr>
              </tfoot>
            </Table>
          </Col>
        </Row>
      )}

      <Row>
        <Col className="text-end mt-4">
          <p>Data terbaru hingga tanggal {new Date().toLocaleDateString()}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default LaporanPendapatan;
