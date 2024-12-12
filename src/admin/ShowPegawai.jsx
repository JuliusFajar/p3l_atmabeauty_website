import React, {useEffect, useState} from "react";
import {GetAllPegawai, UpdatePegawai, DeletePegawai} from "../api/apiPegawai";
import {toast} from "react-toastify";
import {Button, Modal, Form} from "react-bootstrap";

const ShowPegawai = () => {
    const [pegawai, setPegawai] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPegawai, setSelectedPegawai] = useState(null);
    const [formValues, setFormValues] = useState({
        jabatan_pegawai: "",
        nama_pegawai: "",
        alamat_pegawai: "",
        nomor_telepon: "",
        status_pegawai: "",
        username: "",
        password: "",
    });

    useEffect(() => {
        const fetchPegawai = async () => {
            try {
                const data = await GetAllPegawai();
                setPegawai(data);
            } catch (error) {
                toast.error(error.message || "Failed to load pegawai");
            }
        };

        fetchPegawai();
    }, []);

    const handleEditClick = (pegawai) => {
        setSelectedPegawai(pegawai);
        setFormValues({
            jabatan_pegawai: pegawai.jabatan_pegawai,
            nama_pegawai: pegawai.nama_pegawai,
            alamat_pegawai: pegawai.alamat_pegawai,
            nomor_telepon: pegawai.nomor_telepon,
            status_pegawai: pegawai.status_pegawai,
            username: pegawai.username,
            password: pegawai.password,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPegawai(null);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    };

    const handleSaveChanges = async () => {
        try {
            const updatedPegawai = {
                ...selectedPegawai,
                jabatan_pegawai: formValues.jabatan_pegawai,
                nama_pegawai: formValues.nama_pegawai,
                alamat_pegawai: formValues.alamat_pegawai,
                nomor_telepon: formValues.nomor_telepon,
                status_pegawai: formValues.status_pegawai,
                username: formValues.username,
                password: formValues.password,
            };
            await UpdatePegawai(updatedPegawai);
            toast.success("Pegawai updated successfully!");
            handleCloseModal();

            window.location.reload();

            // Refresh pegawai data after saving changes
            setPegawai((prevPegawai) =>
                prevPegawai.map((pegawai) =>
                    pegawai.id_pegawai === updatedPegawai.id_pegawai ? updatedPegawai : pegawai
                )
            );

        } catch (error) {
            toast.error(error.message || "Failed to update pegawai");
        }
    };

    const handleDeleteClick = async (id) => {
        console.log(id);
        if (window.confirm("Are you sure you want to delete this pegawai?")) {
            try {
                await DeletePegawai(id);
                setPegawai((prevPegawai) => prevPegawai.filter((pegawai) => pegawai.id_pegawai !== id));
                
                toast.success("Pegawai deleted successfully!");
            } catch (error) {
                toast.error(error.message || "Failed to delete pegawai");
            }
        }
    };

    return (
        <div>
            <h1>Show Pegawai</h1>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">ID Pegawai</th>
                            <th scope="col">Jabatan Pegawai</th>
                            <th scope="col">Nama Pegawai</th>
                            <th scope="col">Alamat Pegawai</th>
                            <th scope="col">Nomor Telepon</th>
                            <th scope="col">Status Pegawai</th>
                            <th scope="col">Username</th>
                            <th scope="col">Password</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Hapus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pegawai.map((pegawai, index) => (
                            <tr key={pegawai.id}>
                                <td>{pegawai.id_pegawai}</td>
                                <td>{pegawai.jabatan_pegawai}</td>
                                <td>{pegawai.nama_pegawai}</td>
                                <td>{pegawai.alamat_pegawai}</td>
                                <td>{pegawai.nomor_telepon}</td>
                                <td>{pegawai.status_pegawai}</td>
                                <td>{pegawai.username}</td>
                                <td>{pegawai.password}</td>
                                <td>
                                    <Button
                                        className="btn btn-primary"
                                        onClick={() => handleEditClick(pegawai)}
                                    >
                                        Edit
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteClick(pegawai.id_pegawai)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for editing pegawai */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Pegawai</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formJabatanPegawai">
                            <Form.Label>Jabatan Pegawai</Form.Label>
                            <Form.Control
                                type="text"
                                name="jabatan_pegawai"
                                value={formValues.jabatan_pegawai}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNamaPegawai">
                            <Form.Label>Nama Pegawai</Form.Label>
                            <Form.Control
                                type="text"
                                name="nama_pegawai"
                                value={formValues.nama_pegawai}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAlamatPegawai">
                            <Form.Label>Alamat Pegawai</Form.Label>
                            <Form.Control
                                type="text"
                                name="alamat_pegawai"
                                value={formValues.alamat_pegawai}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNomorTelepon">
                            <Form.Label>Nomor Telepon</Form.Label>
                            <Form.Control
                                type="text"
                                name="nomor_telepon"
                                value={formValues.nomor_telepon}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatusPegawai">
                            <Form.Label>Status Pegawai</Form.Label>
                            <Form.Control
                                type="text"
                                name="status_pegawai"
                                value={formValues.status_pegawai}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formValues.username}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formValues.password}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
                
        </div>
    );


};

export default ShowPegawai;