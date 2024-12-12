import React, { useState, useEffect } from "react";
import { GetLaporanCustomer } from "../api/apiLaporan"; // Import API function
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
import logo from "../assets/images/logo.jpg";


const LaporanCustomer = () => {
  const [laporan, setLaporan] = useState([]);
  const [tahun, setTahun] = useState(new Date().getFullYear()); // Tahun default adalah tahun saat ini
  const [totalTahunan, setTotalTahunan] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLaporan();
  }, [tahun]); // Panggil API setiap kali tahun berubah

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await GetLaporanCustomer(tahun); // Panggil API
      setLaporan(response.data); // Data laporan per bulan
      setTotalTahunan(response.total_tahunan); // Total customer tahunan
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

  const handlePrint = () => {
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
    doc.text("LAPORAN CUSTOMER BARU", 60, 70);

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
    const columns = ["No", "Bulan", "Pria", "Wanita", "Jumlah"];
    const rows = laporan.map((item, index) => [
      (index + 1).toString(),
      item.bulan,
      item.pria,
      item.wanita,
      item.jumlah,
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
          "", // Kolom Pria kosong
          "TOTAL", // Kolom judul Total di baris bawah
          totalTahunan.toString(), // Nilai total tahunan
        ],
      ],
      footStyles: {
        fontStyle: "bold", // Teks tebal untuk footer
      }
    });

    // Menyimpan file PDF
    doc.save("laporan_customer_baru.pdf");
  };

  return (
    <Container className="laporan-container mt-5">
      {/* Header */}
      <Row className="text-center">
        <Col>
          <h3>LAPORAN CUSTOMER BARU</h3>
        </Col>
      </Row>

      {/* Pilihan Tahun (Dropdown) dan Tombol Print */}
      <Row className="mb-4 align-items-center">
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
        <Col className="text-end">
          <Button variant="primary" onClick={handlePrint}>
            Print Laporan PDF
          </Button>
        </Col>
      </Row>

      {/* Tabel Laporan */}
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
                  <th>Pria</th>
                  <th>Wanita</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {laporan.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.bulan}</td>
                    <td>{item.pria}</td>
                    <td>{item.wanita}</td>
                    <td>{item.jumlah}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end fw-bold">
                    TOTAL
                  </td>
                  <td className="fw-bold">{totalTahunan}</td>
                </tr>
              </tfoot>
            </Table>
          </Col>
        </Row>
      )}

      {/* Footer */}
      <Row>
        <Col className="text-end mt-4">
          <p>Data terbaru hingga tanggal {new Date().toLocaleDateString()}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default LaporanCustomer;
