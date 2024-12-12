import React, { useEffect, useState } from "react";
import {
  GetAllRuangan,
  UpdateRuangan,
  DeleteRuangan,
  CreateRuangan,
  GetRuanganByNoRuangan,
} from "../api/apiRuangan";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const CRUDRuangan = () => {
  const [ruangans, setRuangans] = useState([]);
  const [filteredRuangans, setFilteredRuangans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRuangan, setSelectedRuangan] = useState(null);
  const [formValues, setFormValues] = useState({
    no_ruangan: "",
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRuangans = async () => {
      try {
        const data = await GetAllRuangan();
        setRuangans(data);
        setFilteredRuangans(data);
      } catch (error) {
        toast.error(error.message || "Gagal Memuat Data Ruangan");
      } finally {
        setLoading(false);
      }
    };

    fetchRuangans();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query) {
      try {
        const searchResults = await GetRuanganByNoRuangan(query);
        setFilteredRuangans(searchResults);
      } catch (error) {
        toast.error(error.message || "Gagal Mencari Data Ruangan");
        setFilteredRuangans([]);
      }
    } else {
      setFilteredRuangans(ruangans);
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDeleteToast = toast(
      <div>
        <p>Apakah Anda yakin ingin menghapus data ruangan ini?</p>
        <div>
          <button
            onClick={async () => {
              try {
                await DeleteRuangan(id);
                const updatedRuangans = ruangans.filter(
                  (ruangan) => ruangan.id_ruangan !== id
                );
                setRuangans(updatedRuangans);
                setFilteredRuangans(updatedRuangans);
                toast.dismiss(confirmDeleteToast);
                toast.success("Data Ruangan Berhasil Dihapus!");
              } catch (error) {
                toast.error(error.message || "Gagal Menghapus Data Ruangan");
              }
            }}
            className="btn btn-primary"
            style={{ margin: "5px 10px" }}
          >
            Ya
          </button>
          <button
            onClick={() => toast.dismiss(confirmDeleteToast)}
            className="btn btn-danger"
            style={{ margin: "5px 10px" }}
          >
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

  const handleEditClick = (ruangan) => {
    setSelectedRuangan(ruangan);
    setFormValues({
      no_ruangan: ruangan.no_ruangan,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRuangan(null);
    setIsEditMode(false);
    setFormValues({
      no_ruangan: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const noRuangan = formValues.no_ruangan.toString();

    if (!noRuangan) {
      toast.error("Nomor Ruangan Tidak Boleh Kosong!");
      return;
    }

    if (
      isNaN(parseInt(noRuangan)) ||
      parseInt(noRuangan) < 101 ||
      parseInt(noRuangan) > 110
    ) {
      toast.error("Nomor Ruangan Harus Antara 101 dan 110!");
      return;
    }

    const isExistingNoRuangan = ruangans.some(
      (ruangan) =>
        ruangan.no_ruangan.toString() === noRuangan &&
        (!isEditMode || ruangan.id_ruangan !== selectedRuangan.id_ruangan)
    );

    if (isExistingNoRuangan) {
      toast.error("Nomor Ruangan Sudah Terdaftar!");
      return;
    }

    try {
      if (isEditMode) {
        const updatedRuangan = { ...selectedRuangan, no_ruangan: noRuangan };
        await UpdateRuangan(updatedRuangan);
        toast.success("Data Ruangan Berhasil Diperbaharui!");
        setRuangans((prevRuangans) =>
          prevRuangans.map((ruangan) =>
            ruangan.id_ruangan === updatedRuangan.id_ruangan
              ? updatedRuangan
              : ruangan
          )
        );
        setFilteredRuangans((prevFiltered) =>
          prevFiltered.map((ruangan) =>
            ruangan.id_ruangan === updatedRuangan.id_ruangan
              ? updatedRuangan
              : ruangan
          )
        );
      } else {
        const newRuangan = await CreateRuangan({ no_ruangan: noRuangan });
        toast.success("Data Ruangan Berhasil Dibuat!");
        setRuangans([...ruangans, newRuangan]);
        setFilteredRuangans([...filteredRuangans, newRuangan]);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      handleCloseModal();
    } catch (error) {
      toast.error(error.message || "Gagal Menyimpan Data Ruangan");
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="mt-5">Pengelolaan Data Ruangan</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Cari Nomor Ruangan..."
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
          Tambah Data Ruangan
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nomor Ruangan</th>
              <th scope="col">Ubah</th>
              <th scope="col">Hapus</th>
            </tr>
          </thead>

          <tbody>
            {filteredRuangans.length > 0 ? (
              filteredRuangans.map((ruangan, index) => (
                <tr key={ruangan.id_ruangan}>
                  <td>{index + 1}</td>
                  <td>{ruangan.no_ruangan}</td>
                  <td>
                    <Button
                      variant="primary"
                      style={{ marginRight: "7px", width: "5vw" }}
                      onClick={() => handleEditClick(ruangan)}
                    >
                      <FaEdit />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      style={{ marginRight: "7px", width: "5vw" }}
                      onClick={() => handleDeleteClick(ruangan.id_ruangan)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Tidak ada data ruangan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Ubah Data Ruangan" : "Tambah Data Ruangan"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNoRuangan">
              <Form.Label>Nomor Ruangan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Nomor Ruangan (101 - 110)"
                name="no_ruangan"
                value={formValues.no_ruangan}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Simpan Data Ruangan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CRUDRuangan;
