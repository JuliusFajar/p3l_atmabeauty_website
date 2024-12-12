import React, { useState } from "react";
import { Form, Container, Button, Modal, Alert } from "react-bootstrap";
import { GetAllPegawai, GetPegawaiByJabatan } from "../api/apiPegawai";
import { GetCustomerByName } from "../api/apiDaftarCustomer";
import { GetAllRuangan } from "../api/apiRuangan"; // Import API for fetching rooms
import { CreateTransaksi } from "../api/apiTransaksi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PelayananCustomer = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showCustomerSearchModal, setShowCustomerSearchModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pegawais, setPegawais] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCariLagiButton, setShowCariLagiButton] = useState(false);
  const [customerNotFound, setCustomerNotFound] = useState(false);
  const [keluhan, setKeluhan] = useState("");
  const navigate = useNavigate();

  // Function to handle button click
  const handleButtonClick = (option) => {
    setSelectedOption(option);
    setShowInitialModal(true);
  };

  // Function to fetch customer data
  const searchCustomer = async () => {
    try {
      const results = await GetCustomerByName(customerName);
      if (results.length === 0) {
        setCustomerNotFound(true);
        setCustomers([]);
      } else {
        setCustomerNotFound(false);
        setCustomers(results);
      }
      setShowCariLagiButton(true); // Show the "Cari Lagi" button after search
    } catch (error) {
      toast.error("Gagal memuat data customer");
    }
  };

  // Function to fetch available doctors or beauticians
  const fetchAvailablePegawai = async () => {
    try {
      let results;
      if (
        selectedOption === "Perawatan Dengan Konsultasi" ||
        selectedOption === "Pembelian Produk dengan Konsultasi"
      ) {
        results = await GetPegawaiByJabatan("Dokter");
      } else {
        results = await GetPegawaiByJabatan("Beautician");
      }
      const availablePegawai = results.filter(
        (pegawai) => pegawai.status_pegawai?.toLowerCase() === "available"
      );
      setPegawais(availablePegawai);
    } catch (error) {
      toast.error("Gagal memuat data pegawai");
    }
  };

  // Function to fetch rooms
  const fetchRooms = async () => {
    try {
      const results = await GetAllRuangan();
      setRooms(results);
    } catch (error) {
      toast.error("Gagal memuat data ruangan");
    }
  };

  // Function to handle "Sudah Mendaftar" click
  const handleSudahMendaftarClick = () => {
    setShowInitialModal(false);
    setShowCustomerSearchModal(true);

    if (selectedOption === "Perawatan Tanpa Konsultasi") {
      fetchRooms(); // Fetch rooms when choosing "Perawatan Tanpa Konsultasi"
    }
  };

  // Function to handle "Belum Mendaftar" click
  const handleBelumMendaftarClick = () => {
    navigate("/customerService");
  };

  // Function to print customer card
  const handlePrintCustomerCard = () => {
    if (selectedCustomer) {
      const registrationDate = new Date(selectedCustomer.tanggal_registrasi);
      const monthYear = `${("0" + (registrationDate.getMonth() + 1)).slice(
        -2
      )}/${registrationDate.getFullYear().toString().slice(-2)}`;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Customer Card</title>
            <style>
              .card {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                border: 1px solid #ddd;
                width: 300px;
                height: 250px;
                font-family: Arial, sans-serif;
                padding: 10px;
                position: relative;
              }
              .header {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .address {
                font-size: 12px;
                text-align: center;
                margin-bottom: 10px;
              }
              .number {
                font-size: 20px;
                font-weight: bold;
                margin-top: 10px;
                text-align: center;
              }
              .small-text {
                font-size: 12px;
                margin-top: 5px;
                text-align: left;
              }
              .card-footer {
                font-size: 10px;
                text-align: right;
                position: absolute;
                bottom: 10px;
                right: 10px;
              }
              .date {
                font-size: 12px;
                margin-top: 5px;
                text-align: left;
              }
              .name {
                font-size: 16px;
                margin-top: 10px;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">Natural Beauty Center</div>
              <div class="address">Jl. Babarsari No. 43 Yogyakarta 55281 <br> Telp. (0274) 487711</div>
              <div class="number">${selectedCustomer.nomor_customer}</div>
              <div class="small-text">Card Holder Since:</div>
              <div class="date">${monthYear}</div>
              <div class="name">${selectedCustomer.nama_customer}</div>
              <div class="card-footer">Your NBC Card has no expiration date</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Function to handle confirmation
  // const handleConfirmation = () => {
  //   setShowCustomerSearchModal(false);
  //   resetSearch();
  // };

  // Function to reset search fields
  const resetSearch = () => {
    setCustomerName("");
    setCustomers([]);
    setSelectedCustomer(null);
    setPegawais([]);
    setSelectedPegawai(null);
    setRooms([]);
    setSelectedRoom(null);
    setShowCariLagiButton(false);
    setCustomerNotFound(false);
  };

  const handleConfirmation = async () => {
    console.log("Selected room at confirmation:", selectedRoom);
    try {
      const transactionData = {
        id_customer: selectedCustomer.id_customer,
        id_pegawai: selectedPegawai.id_pegawai,
        id_dokter: selectedOption.toLowerCase().includes("dengan")
          ? selectedPegawai.id_pegawai
          : null,
        id_beautician: selectedOption.toLowerCase().includes("dengan")
          ? null
          : selectedPegawai.id_pegawai,
        id_ruangan:
          selectedOption.toLowerCase().includes("dengan")
            ? null
            : selectedRoom.id_ruangan,
        jenis_transaksi: selectedOption,
        keluhan: keluhan, // Replace with actual data if needed
      };

      // Call CreateTransaksi API
      console.log(transactionData);
      console.log(transactionData.keluhan);
      console.log(transactionData.jenis_transaksi);
      const response = await CreateTransaksi(transactionData);

      if (response.status) {
        alert(response.message || "Transaksi berhasil dibuat");
      } else {
        alert(response.message || "Gagal membuat transaksi");
      }
      setShowCustomerSearchModal(false);
      resetSearch();
    } catch (error) {
      alert("Error saat membuat transaksi");
    }
  };

  return (
    <Container
      className="container"
      style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}
    >
      <h2 className="mb-4 text-center">Pilih Jenis Layanan</h2>

      {/* Buttons for service options */}
      <div className="d-flex justify-content-around mb-4">
        <Button
          onClick={() => handleButtonClick("Perawatan Dengan Konsultasi")}
        >
          Perawatan Dengan Konsultasi
        </Button>
        <Button onClick={() => handleButtonClick("Perawatan Tanpa Konsultasi")}>
          Perawatan Tanpa Konsultasi
        </Button>
        <Button
          onClick={() =>
            handleButtonClick("Pembelian Produk dengan Konsultasi")
          }
        >
          Pembelian Produk dengan Konsultasi
        </Button>
      </div>

      {/* Initial Modal for "Sudah Mendaftar" or "Belum Mendaftar" */}
      <Modal
        show={showInitialModal}
        onHide={() => setShowInitialModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedOption}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Button
            variant="primary"
            onClick={handleSudahMendaftarClick}
            className="mb-2 w-100"
          >
            Sudah Mendaftar
          </Button>
          <Button
            variant="secondary"
            onClick={handleBelumMendaftarClick}
            className="w-100"
          >
            Belum Mendaftar
          </Button>
        </Modal.Body>
      </Modal>

      {/* Customer Search Modal */}
      <Modal
        show={showCustomerSearchModal}
        onHide={() => setShowCustomerSearchModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cari Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Cari customer berdasarkan nama..."
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mb-3"
          />
          <Button className="w-100 mb-3" onClick={searchCustomer}>
            Cari
          </Button>

          {customerNotFound && (
            <Alert variant="danger" className="mb-3">
              Customer tidak ditemukan
            </Alert>
          )}
          <div>
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <span>{customer.nama_customer}</span>
                <Button
                  className="btn-sm"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  Pilih
                </Button>
              </div>
            ))}
          </div>

          {selectedCustomer && (
            <Button className="w-100 mt-3" onClick={handlePrintCustomerCard}>
              Cetak Kartu Customer
            </Button>
          )}

          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Masukkan keluhan customer..."
            value={keluhan}
            onChange={(e) => setKeluhan(e.target.value)}
            className="mb-3"
          />

          {/* Room Selection for "Perawatan Tanpa Konsultasi" */}
          {selectedOption === "Perawatan Tanpa Konsultasi" && (
            <>
              <h5 className="mt-4">
                {selectedRoom
                  ? `Nomor Ruangan: ${selectedRoom.no_ruangan}`
                  : "Pilih No Ruangan"}
              </h5>
              <Form.Control
                as="select"
                className="mt-2"
                value={selectedRoom ? selectedRoom.id_ruangan : ""}
                onChange={(e) => {
                  const room = rooms.find(
                    (room) => room.id_ruangan === Number(e.target.value)
                  );
                  console.log("rooms: ", room);
                  setSelectedRoom(room);
                  console.log(selectedRoom);
                }}
              >
                <option value="">Pilih Ruangan</option>
                {rooms.map((room) => (
                  <option key={room.id_ruangan} value={room.id_ruangan}>
                    {room.no_ruangan}
                  </option>
                ))}
              </Form.Control>
            </>
          )}

          <Button className="w-100 mt-3" onClick={fetchAvailablePegawai}>
            {selectedOption === "Perawatan Dengan Konsultasi" ||
            selectedOption === "Pembelian Produk dengan Konsultasi"
              ? "Pilih Pegawai (Dokter)"
              : "Pilih Pegawai (Beautician)"}
          </Button>

          <div className="mt-3">
            {pegawais.map((pegawai) => (
              <div
                key={pegawai.id}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <span>{pegawai.nama_pegawai}</span>
                <Button
                  className="btn-sm"
                  onClick={() => setSelectedPegawai(pegawai)}
                >
                  Pilih
                </Button>
              </div>
            ))}
          </div>

          {selectedPegawai && (
            <Button
              className="w-100 mt-3"
              variant="success"
              onClick={handleConfirmation}
            >
              Konfirmasi
            </Button>
          )}

          {showCariLagiButton && (
            <Button
              className="w-100 mt-3"
              variant="warning"
              onClick={resetSearch}
            >
              Cari Lagi
            </Button>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PelayananCustomer;
