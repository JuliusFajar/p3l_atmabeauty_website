import React, { useEffect, useState } from "react"; 
import {
  GetAllPegawai,
  UpdatePegawai,
  DeletePegawai,
  CreatePegawai,
  GetPegawaiByNama,
} from "../api/apiPegawai";
import { GetAllRuangan } from "../api/apiRuangan";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash, FaEdit, FaTrashAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const CRUDPegawai = () => {
  const [pegawais, setPegawais] = useState([]);
  const [ruangans, setRuangans] = useState([]);
  const [filteredPegawais, setFilteredPegawais] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [formValues, setFormValues] = useState({
    id_ruangan: "",
    jabatan_pegawai: "",
    nama_pegawai: "",
    alamat_pegawai: "",
    nomor_telepon: "",
    status_pegawai: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPasswords, setShowPasswords] = useState({});
  
  useEffect(() => {
    const fetchPegawais = async () => {
      try {
        const data = await GetAllPegawai();
        setPegawais(data);
        setFilteredPegawais(data);
      } catch (error) {
        toast.error(error.message || "Gagal memuat pegawai");
      } finally {
        setLoading(false);
      }
    };

    const fetchRuangans = async () => {
      try {
        const dataRuangan = await GetAllRuangan();
        setRuangans(dataRuangan);
      } catch (error) {
        toast.error(error.message || "Gagal memuat ruangan");
      }
    };

    fetchPegawais();
    fetchRuangans();
  }, []);

  const handleEditClick = (pegawai) => {
    setSelectedPegawai(pegawai);
    setFormValues({
      id_ruangan: pegawai.id_ruangan || "",
      jabatan_pegawai: pegawai.jabatan_pegawai,
      nama_pegawai: pegawai.nama_pegawai,
      alamat_pegawai: pegawai.alamat_pegawai,
      nomor_telepon: pegawai.nomor_telepon,
      status_pegawai: pegawai.status_pegawai,
      username: pegawai.username,
      password: pegawai.password,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPegawai(null);
    setIsEditMode(false);
    setFormValues({
      id_ruangan: "",
      jabatan_pegawai: "",
      nama_pegawai: "",
      alamat_pegawai: "",
      nomor_telepon: "",
      status_pegawai: "",
      username: "",
      password: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSaveChanges = async () => {
    const {
      jabatan_pegawai,
      nama_pegawai,
      alamat_pegawai,
      nomor_telepon,
      status_pegawai,
      username,
      password,
      id_ruangan,
    } = formValues;

    if (
      !jabatan_pegawai &&
      !nama_pegawai &&
      !alamat_pegawai &&
      !nomor_telepon &&
      !username &&
      !password &&
      !status_pegawai &&
      !id_ruangan
    ) {
      toast.error("Semua field wajib diisi !");
      return;
    }

    
    if (["Beautician", "Dokter"].includes(jabatan_pegawai)) {
      if (!status_pegawai) {
        toast.error(
          "Status pegawai wajib diisi untuk jabatan Beautician atau Dokter !"
        );
        return;
      }
      if (!id_ruangan) {
        toast.error(
          "ID ruangan wajib diisi untuk jabatan Beautician atau Dokter !"
        );
        return;
      }
    }

    if (!nama_pegawai.trim()) {
      toast.error("Nama pegawai wajib diisi !");
      return;
    }

    const alamatRegex = /^Jl\..*/; 
    if (!alamat_pegawai || !alamatRegex.test(alamat_pegawai.trim())) {
      toast.error("Alamat pegawai harus dimulai dengan 'Jl' atau 'Jl !'");
      return;
    }

    const phoneRegex = /^08\d{8,11}$/;
    if (!phoneRegex.test(nomor_telepon)) {
      toast.error(
        "Nomor telepon tidak valid. Pastikan nomor telepon dimulai dengan '08' dan memiliki 10-13 digit !"
      );
      return;
    }

    if (username.length < 5) {
      toast.error("Username harus memiliki minimal 5 karakter !");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password harus memiliki minimal 8 karakter dan mengandung kombinasi huruf dan angka !"
      );
      return;
    }

    try {
      if (isEditMode) {
        const updatedPegawai = {
          ...selectedPegawai,
          ...formValues,
        };
        await UpdatePegawai(updatedPegawai);
        handleCloseModal();
        toast.success("Pegawai berhasil diperbarui!");
        setPegawais((prevPegawais) =>
          prevPegawais.map((pegawai) =>
            pegawai.id_pegawai === updatedPegawai.id_pegawai
              ? updatedPegawai
              : pegawai
          )
        );
        setFilteredPegawais((prevFiltered) =>
          prevFiltered.map((pegawai) =>
            pegawai.id_pegawai === updatedPegawai.id_pegawai
              ? updatedPegawai
              : pegawai
          )
        );
      } else {
        const newPegawai = await CreatePegawai(formValues);
        toast.success("Data Pegawai berhasil ditambahkan!");
        setPegawais((prevPegawais) => [...prevPegawais, newPegawai]);
        setFilteredPegawais((prevFiltered) => [...prevFiltered, newPegawai]);

        handleCloseModal();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan pegawai");
    }
  };


  // const handleDeleteClick = async (id) => {
  //   const isConfirmed = window.confirm(
  //     "Apakah Anda yakin ingin menghapus pegawai ini?"
  //   );
  //   if (!isConfirmed) return;

  //   const updatedPegawais = pegawais.filter((p) => p.id_pegawai !== id);
  //   setPegawais(updatedPegawais);
  //   setFilteredPegawais(updatedPegawais);

  //   try {
  //     await DeletePegawai(id);
  //     toast.success("Pegawai berhasil dihapus!");
  //   } catch (error) {
  //     setPegawais(pegawais);
  //     setFilteredPegawais(pegawais);
  //     toast.error(error.message || "Gagal menghapus pegawai");
  //   }
  // };

  const handleDeleteClick = async (id) => {

    const confirmDeleteToast = toast(
      <div>
        <p>Apakah Anda yakin ingin data menghapus pegawai ini?</p>
        <div>
          <button
            onClick={async () => {
              try {
                const updatedPegawais = pegawais.filter(
                  (p) => p.id_pegawai !== id
                );
                setPegawais(updatedPegawais);
                setFilteredPegawais(updatedPegawais);
                await DeletePegawai(id);
                toast.dismiss(confirmDeleteToast);
                toast.success("Data Pegawai Berhasil Dihapus!");
              } catch (error) {
                setPegawais(pegawais);
                setFilteredPegawais(pegawais);
                toast.error(error.message || "Gagal Menghapus  Data Pegawai");
              }
            }}
            className="btn btn-primary"
            style={{ margin: "5px 10px" }}
            > Ya
          </button>
          <button
            onClick={() => toast.dismiss(confirmDeleteToast)}
            className="btn btn-danger"
            style={{ margin: "5px 10px" }}
            > Batal
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

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query) {
      try {
        const results = await GetPegawaiByNama(query);
        setFilteredPegawais(results);
      } catch (error) {
        toast.error(error.message || "Gagal mencari pegawai");
        setFilteredPegawais([]);
      }
    } else {
      setFilteredPegawais(pegawais);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="mt-5">Pengelolaan Data Pegawai</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Cari Data Pegawai..."
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
          Tambah Data Pegawai
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Jabatan Pegawai</th>
              <th>Nama Pegawai</th>
              <th>Alamat Pegawai</th>
              <th>Nomor Telepon</th>
              <th>Status Pegawai</th>
              <th>Username</th>
              <th>Password</th>
              <th>Ubah</th>
              <th>Hapus</th>
            </tr>
          </thead>

          <tbody>
            {filteredPegawais.length > 0 ? (
              filteredPegawais.map((pegawai, index) => (
                <tr key={pegawai.id_pegawai}>
                  <td>{index + 1}</td>
                  <td>{pegawai.jabatan_pegawai}</td>
                  <td>{pegawai.nama_pegawai}</td>
                  <td>{pegawai.alamat_pegawai}</td>
                  <td>{pegawai.nomor_telepon}</td>
                  <td>{pegawai.status_pegawai}</td>
                  <td>{pegawai.username}</td>
                  <td>
                    <span>
                      {showPasswords[pegawai.id_pegawai]
                        ? pegawai.password
                        : "●●●●●●●●"}
                    </span>
                    <Button
                      variant="link"
                      onClick={() =>
                        togglePasswordVisibility(pegawai.id_pegawai)
                      }
                      style={{ paddingLeft: "8px" }}
                    >
                      {showPasswords[pegawai.id_pegawai] ? (
                        <FaEye />
                      ) : (
                        <FaEyeSlash />
                      )}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditClick(pegawai)}
                    >
                      <FaEdit />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(pegawai.id_pegawai)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  Tidak ada data pegawai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Ubah Data Pegawai" : "Tambah Data Pegawai"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Jabatan Pegawai</Form.Label>
              <Form.Control
                as="select"
                name="jabatan_pegawai"
                value={formValues.jabatan_pegawai}
                onChange={handleInputChange}
              >
                <option value="">Pilih Jabatan</option>
                <option value="Kepala Klinik">Kepala Klinik</option>
                <option value="Beautician">Beautician</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Dokter">Dokter</option>
                <option value="Kasir">Kasir</option>
                <option value="Admin">Admin</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Nama Pegawai</Form.Label>
              <Form.Control
                type="text"
                name="nama_pegawai"
                placeholder="Masukkan Nama Pegawai"
                value={formValues.nama_pegawai}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Alamat Pegawai</Form.Label>
              <Form.Control
                type="text"
                name="alamat_pegawai"
                placeholder="Masukkan Alamat Pegawai"
                value={formValues.alamat_pegawai}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Nomor Telepon</Form.Label>
              <Form.Control
                type="text"
                name="nomor_telepon"
                placeholder="Masukkan Nomor Telepon"
                value={formValues.nomor_telepon}
                onChange={handleInputChange}
              />
            </Form.Group>

            {["Beautician", "Dokter"].includes(formValues.jabatan_pegawai) && (
              <>
                <Form.Group>
                  <Form.Label>Status Pegawai</Form.Label>
                  <Form.Control
                    type="text"
                    name="status_pegawai"
                    placeholder="Masukkan Status Pegawai"
                    value={formValues.status_pegawai}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Ruangan</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_ruangan"
                    placeholder="Pilih Ruangan"
                    value={formValues.id_ruangan}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih Ruangan</option>
                    {ruangans.map((ruangan) => (
                      <option
                        key={ruangan.id_ruangan}
                        value={ruangan.id_ruangan}
                      >
                        {ruangan.nama_ruangan}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </>
            )}

            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Masukkan Username"
                value={formValues.username}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type={
                    showPasswords[formValues.username] ? "text" : "password"
                  }
                  name="password"
                  placeholder="Masukkan Password"
                  value={formValues.password}
                  onChange={handleInputChange}
                />
                <Button
                  variant="link"
                  onClick={() => togglePasswordVisibility(formValues.username)}
                  style={{ paddingLeft: "8px" }}
                >
                  {showPasswords[formValues.username] ? (
                    <FaEye />
                  ) : (
                    <FaEyeSlash />
                  )}
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            {isEditMode ? "Simpan Perubahan" : "Tambah Pegawai"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};



export default CRUDPegawai;

