import React, { useEffect, useState } from "react";
import {
  GetAllPromo,
  UpdatePromo,
  DeletePromo,
  CreatePromo,
} from "../api/apiPromo";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const CRUDPromo = () => {
  const [promos, setPromos] = useState([]);
  const [filteredPromos, setFilteredPromos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [formValues, setFormValues] = useState({
    kode_promo: "",
    jenis_promo: "",
    keterangan: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const data = await GetAllPromo();
        setPromos(data);
        setFilteredPromos(data);
      } catch (error) {
        toast.error(error.message || "Gagal Memuat Data Promo");
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const handleDeleteClick = async (id) => {

    const confirmDeleteToast = toast(
      <div>
        <p>Apakah Anda yakin ingin menghapus data promo ini?</p>
        <div>
          <button
            onClick={async () => {
              try {
                const updatedPromos = promos.filter(
                  (p) => p.id_promo !== id
                );
                setPromos(updatedPromos);
                setFilteredPromos(updatedPromos);
                await DeletePromo(id);
                toast.dismiss(confirmDeleteToast);
                toast.success("Data Promo Berhasil Dihapus!");
              } catch (error) {
                setPromos(promos);
                setFilteredPromos(promos);
                toast.error(error.message || "Gagal Menghapus Data Promo");
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


  const handleEditClick = (promo) => {
    setSelectedPromo(promo);
    setFormValues({
      kode_promo: promo.kode_promo,
      jenis_promo: promo.jenis_promo,
      keterangan: promo.keterangan,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPromo(null);
    setIsEditMode(false);
    setFormValues({
      kode_promo: "",
      jenis_promo: "",
      keterangan: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSaveChanges = async () => {
    const {
      kode_promo,
      jenis_promo,
      keterangan,
    } = formValues;

    if (
      !kode_promo &&
      !jenis_promo &&
      !keterangan
    ) {
      toast.error("Semua field Wajib diisi!");
      return;
    }

    if (!kode_promo.trim()) {
      toast.error("Kode Promo Tidak Boleh Kosong!");
      return;
    }

    if (!jenis_promo.trim()) {
      toast.error("Jenis Promo Tidak Boleh Kosong!");
      return;
    }

    if (!keterangan.trim()) {
      toast.error("Keterangan Tidak Boleh Kosong!");
      return;
    }


    try {
      if (isEditMode) {
        const updatedPromo = {
          ...selectedPromo,
          ...formValues,
        };
        await UpdatePromo(updatedPromo);
        handleCloseModal();
        toast.success("Promo berhasil diubah!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setPromos((prevPromos) =>
          prevPromos.map((promo) =>
            promo.id === updatedPromo.id_promo
              ? updatedPromo
              : promo
          )
        );

        setFilteredPromos((prevFiltered) =>
          prevFiltered.map((promo) =>
            promo.id_promo === updatedPromo.id_promo
              ? updatedPromo
              : promo
          )
        );
      } else {
        const newPromo = await CreatePromo(formValues);
        toast.success("Data Promo berhasil ditambahkan!");
        setPromos((prevPromos) => [...prevPromos, newPromo]);
        setFilteredPromos((prevFiltered) => [...prevFiltered, newPromo]);
        handleCloseModal();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error(error.message || "Gagal Menyimpan Data Promo");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="mt-5">Pengelolaan Data Promo</h1>

      <Button
        variant="success"
        onClick={() => {
          setShowModal(true);
          setIsEditMode(false);
        }}
        className="mb-3"
      >
        Tambah Data Promo
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Kode Promo</th>
              <th>Jenis Promo</th>
              <th>Keterangan</th>
              <th>Ubah</th>
              <th>Hapus</th>
            </tr>
          </thead>

          <tbody>
            {promos.map((promo, index) => (
              <tr key={promo.id}>
                <td>{index + 1}</td>
                <td>{promo.kode_promo}</td>
                <td>{promo.jenis_promo}</td>
                <td>{promo.keterangan}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(promo)}
                  >
                    <FaEdit />
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(promo.id_promo)}
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Form */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Edit Data Promo" : "Tambah Data Promo"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="kodePromo">
              <Form.Label>Kode Promo</Form.Label>
              <Form.Control
                type="text"
                name="kode_promo"
                placeholder="Masukkan Kode Promo"
                value={formValues.kode_promo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="jenisPromo" className="mt-3">
              <Form.Label>Jenis Promo</Form.Label>
              <Form.Control
                type="text"
                name="jenis_promo"
                placeholder="Masukkan Jenis Promo"
                value={formValues.jenis_promo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="keterangan" className="mt-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="keterangan"
                placeholder="Masukkan Keterangan Promo"
                value={formValues.keterangan}
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
            {isEditMode ? "Simpan Perubahan" : "Buat Data Promo"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CRUDPromo;
