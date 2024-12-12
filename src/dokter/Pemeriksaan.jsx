import React, { useState, useEffect } from "react";
import { showAntrianDokter, showRiwayatCustomer } from "../api/apiTransaksi";
import {
  InputDataPemeriksaan,
  InputProduk,
  InputPerawatan,
} from "../api/apiTransaksi";
import { GetAllProduk } from "../api/apiProduk";
import { GetAllPerawatan } from "../api/apiPerawatan";
import { GetAllRuangan } from "../api/apiRuangan";
import { GetAllPegawai } from "../api/apiPegawai";
import { Button, Modal, Form } from "react-bootstrap";

const Pemeriksaan = () => {
  const [temporaryFormValues, setTemporaryFormValues] = useState({
    id_ruangan: "",
    id_beautician: "",
  });
  const [antrianDokter, setAntrianDokter] = useState([]);
  const [riwayatCustomer, setRiwayatCustomer] = useState([]);
  const [produks, setProduks] = useState([]);
  const [perawatans, setPerawatans] = useState([]);
  const [ruangans, setRuangans] = useState([]);
  const [beauticians, setBeauticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const dokterId = sessionStorage.getItem("user_id");

  const [showModal, setShowModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showProdukPerawatanModal, setShowProdukPerawatanModal] =
    useState(false); // State untuk modal input produk/perawatan
  const [formValues, setFormValues] = useState({
    id_produk: [],
    id_perawatan: [],
    id_ruangan: "",
    id_beautician: "",
    id_transaksi: "",
  });

  const [selectedItems, setSelectedItems] = useState({
    id_produk: [],
    id_perawatan: [],
  }); // State untuk produk/perawatan yang dipilih

  const [temporarySelectedItems, setTemporarySelectedItems] = useState({
    id_produk: [],
    id_perawatan: [],
  });

  const [selectedRiwayat, setSelectedRiwayat] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTemporaryDataPemeriksaan((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const antrianData = await showAntrianDokter(dokterId);
        setAntrianDokter(antrianData);

        const produkData = await GetAllProduk();
        setProduks(produkData);

        const perawatanData = await GetAllPerawatan();
        setPerawatans(perawatanData);

        const ruanganData = await GetAllRuangan();
        setRuangans(
          ruanganData.filter((r) => r.status?.toLowerCase() === "available")
        );

        const pegawaiData = await GetAllPegawai();
        setBeauticians(
          pegawaiData.filter(
            (pegawai) =>
              pegawai.jabatan_pegawai?.toLowerCase() === "beautician" &&
              pegawai.status_pegawai?.toLowerCase() === "available"
          )
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dokterId, selectedItems]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedItems({ id_produk: [], id_perawatan: [] });
    resetFormValues();
  };

  const handleCloseRiwayatModal = () => {
    setShowRiwayatModal(false);
  };

  const handleShowProdukPerawatanModal = (id_transaksi) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      id_transaksi, // Set the transaction ID in form values
    }));
    console.log("tes sebelum sementara produk: ", selectedItems.id_produk);
    console.log(
      "tes sebelum sementara perawatan: ",
      selectedItems.id_perawatan
    );

    setTemporarySelectedItems({
      id_produk: selectedItems.id_produk, // previous selected produk
      id_perawatan: selectedItems.id_perawatan, // previous selected perawatan
    });
    setShowProdukPerawatanModal(true);
    console.log("produk semeentara terpilih", temporarySelectedItems.id_produk);
    console.log(
      "perawatan semeentara terpilih",
      temporarySelectedItems.id_perawatan
    );
  };

  const handleCloseProdukPerawatanModal = () => {
    setShowProdukPerawatanModal(false);
  };

  const handleToggleProduk = (id_produk) => {
    setTemporarySelectedItems((prev) => {
      const isSelected = prev.id_produk.includes(id_produk);
      return {
        ...prev,
        id_produk: isSelected
          ? prev.id_produk.filter((id) => id !== id_produk)
          : [...prev.id_produk, id_produk],
      };
    });
  };

  const handleTogglePerawatan = (id_perawatan) => {
    console.log("tes jalan toggle perawatan");
    setTemporarySelectedItems((prev) => {
      const isSelected = prev.id_perawatan.includes(id_perawatan);
      return {
        ...prev,
        id_perawatan: isSelected
          ? prev.id_perawatan.filter((id) => id !== id_perawatan)
          : [...prev.id_perawatan, id_perawatan],
      };
    });
  };

  const handleAddProduk = (id_produk) => {
    setSelectedItems((prev) => ({
      ...prev,
      id_produk: [...prev.id_produk, id_produk],
    }));
  };

  const handleAddPerawatan = (id_perawatan) => {
    setSelectedItems((prev) => ({
      ...prev,
      id_perawatan: [...prev.id_perawatan, id_perawatan],
    }));
  };

  const handleSaveProdukPerawatan = async () => {
    try {
      setSelectedItems(temporarySelectedItems); // Update selected items with temporary selection
      const dataProduk = {
        id_transaksi: formValues.id_transaksi,
        id_produk: temporarySelectedItems.id_produk,
      };
      const dataPerawatan = {
        id_transaksi: formValues.id_transaksi,
        id_perawatan: temporarySelectedItems.id_perawatan,
      };

      // Memastikan data produk dan perawatan disimpan secara terpisah
      if (dataProduk.id_produk.length > 0) {
        await InputProduk(dataProduk); // Kirim data produk ke API InputProduk
      }
      if (dataPerawatan.id_perawatan.length > 0) {
        await InputPerawatan(dataPerawatan); // Kirim data perawatan ke API InputPerawatan
      }

      alert("Data produk/perawatan berhasil disimpan.");
      handleCloseProdukPerawatanModal();
    } catch (error) {
      console.error("Error saving produk/perawatan:", error);
      alert("Gagal menyimpan produk/perawatan.");
    }
  };

  const resetFormValues = () => {
    setFormValues({
      id_ruangan: "",
      id_beautician: "",
      id_transaksi: "", // pastikan id_transaksi kosong setelah reset
      id_produk: [],
      id_perawatan: [],
    });
  };

  const handleShowRiwayatModal = async (id_customer) => {
    try {
      console.log("id customer: ",id_customer)
      const customerHistory = await showRiwayatCustomer(id_customer);
      setSelectedRiwayat(customerHistory);
      setShowRiwayatModal(true);
    } catch (error) {
      alert("Customer belum memiliki history!");
      console.error("Error fetching customer history:", error);
    }
  };

  const handleInputPemeriksaan = async () => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menyimpan data pemeriksaan?"
    );
    if (isConfirmed) {
      try {
        const updatedFormValues = {
          ...formValues,
          id_ruangan: temporaryFormValues.id_ruangan,
          id_beautician: temporaryFormValues.id_beautician,
        };
        console.log("id_beautician: ", updatedFormValues.id_beautician);
        console.log("id_ruangan: ", updatedFormValues.id_ruangan);
  
        await InputDataPemeriksaan(updatedFormValues); // panggil API dengan data yang sudah diperbarui
        alert("Data pemeriksaan berhasil disimpan.");
        handleCloseModal(); // tutup modal setelah sukses
        window.location.reload();
      } catch (error) {
        console.error("Error saving pemeriksaan data:", error);
        alert("Gagal menyimpan data pemeriksaan.");
      }
    } else {
      alert("Proses penyimpanan data dibatalkan.");
    }
  };
  

  const handleShowModalInput = (id_transaksi) => {
    setFormValues({ ...formValues, id_transaksi }); // set id_transaksi pada form
    setShowModal(true);
  };

  return (
    <div>
      <h2>Transaksi Antrian ke Dokter</h2>

      {antrianDokter.length > 0 ? (
        <div>
          <table
            className="table table-bordered"
            cellPadding="10"
            style={{ width: "100%", marginBottom: "20px" }}
          >
            <thead>
              <tr>
                <th>Transaksi ID</th>
                <th>Nama Customer</th>
                <th>Keluhan</th>
                <th>Jensi Transaksi</th>
                <th>Tanggal Transaksi</th>
                <th>Customer ID</th>
                <th>Riwayat</th>
                <th>Data Pemeriksaan</th>
              </tr>
            </thead>
            <tbody>
              {antrianDokter.map((transaksi) => (
                <tr key={transaksi.id_transaksi}>
                  <td>{transaksi.id_transaksi}</td>
                  <td>{transaksi.customer.nama_customer}</td>
                  <td>{transaksi.keluhan}</td>
                  <td>{transaksi.jenis_transaksi}</td>
                  <td>{transaksi.tanggal_transaksi}</td>
                  <td>{transaksi.customer.id_customer}</td>
                  <td>
                    <Button
                      className="my-1 mx-2 btn btn-info"
                      onClick={() =>
                        handleShowRiwayatModal(transaksi.customer.id_customer)
                      }
                    >
                      Lihat Riwayat
                    </Button>
                  </td>
                  <td>
                    {transaksi.jenis_transaksi ===
                      "Perawatan dengan Konsultasi" && (
                      <Button
                        style={{ width: "50%", backgroundColor: "none" }}
                        className="mx-1 btn btn-warning"
                        onClick={() =>
                          handleShowModalInput(transaksi.id_transaksi)
                        }
                      >
                        Input Pemeriksaan
                      </Button>
                    )}
                    <Button
                      style={{ width: "50%" }}
                      className="my-1 mx-1"
                      onClick={() =>
                        handleShowProdukPerawatanModal(transaksi.id_transaksi)
                      }
                    >
                      Input Produk / Perawatan
                    </Button>
                    <Button
                      style={{ width: "50%" }}
                      className="my-1 mx-1 btn btn-success"
                      onClick={handleInputPemeriksaan}
                    >
                      Selesai
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Tidak ada antrian untuk dokter ini</p>
      )}

      {/* Modal Riwayat Transaksi */}
      <Modal show={showRiwayatModal} onHide={handleCloseRiwayatModal}>
        <Modal.Header closeButton>
          <Modal.Title>Riwayat Transaksi Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRiwayat && selectedRiwayat.length > 0 ? (
            selectedRiwayat.map((riwayat) => (
              <div key={riwayat.id_transaksi}>
                <h5>Nomor Transaksi: {riwayat.nomor_transaksi}</h5>
                <p>Tanggal: {riwayat.tanggal_transaksi}</p>

                {/* Show products associated with the transaction */}
                {riwayat.produk && riwayat.produk.length > 0 && (
                  <div>
                    <h6>Produk</h6>
                    <ul>
                      {riwayat.produk.map((item) => (
                        <li key={item.id_produk}>{item.nama_produk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show treatments associated with the transaction */}
                {riwayat.perawatan && riwayat.perawatan.length > 0 && (
                  <div>
                    <h6>Perawatan</h6>
                    <ul>
                      {riwayat.perawatan.map((item) => (
                        <li key={item.id_perawatan}>{item.nama_perawatan}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <hr />
              </div>
            ))
          ) : (
            <p>Belum ada riwayat transaksi untuk customer ini.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRiwayatModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal untuk Input Pemeriksaan */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Input Data Pemeriksaan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="id_ruangan">
              <Form.Label>Ruangan</Form.Label>
              <Form.Control
                as="select"
                value={temporaryFormValues.id_ruangan}
                onChange={(e) =>
                  setTemporaryFormValues({
                    ...temporaryFormValues,
                    id_ruangan: e.target.value,
                  })
                }
              >
                <option value="">Pilih Ruangan</option>
                {ruangans.map((ruangan) => (
                  <option key={ruangan.id_ruangan} value={ruangan.id_ruangan}>
                    {ruangan.no_ruangan}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="id_beautician">
              <Form.Label>Beautician</Form.Label>
              <Form.Control
                as="select"
                value={temporaryFormValues.id_beautician}
                onChange={(e) =>
                  setTemporaryFormValues({
                    ...temporaryFormValues,
                    id_beautician: e.target.value,
                  })
                }
              >
                <option value="">Pilih Beautician</option>
                {beauticians.map((beautician) => (
                  <option
                    key={beautician.id_pegawai}
                    value={beautician.id_pegawai}
                  >
                    {beautician.nama_pegawai}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
          {/* <Button variant="primary" onClick={handleInputPemeriksaan}>
            Simpan
          </Button> */}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showProdukPerawatanModal}
        onHide={handleCloseProdukPerawatanModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pilih Produk dan Perawatan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Pilih Produk</h5>
          {produks.map((produk) => (
            <div key={produk.id_produk}>
              <input
                type="checkbox"
                checked={temporarySelectedItems.id_produk.includes(
                  produk.id_produk
                )}
                // value={produk.id_produk}
                onChange={() => handleToggleProduk(produk.id_produk)}
              />
              {produk.nama_produk} - {produk.harga_produk} IDR
            </div>
          ))}
          <h5 className="mt-3">Pilih Perawatan</h5>
          {perawatans.map((perawatan) => (
            <div key={perawatan.id_perawatan}>
              <input
                type="checkbox"
                checked={temporarySelectedItems.id_perawatan.includes(
                  perawatan.id_perawatan
                )}
                // value={perawatan.id_perawatan}
                onChange={() => handleTogglePerawatan(perawatan.id_perawatan)}
              />
              {perawatan.nama_perawatan} - {perawatan.harga_perawatan} IDR
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProdukPerawatanModal}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSaveProdukPerawatan}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Pemeriksaan;
