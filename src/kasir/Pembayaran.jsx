import React, { useState, useEffect } from "react";
import {
  TransaksiBelumBayar,
  BayarTransaksi,
  showDetailTransaksi,
  showPegawai,
  showCustomer,
} from "../api/apiTransaksi"; // Asumsikan ini adalah API yang sudah diintegrasi
import { Button, Modal, Form } from "react-bootstrap"; // Import Modal dan Button dari react-bootstrap
import { GetAllPromo } from "../api/apiPromo"; // Impor API promo yang sudah diintegrasi
import "./Pembayaran.css";

const Pembayaran = () => {
  const [isProductDelivered, setIsProductDelivered] = useState({});
  const [transaksiBelumBayar, setTransaksiBelumBayar] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [promoList, setPromoList] = useState([]); // Menyimpan promo yang tersedia
  const [perawatanTotal, setPerawatanTotal] = useState(0); // Menyimpan total perawatan untuk transaksi yang dipilih

  const handleProductDelivered = (transaksiId) => {
    setIsProductDelivered((prev) => ({
      ...prev,
      [transaksiId]: true,
    }));
    alert("Produk diserahkan!");
  };

  // Fungsi untuk menghitung subtotal dari produk dan perawatan
  const calculateSubtotal = (produk, perawatan) => {
    const produkTotal = produk.reduce(
      (total, item) => total + item.harga_produk,
      0
    );
    const perawatanTotal = perawatan.reduce(
      (total, item) => total + item.harga_perawatan,
      0
    );
    return produkTotal + perawatanTotal;
  };

  // Mengambil daftar promo dari API
  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const promoData = await GetAllPromo(); // Mengambil data promo dari API
        setPromoList(promoData);
        console.log(promoList);
      } catch (error) {
        console.error("Error fetching promo:", error);
      }
    };
    fetchPromo();
  }, []);

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const data = await TransaksiBelumBayar();
        const transaksiDenganSubtotal = data.map((transaksi) => {
          const subtotal = calculateSubtotal(
            transaksi.produk,
            transaksi.perawatan
          );
          return { ...transaksi, subtotal, isPaid: false };
        });
        setTransaksiBelumBayar(transaksiDenganSubtotal);
      } catch (error) {
        console.error("Error fetching transaksi:", error);
      }
    };
    fetchTransaksi();
  }, []);

  // Fungsi untuk menentukan promo yang valid berdasarkan kondisi pelanggan
  const getValidPromos = (transaksi) => {
    const validPromos = [];
    const today = new Date(); // Mendapatkan tanggal saat ini
    const birthDate = new Date(transaksi.customer.tanggal_lahir); // Mengubah tanggal lahir menjadi objek Date
    const birthMonth = birthDate.getMonth(); // Mendapatkan bulan dari tanggal lahir (0-indexed)
    const birthDay = birthDate.getDate(); // Mendapatkan tanggal dari tanggal lahir
    console.log("total perawatan: ", transaksi.perawatanTotal);
    console.log("total customer: ", transaksi.customer.poin_customer);
    console.log("poin perawatan: ", transaksi.perawatan[0]?.poin_perawatan);

    promoList.forEach((promo) => {
      if (promo.kode_promo === "BDAY") {
        // Promo ulang tahun (BDAY) hanya berlaku jika hari ini adalah ulang tahun customer
        if (birthMonth === today.getMonth() && birthDay === today.getDate()) {
          validPromos.push(promo);
        }
      } else if (promo.kode_promo === "MHS") {
        // Promo untuk mahasiswa (MHS) hanya berlaku jika customer berusia di bawah 22 tahun
        const birthYear = birthDate.getFullYear(); // Mendapatkan tahun lahir
        const age = today.getFullYear() - birthYear; // Menghitung umur berdasarkan tahun lahir dan tahun saat ini
        if (age < 22) {
          validPromos.push(promo);
        }
      } else if (
        promo.kode_promo === "KART" &&
        today.getMonth() === 3 &&
        today.getDate() === 21
      ) {
        validPromos.push(promo); // Promo Kartini hanya berlaku pada tanggal 21 April
      } else if (
        promo.kode_promo === "17AN" &&
        today.getMonth() === 7 &&
        today.getDate() === 17
      ) {
        validPromos.push(promo); // Promo Hari Kemerdekaan hanya berlaku pada tanggal 17 Agustus
      } else if (promo.kode_promo === "POIN") {
        const pointsRequiredForPerawatan = Math.floor(
          transaksi.perawatanTotal / 10000
        );
        if (
          transaksi.customer.poin_customer >=
          transaksi.perawatan[0]?.poin_perawatan
        ) {
          validPromos.push(promo); // Promo poin hanya valid jika cukup poin
        }
      }
    });

    return validPromos;
  };

  // Fungsi untuk menghitung diskon berdasarkan promo yang dipilih
  const calculateDiscount = (
    promo,
    finalSubtotal,
    customerPoin,
    perawatanTotal
  ) => {
    let discount = 0;
    // console.log("poin customerrrr: ", customerPoin);

    if (promo.kode_promo === "BDAY") {
      // Diskon 20% untuk promo ulang tahun (BDAY)
      discount = finalSubtotal * 0.2;
    } else if (promo.kode_promo === "MHS") {
      // Diskon 10% untuk promo mahasiswa (MHS)
      discount = finalSubtotal * 0.1;
    } else if (promo.kode_promo === "KART") {
      // Diskon 10% untuk promo Kartini (KART) - Tanggal 21 April
      discount = finalSubtotal * 0.1;
    } else if (promo.kode_promo === "17AN") {
      // Diskon 17% untuk promo Hari Kemerdekaan (17AN) - Tanggal 17 Agustus
      discount = finalSubtotal * 0.17;
    } else if (promo.kode_promo === "POIN") {
      // Diskon berdasarkan poin (POIN)
      //   const points = Math.floor(finalSubtotal / 50000);
      //   discount = points * 5000; // Misal, 1 poin = diskon Rp 5000

      const pointsRequiredForPerawatan = Math.floor(perawatanTotal / 10000); // 1 poin = 10.000 IDR
      const maxDiscount = customerPoin * 10000; // Total diskon yang bisa diberikan sesuai poin

      // Poin hanya dapat digunakan jika cukup untuk menutupi biaya perawatan
      if (customerPoin >= pointsRequiredForPerawatan) {
        console.log("tes masuk", customerPoin);
        discount = Math.min(maxDiscount, perawatanTotal); // Maksimal diskon sesuai dengan biaya perawatan
        console.log("diskonnya berapa: ", discount);
        return discount;
      }
    }

    return discount;
  };

  const handleBayarClick = (transaksi) => {
    const perawatanTemp = transaksi.perawatan;
    const perawatanTotal = perawatanTemp.reduce(
      (total, item) => total + item.harga_perawatan,
      0
    );
    // Set state dengan total perawatan
    setPerawatanTotal(perawatanTotal);
    setSelectedTransaksi(transaksi);
    setSelectedTransaksi({
      ...transaksi,
      perawatanTotal, // Menyimpan total perawatan pada selectedTransaksi
    });
    setShowModal(true);
  };

  const handlePayment = async () => {
    const finalSubtotal = selectedTransaksi.subtotal;

    // Menghitung potongan berdasarkan promo yang dipilih
    let discount = 0;
    if (selectedTransaksi.selectedPromo) {
      const promo = selectedTransaksi.selectedPromo;
      console.log("promo: ", promo);
      console.log(
        "poin customerrrrrrrrrrrrr: ",
        selectedTransaksi.customer.poin_customer
      );
      discount = calculateDiscount(
        promo,
        finalSubtotal,
        selectedTransaksi.customer.poin_customer,
        perawatanTotal
      );
      console.log("diskonnnnnnnn: ", discount);
    }

    // Mengurangi subtotal dengan diskon yang dihitung
    const newSubtotal = finalSubtotal - discount;
    console.log("diskonnya: ", discount);
    if (paymentAmount - newSubtotal < 0) {
      alert("Uang tidak cukup!");
    } else {
      setChangeAmount(paymentAmount - newSubtotal);
      setTransaksiBelumBayar((prevTransaksi) =>
        prevTransaksi.map((transaksi) =>
          transaksi.id_transaksi === selectedTransaksi.id_transaksi
            ? { ...transaksi, isPaid: true, finalSubtotal: newSubtotal }
            : transaksi
        )
      );

      const paymentData = {
        id_promo: selectedTransaksi.selectedPromo
          ? selectedTransaksi.selectedPromo.id_promo
          : null,
        id_transaksi: selectedTransaksi.id_transaksi,
        nominal_transaksi: newSubtotal,
        id_kasir: sessionStorage.getItem("user_id"),
        penguranganPoin: selectedTransaksi.perawatan
          ? selectedTransaksi.perawatan[0]?.poin_perawatan
          : null,
        penambahanPoin: Math.floor(newSubtotal / 50000),
        // Anda bisa menambahkan informasi lain yang diperlukan sesuai dengan API backend
      };
      console.log("id_kasir: ", paymentData.id_kasir);
      console.log("id_promo: ", paymentData.id_promo);
      console.log("id_transaksi: ", paymentData.id_transaksi);
      console.log("Nominal Transaksi", paymentData.nominal_transaksi);
      console.log("tambahan poin", paymentData.penambahanPoin);
      console.log("pengurangan poin", paymentData.penguranganPoin);

      try {
        // Mengirim data ke backend untuk memproses pembayaran
        const response = await BayarTransaksi(paymentData);
        if (response) {
          alert("Pembayaran berhasil!");
          setShowModal(false);
        }
      } catch (error) {
        console.error("Pembayaran gagal:", error);
        alert("Terjadi kesalahan saat memproses pembayaran.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePrintReceipt = async (
    transaksi,
    paymentAmount = 0,
    changeAmount = 0
  ) => {
    console.log("transaksinya adalah:    ", transaksi);
    const detailTransaksi = await showDetailTransaksi(transaksi.id_transaksi);
    console.log("detail transaksi: ", detailTransaksi);
    // console.log("id beautician: ", detailTransaksi.id_beautician)
    console.log("id Kasir: ", detailTransaksi.id_kasir);
    // console.log("id dokter: ", detailTransaksi.id_dokter)
    // const [paymentAmount, setPaymentAmount] = useState(0);
    // const [namaKasir, setNamaKasir] = useState("");
    // await showPegawai(detailTransaksi.id_kasir);
    // const [namaBeautician, setNamaBeautician] = await showPegawai(detailTransaksi.id_kasir);
    // const [namaDokter, setNamaDokter] = await showPegawai(detailTransaksi.id_kasir);
    // const namaBeautician = await showPegawai(detailTransaksi.id_beautician);
    // const namaDokter = await showPegawai(detailTransaksi.id_dokter);

    // Ambil nama kasir
    // const [namaKasir, setNamaKasir] = useState("");
    // const [namaBeautician, setNamaBeautician] = useState("");
    // const [namaDokter, setNamaDokter] = useState("");
    // if (detailTransaksi.id_kasir) {
    //   const kasirData = await showPegawai(detailTransaksi.id_kasir);
    //   setNamaKasir(kasirData.nama_pegawai);
    // }

    // // Ambil nama beautician
    // if (detailTransaksi.id_beautician) {
    //   const beauticianData = await showPegawai(detailTransaksi.id_beautician);
    //   setNamaBeautician(beauticianData.nama_pegawai);
    // }

    // // Ambil nama dokter
    // if (detailTransaksi.id_dokter) {
    //   const dokterData = await showPegawai(detailTransaksi.id_dokter);
    //   setNamaDokter(dokterData.nama_pegawai);
    // }

    console.log("Detail transaksi: ", detailTransaksi);
    const promoCode = detailTransaksi?.kode_promo || "N/A";
    const beauticianName = detailTransaksi.pegawai.nama_pegawai || "N/A";
    const cashierName = detailTransaksi.pegawai.nama_pegawai || "N/A";
    const transactionDate = transaksi.tanggal_transaksi
      ? new Date(transaksi.tanggal_transaksi)
      : new Date();
    const formattedDate = `${transactionDate.getDate()}-${
      transactionDate.getMonth() + 1
    }-${transactionDate.getFullYear()}`;
    const transactionId = transaksi.nomor_transaksi || "N/A";
    const subtotal = transaksi.subtotal || 0;
    const finalSubtotal = transaksi.finalSubtotal || subtotal;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .receipt-container { width: 350px; margin: auto; padding: 20px; border: 1px solid #000; }
            .header, .footer { text-align: center; margin-bottom: 20px; }
            .header h2 { margin: 0; }
            .item-list { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .item-list th, .item-list td { border: 1px solid #000; padding: 5px; text-align: left; }
            .total-section { margin-top: 20px; }
            .total-section div { display: flex; justify-content: space-between; padding: 5px 0; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h2>Natural Beauty Center</h2>
              <p>Jl. Babarsari No. 43, Yogyakarta</p>
              <p>Telp. (0274) 487711</p>
            </div>
  
            <div>
              <strong>Nomor Transaksi:</strong> ${transactionId}<br/>
              <strong>Tanggal:</strong> ${formattedDate}<br/>
              <strong>Promo:</strong> ${promoCode}<br/>
              <strong>Customer Service:</strong> ${cashierName}<br/>
              <strong>Kasir:</strong> ${cashierName}<br/>
              <strong>Beautician:</strong> ${cashierName}
            </div>
  
            <table class="item-list">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                  <th>Sub Total</th>
                </tr>
              </thead>
              <tbody>
                ${
                  transaksi.produk
                    ?.map(
                      (product) => `
                  <tr>
                    <td>${product.nama_produk || "N/A"}</td>
                    <td>${(product.harga_produk || 0).toLocaleString()}</td>
                    <td>1</td>
                    <td>${(product.harga_produk || 0).toLocaleString()}</td>
                  </tr>
                `
                    )
                    .join("") || ""
                }
                ${
                  transaksi.perawatan
                    ?.map(
                      (service) => `
                  <tr>
                    <td>${service.nama_perawatan || "N/A"}</td>
                    <td>${(service.harga_perawatan || 0).toLocaleString()}</td>
                    <td>1</td>
                    <td>${(service.harga_perawatan || 0).toLocaleString()}</td>
                  </tr>
                `
                    )
                    .join("") || ""
                }
              </tbody>
            </table>
  
            <div class="total-section">
              <div><strong>Total:</strong> <span>Rp ${subtotal.toLocaleString()}</span></div>
              <div><strong>Diskon:</strong> <span>Rp ${(
                subtotal - finalSubtotal
              ).toLocaleString()}</span></div>
              <div><strong>Total Akhir:</strong> <span>Rp ${finalSubtotal.toLocaleString()}</span></div>
              <div><strong>Tunai:</strong> <span>Rp ${paymentAmount.toLocaleString()}</span></div>
              <div><strong>Kembalian:</strong> <span>Rp ${changeAmount.toLocaleString()}</span></div>
            </div>
  
            <div class="footer">
              <p>Terima Kasih telah berkunjung ke Natural Beauty Center</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="my-5" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Halaman Pembayaran
      </h1>

      <section>
        <h2>Transaksi Belum Membayar</h2>
        <table className="table-pembayaran table table-striped">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Nama Customer</th>
              <th>Rincian Produk/Perawatan</th>
              <th>Subtotal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksiBelumBayar.map((transaksi) => (
              <tr key={transaksi.id_transaksi}>
                <td>{transaksi.id_transaksi}</td>
                <td>
                  {transaksi.customer
                    ? transaksi.customer.nama_customer
                    : "N/A"}
                </td>
                <td>
                  <div>
                    <strong>Produk:</strong>
                    <ul>
                      {transaksi.produk && transaksi.produk.length > 0 ? (
                        transaksi.produk.map((produk) => (
                          <li key={produk.id_produk}>
                            {produk.nama_produk} - Rp{" "}
                            {produk.harga_produk.toLocaleString()}
                          </li>
                        ))
                      ) : (
                        <li>-</li> // Jika tidak ada produk, tampilkan tanda "-"
                      )}
                    </ul>
                  </div>
                  <div>
                    <strong>Perawatan:</strong>
                    <ul>
                      {transaksi.perawatan && transaksi.perawatan.length > 0 ? (
                        transaksi.perawatan.map((perawatan) => (
                          <li key={perawatan.id_perawatan}>
                            {perawatan.nama_perawatan} - Rp{" "}
                            {perawatan.harga_perawatan.toLocaleString()}
                          </li>
                        ))
                      ) : (
                        <li>-</li> // Jika tidak ada perawatan, tampilkan tanda "-"
                      )}
                    </ul>
                  </div>
                </td>
                <td>Rp {transaksi.subtotal.toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBayarClick(transaksi)}
                    disabled={transaksi.isPaid}
                  >
                    Bayar
                  </button>
                  {transaksi.produk && transaksi.produk.length > 0 && (
                    <button
                      className="btn btn-success mx-2"
                      onClick={() =>
                        handleProductDelivered(transaksi.id_transaksi)
                      }
                      disabled={
                        !transaksi.isPaid ||
                        isProductDelivered[transaksi.id_transaksi]
                      }
                    >
                      Serahkan Produk
                    </button>
                  )}

                  {transaksi.produk && transaksi.produk.length > 0 && <br />}

                  {transaksi.produk && transaksi.produk.length > 0 && (
                    <button
                      className="btn btn-danger my-2"
                      onClick={() =>
                        handlePrintReceipt(
                          transaksi,
                          paymentAmount,
                          changeAmount
                        )
                      }
                      disabled={!isProductDelivered[transaksi.id_transaksi]}
                    >
                      Cetak Nota
                    </button>
                  )}

                  {transaksi.produk && transaksi.produk.length <= 0 && (
                    <button
                      className="btn btn-danger my-2 mx-2"
                      onClick={() =>
                        handlePrintReceipt(
                          transaksi,
                          paymentAmount,
                          changeAmount
                        )
                      }
                      disabled={!transaksi.isPaid}
                    >
                      Cetak Nota
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal Pembayaran */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rincian Pembayaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaksi && (
            <>
              <p>
                <strong>Nama Customer:</strong>{" "}
                {selectedTransaksi.customer.nama_customer}
              </p>
              <p>
                <strong>Total Perawatan:</strong> Rp{" "}
                {perawatanTotal.toLocaleString()}
              </p>
              <p>
                <strong>Promo yang Bisa Digunakan</strong>
              </p>
              <Form.Control
                as="select"
                onChange={(e) => {
                  const selectedPromo = promoList.find(
                    (promo) => promo.kode_promo === e.target.value
                  );
                  const finalSubtotal = selectedTransaksi.subtotal;
                  //   const perawatanTotal = selectedTransaksi.perawatan.reduce(
                  //     (total, item) => total + item.harga_perawatan,
                  //     0
                  //   );
                  const discount = selectedPromo
                    ? calculateDiscount(
                        selectedPromo,
                        finalSubtotal,
                        selectedTransaksi.customer.poin_customer,
                        perawatanTotal
                      )
                    : 0;
                  const newSubtotal = finalSubtotal - discount;
                  console.log("newSubtotal:", newSubtotal);
                  setSelectedTransaksi((prev) => ({
                    ...prev,
                    selectedPromo,
                    finalSubtotal: newSubtotal,
                  }));
                }}
              >
                <option value="">Promo yang tersedia</option>
                {getValidPromos(selectedTransaksi).map((promo) => (
                  <option key={promo.kode_promo} value={promo.kode_promo}>
                    {promo.kode_promo} - {promo.jenis_promo}
                  </option>
                ))}
              </Form.Control>
              <p>
                <strong>Subtotal:</strong> Rp{" "}
                {selectedTransaksi?.finalSubtotal?.toLocaleString() ||
                  selectedTransaksi?.subtotal?.toLocaleString()}
              </p>

              <Form.Group controlId="paymentAmount">
                <Form.Label>
                  <strong>Jumlah Pembayaran:</strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  min="0"
                  required
                />
              </Form.Group>
              <div>
                <strong>Kembalian:</strong> Rp {changeAmount.toLocaleString()}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            Bayar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Pembayaran;
