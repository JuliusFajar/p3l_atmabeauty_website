import React, { useEffect, useState } from "react";
import { GetAllJadwal, UpdateJadwal, DeleteJadwal, AddJadwal } from "../api/apiJadwal";
import { toast } from "react-toastify";
import { Button, Modal, Form } from "react-bootstrap";

const validDays = ["Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const ShowJadwal = () => {
  const [jadwal, setJadwal] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [formValues, setFormValues] = useState({
    hari: "",
  });
  const [newJadwal, setNewJadwal] = useState({
    hari: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const data = await GetAllJadwal();
        setJadwal(data);
      } catch (error) {
        toast.error(error.message || "Failed to load jadwal");
      }
    };

    fetchJadwal();
  }, []);

  const handleEditClick = (jadwal) => {
    setSelectedJadwal(jadwal);
    setFormValues({
      hari: jadwal.hari,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJadwal(null);
    setError(""); // Clear any errors when closing the modal
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewJadwal({
      hari: "",
    });
    setError(""); // Clear any errors when closing the modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // Validate input
    if (!validDays.includes(value)) {
      setError("Hari harus antara Selasa sampai Minggu");
    } else {
      setError("");
    }
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewJadwal({ ...newJadwal, [name]: value });
    // Validate input
    if (!validDays.includes(value)) {
      setError("Hari harus antara Selasa sampai Minggu");
    } else {
      setError("");
    }
  };

  const handleSaveChanges = async () => {
    if (error) return; // Prevent saving if there's an error
    try {
      const updatedJadwal = {
        ...selectedJadwal,
        hari: formValues.hari,
      };
      await UpdateJadwal(updatedJadwal);
      toast.success("Jadwal updated successfully!");
      handleCloseModal();
      await fetchJadwal(); // Refresh the jadwal list after saving changes
    } catch (error) {
      toast.error(error.message || "Failed to update jadwal");
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this jadwal?")) {
      try {
        await DeleteJadwal(id);
        toast.success("Jadwal deleted successfully!");
        await fetchJadwal(); // Refresh the jadwal list after deletion
      } catch (error) {
        toast.error(error.message || "Failed to delete jadwal");
      }
    }
  };

  const handleAddJadwal = async () => {
    if (error) return; // Prevent adding if there's an error
    try {
      await AddJadwal(newJadwal);
      toast.success("Jadwal added successfully!");
      handleCloseAddModal();
      await fetchJadwal(); // Refresh the list of jadwal
    } catch (error) {
      toast.error(error.message || "Failed to add jadwal");
    }
  };

  const fetchJadwal = async () => {
    try {
      const data = await GetAllJadwal();
      setJadwal(data);
    } catch (error) {
      toast.error(error.message || "Failed to load jadwal");
    }
  };

  return (
    <div >
      <h1 className="mt-5">Show Jadwal</h1>
      <Button
        variant="success"
        style={{ marginBottom: "10px" }}
        onClick={() => setShowAddModal(true)}
      >
        Add New Jadwal
      </Button>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Hari</th>
              <th scope="col">Edit</th>
              <th scope="col">Hapus</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.map((j, index) => (
              <tr key={j.id}>
                <td>{index + 1}</td>
                <td>{j.hari}</td>
                <td>
                  <Button
                    variant="primary"
                    style={{ marginRight: "7px", width: "5vw" }}
                    onClick={() => handleEditClick(j)}
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    style={{ marginRight: "7px", width: "5.5vw" }}
                    onClick={() => handleDeleteClick(j.id_jadwal)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Edit Jadwal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Jadwal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="hari">
              <Form.Label>Hari</Form.Label>
              <Form.Control
                type="text"
                name="hari"
                value={formValues.hari}
                onChange={handleInputChange}
              />
              {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} disabled={!!error}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Add New Jadwal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Jadwal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newHari">
              <Form.Label>Hari</Form.Label>
              <Form.Control
                type="text"
                name="hari"
                value={newJadwal.hari}
                onChange={handleNewInputChange}
              />
              {error && <p style={{ color: "red" }}>{error}</p>} {/* Error message */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddJadwal} disabled={!!error}>
            Add Jadwal
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShowJadwal;
