import React, { useEffect, useState } from "react";
import {
  GetAllPerawatan,
  UpdatePerawatan,
  DeletePerawatan,
  CreatePerawatan,
  GetPewawatanByNama,
} from "../api/apiPerawatan";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";


const CRUDPerawatan = () => {
  const [perawatans, setPerawatans] = useState([]);
  const [filteredPerawatans, setFilteredPerawatans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPerawatan, setSelectedPerawatan] = useState(null);
  const [formValues, setFormValues] = useState({
    nama_perawatan: "",
    keterangan_perawatan: "",
    syarat_perawatan: "",
    harga_perawatan: "",
    gambar_perawatan: null, 
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchPerawatans = async () => {
      try {
        const data = await GetAllPerawatan();
        setPerawatans(data);
        setFilteredPerawatans(data);
      } catch (error) {
        toast.error(error.message || "Gagal Mendapatkan Data Perawatan");
      } finally {
        setLoading(false);
      }
    };

    fetchPerawatans();
  }, []);



  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query) {
      try {
        const searchResults = await GetPewawatanByNama(query);
        setFilteredPerawatans(searchResults);
      } catch (error) {
        toast.error(error.message || "Gagal Mencari Data Perawatan");
        setFilteredPerawatans([]);
      }
    } else {
      setFilteredPerawatans(perawatans);
    }
  };



  // const handleDeleteClick = async (id) => {
  //   const confirmed = window.confirm(
  //     "Apakah Anda yakin ingin menghapus perawatan ini?"
  //   );
  //   if (!confirmed) return;

  //   const updatedPerawatans = perawatans.filter(
  //     (item) => item.id_perawatan !== id
  //   );
  //   setPerawatans(updatedPerawatans);
  //   setFilteredPerawatans(updatedPerawatans);

  //   try {
  //     await DeletePerawatan(id);
  //     toast.success("Data Perawatan Berhasil Dihapus!");
  //   } catch (error) {
  //     setPerawatans(perawatans);
  //     setFilteredPerawatans(perawatans);
  //     toast.error(error.message || "Gagal Menghapus Data Perawatan");
  //   }
  // };

  const handleDeleteClick = async (id) => {
    const confirmDeleteToast = toast(
      <div>
        <p>Apakah Anda yakin ingin menghapus data perawatan ini?</p>
        <div>
          <button
            onClick={async () => {
              try {
                const updatedPerawatans = perawatans.filter(
                  (p) => p.id_perawatan !== id
                );
                setPerawatans(updatedPerawatans);
                setFilteredPerawatans(updatedPerawatans);
                await DeletePerawatan(id);
                toast.dismiss(confirmDeleteToast);
                toast.success("Data Perawatan Berhasil Dihapus!");
              } catch (error) {
                setPerawatans(perawatans);
                setFilteredPerawatans(perawatans);
                toast.error(error.message || "Gagal Menghapus Data Pegawai");
              }
            }}
            className="btn btn-primary"
            style={{ margin: "5px 10px" }}
          >
            {" "}
            Ya
          </button>
          <button
            onClick={() => toast.dismiss(confirmDeleteToast)}
            className="btn btn-danger"
            style={{ margin: "5px 10px" }}
          >
            {" "}
            Batal
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        progress: undefined,
        hideProgressBar: true,
        className: "confirm-toast",
      }
    );
  };



  const handleEditClick = (perawatan) => {
    setSelectedPerawatan(perawatan);
    setFormValues({
      nama_perawatan: perawatan.nama_perawatan,
      keterangan_perawatan: perawatan.keterangan_perawatan,
      syarat_perawatan: perawatan.syarat_perawatan|| "",
      harga_perawatan: perawatan.harga_perawatan,
      gambar_perawatan: perawatan.gambar_perawatan, 
    });
    setIsEditMode(true);
    setShowModal(true);
  };



  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPerawatan(null);
    setIsEditMode(false);
    setFormValues({
      nama_perawatan: "",
      keterangan_perawatan: "",
      syarat_perawatan: "",
      harga_perawatan: "",
      gambar_perawatan: null, 
    });
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };



  const handleFileChange = (e) => {
    setFormValues({ ...formValues, gambar_perawatan: e.target.files[0] });
  };



  const handleSaveChanges = async () => {
    const {
      nama_perawatan,
      keterangan_perawatan,
      syarat_perawatan,
      harga_perawatan,
      gambar_perawatan,
    } = formValues;

    if (
      !nama_perawatan &&
      !keterangan_perawatan &&
      !syarat_perawatan &&
      !harga_perawatan
    ) {
      toast.error("Semua field harus diisi!");
      return;
    }

    if (!nama_perawatan) {
      toast.error("Nama perawatan harus diisi!");
      return;
    }
    if (!keterangan_perawatan) {
      toast.error("Keterangan perawatan harus diisi!");
      return;
    }
    if (!syarat_perawatan) {
      toast.error("Syarat perawatan harus diisi!");
      return;
    }
    if (!harga_perawatan) {
      toast.error("Harga perawatan harus diisi!");
      return;
    }


    if (isNaN(harga_perawatan) || harga_perawatan <= 0) {
      toast.error(
        "Harga perawatan harus berupa angka yang valid dan lebih dari 0!"
      );
      return;
    }

    if (!isEditMode) {
      if (!gambar_perawatan) {
        toast.error("Gambar Perawatan Harus Dipilih!");
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (gambar_perawatan.size > maxSize) {
        toast.error("Ukuran Gambar Terlalu Besar! Maksimal 2MB.");
        return;
      }
    }

    try {
      if (isEditMode) {
        // Update mode
        const updateData = { ...selectedPerawatan, ...formValues };

        if (
          !formValues.gambar_perawatan ||
          typeof formValues.gambar_perawatan === "string"
        ) {
          delete updateData.gambar_perawatan;
        }

        await UpdatePerawatan(updateData); 
        toast.success("Data Perawatan Berhasil Diperbaharui!");

        setFilteredPerawatans(
          filteredPerawatans.map((perawatan) =>
            perawatan.id_perawatan === selectedPerawatan.id_perawatan
              ? { ...perawatan, ...updateData }
              : perawatan
          )
        );
      } else {
        const newPerawatan = await CreatePerawatan(formValues);
          toast.success("Data Perawatan Berhasil Dibuat!");
          setFilteredPerawatans([...filteredPerawatans, newPerawatan]);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || "Gagal Menyimpan Data Perawatan");
    }
  };



  return (
    <div>
      <h1 className="mt-5">Pengelolaan Data Perawatan</h1>
      <ToastContainer />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Cari Data Perawatan..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "300px", marginLeft: "10px" }}
        />

        <Button
          variant="success"
          onClick={() => {
            setShowModal(true);
            setIsEditMode(false);
          }}
        >
          Tambah Data Perawatan
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nama Perawatan</th>
              <th scope="col">Keterangan Perawatan</th>
              <th scope="col">Syarat Perawatan</th>
              <th scope="col">Harga Perawatan</th>
              <th scope="col">Gambar Perawatan</th>
              <th scope="col">Ubah</th>
              <th scope="col">Hapus</th>
            </tr>
          </thead>

          <tbody>
            {filteredPerawatans.length > 0 ? (
              filteredPerawatans.map((perawatan, index) => (
                <tr key={perawatan.id_perawatan}>
                  <td>{index + 1}</td>
                  <td>{perawatan.nama_perawatan}</td>
                  <td>{perawatan.keterangan_perawatan}</td>
                  <td>{perawatan.syarat_perawatan}</td>
                  <td>Rp {perawatan.harga_perawatan}</td>
                  <td>
                    <img
                      src={`http://127.0.0.1:8000/images/perawatan/${perawatan.gambar_perawatan}`}
                      alt={perawatan.nama_perawatan}
                      width="50"
                    />
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      style={{ marginRight: "7px", width: "5vw" }}
                      onClick={() => handleEditClick(perawatan)}
                    >
                      <FaEdit />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      style={{ marginRight: "7px", width: "5vw" }}
                      onClick={() => handleDeleteClick(perawatan.id_perawatan)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Tidak ada data perawatan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Ubah Data Perawatan" : "Tambah Data Perawatan"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama Perawatan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Nama Perawatan"
                name="nama_perawatan"
                value={formValues.nama_perawatan}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Keterangan Perawatan</Form.Label>
              <Form.Control
                as="textarea"
                name="keterangan_perawatan"
                placeholder="Masukkan Keterangan Perawatan"
                value={formValues.keterangan_perawatan}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Syarat Perawatan</Form.Label>
              <Form.Control
                as="select"
                name="syarat_perawatan"
                value={formValues.syarat_perawatan || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Syarat Perawatan</option>
                <option value="Tanpa Tindakan Medis">
                  Tanpa Tindakan Medis
                </option>
                <option value="Dengan Tindakan Medis">
                  Dengan Tindakan Medis
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Harga Perawatan</Form.Label>
              <Form.Control
                type="number"
                name="harga_perawatan"
                placeholder="Masukkan Harga Perawatan"
                value={formValues.harga_perawatan}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Gambar Perawatan</Form.Label>
              <div>
                {formValues.gambar_perawatan && (
                  <img
                    src={`http://127.0.0.1:8000/images/perawatan/${formValues.gambar_perawatan}`}
                    alt="Preview Gambar"
                    style={{
                      width: "100px",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="gambar_perawatan"
                  onChange={handleFileChange}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            {isEditMode ? "Simpan Perubahan" : "Tambah Data Perawatan"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CRUDPerawatan;
