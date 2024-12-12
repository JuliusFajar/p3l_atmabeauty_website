import React, { useEffect, useState } from "react";
import {
  GetAllProduk,
  UpdateProduk,
  DeleteProduk,
  CreateProduk,
  GetProdukByNama,
} from "../api/apiProduk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";


const CRUDProduk = () => {
  const [produks, setProduks] = useState([]);
  const [filteredProduks, setFilteredProduks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [formValues, setFormValues] = useState({
    nama_produk: "",
    keterangan_produk: "",
    stock_produk: "",
    harga_produk: "",
    gambar_produk: null,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

    
  useEffect(() => {
    const fetchProduks = async () => {
        try {
            const data = await GetAllProduk();
            setProduks(data);
            setFilteredProduks(data);
        } catch (error) {
            toast.error(error.message || "Gagal Mendapatkan Data Produk");
        } finally {
            setLoading(false);
        }
        };
      
    fetchProduks();
  }, []);

    
    
    const handleSearch = async (query) => {
      setSearchQuery(query);
      if (query) {
        try {
          const searchResults = await GetProdukByNama(query);
          setFilteredProduks(searchResults);
        } catch (error) {
          toast.error(error.message || "Gagal Mencari Data produk");
          setFilteredProduks([]);
        }
      } else {
        setFilteredProduks(produks);
      }
    };
    

    // const handleDeleteClick = async (id) => {
    //   const confirmed = window.confirm(
    //     "Apakah Anda yakin ingin menghapus produk ini?"
    //   );
    //   if (!confirmed) return;

    //     const updatedProduks = produks.filter(
    //         (item) => item.id_produk !== id
    //     );
    //   setProduks(updatedProduks);
    //   setFilteredProduks(updatedProduks);

    //   try {
    //     await DeleteProduk(id);
    //     toast.success("Data Produk Berhasil Dihapus!");
    //   } catch (error) {
    //     setProduks(produks);
    //     setFilteredProduks(produks);
    //     toast.error(error.message || "Gagal Menghapus Data Produk");
    //   }
    // };

  const handleDeleteClick = async (id) => {
    const confirmDeleteToast = toast(
      <div>
        <p>Apakah Anda yakin ingin menghapus data produk ini?</p>
        <div>
          <button
            onClick={async () => {
              try {
                const updatedProduks = produks.filter(
                  (p) => p.id_produk !== id
                );
                setProduks(updatedProduks);
                setFilteredProduks(updatedProduks);
                await DeleteProduk(id);
                toast.dismiss(confirmDeleteToast);
                toast.success("Data Produk Berhasil Dihapus!");
              } catch (error) {
                setProduks(produks);
                setFilteredProduks(produks);
                toast.error(error.message || "Gagal Menghapus Data Produk");
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


    const handleEditClick = (produk) => {
    setSelectedProduk(produk);
    setFormValues({
        nama_produk: produk.nama_produk,
        keterangan_produk: produk.keterangan_produk,
        stock_produk: produk.stock_produk,
        harga_produk: produk.harga_produk,
        gambar_produk: produk.gambar_produk,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

    
    
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduk(null);
    setIsEditMode(false);
    setFormValues({
      nama_produk: "",
      harga_produk: "",
      gambar_produk: "",
      stock_produk: "",
      keterangan_produk: null,
    });
  };

    
    
  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value
      }));
  };

    
    
  const handleFileChange = (e) => {
    setFormValues({ ...formValues, gambar_produk: e.target.files[0] });
  };

    

    const handleSaveChanges = async () => {
      const {
        nama_produk,
        harga_produk,
        stock_produk,
        keterangan_produk,
        gambar_produk,
      } = formValues;

      if (
        !nama_produk &&
        !harga_produk &&
        !stock_produk &&
        !keterangan_produk
      ) {
        toast.error("Semua field harus diisi!");
        return;
      }


      if (!nama_produk) {
        toast.error("Nama Produk tidak boleh kosong!");
        return;
      }
      if (!keterangan_produk) {
        toast.error("Keterangan Produk tidak boleh kosong!");
        return;
      }
      if (!stock_produk) {
        toast.error("Stock Produk tidak boleh kosong!");
        return;
      }
      if (!harga_produk) {
        toast.error("Harga Produk tidak boleh kosong!");
        return;
      }

      if (isNaN(harga_produk) || harga_produk <= 0) {
        toast.error("Harga Produk harus berupa angka dan lebih dari 0!");
        return;
      }
      if (isNaN(stock_produk) || stock_produk <= 0) {
        toast.error("Stock Produk harus berupa angka dan lebih dari 0!");
        return;
      }

      if (!isEditMode) {
        
        if (!gambar_produk) {
          toast.error("Gambar Produk Harus Dipilih!");
          return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (gambar_produk.size > maxSize) {
          toast.error("Ukuran Gambar Terlalu Besar! Maksimal 2MB.");
          return;
        }
      }
        
      
      try {
        if (isEditMode) {
          const updateData = { ...selectedProduk, ...formValues };

          if (
            !formValues.gambar_produk ||
            typeof formValues.gambar_produk === "string"
          ) {
            delete updateData.gambar_produk;
          }

          await UpdateProduk(updateData);
          toast.success("Data Produk Berhasil Diperbaharui!");

            setFilteredProduks(
              filteredProduks.map((produk) =>
                produk.id_produk === selectedProduk.id_produk
                  ? { ...produk, ...updateData }
                  : produk
              )
          );
        } else {
          const newProduk = await CreateProduk(formValues);
            toast.success("Data Produk Berhasil Dibuat!");
            setFilteredProduks([...filteredProduks, newProduk]);
          setTimeout(() => {
            window.location.reload();
          }, 1000);        
        }
        handleCloseModal();
      } catch (error) {
        toast.error(error.message || "Gagal Menyimpan Data Produk");
      }
    };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="mt-5">Pengelolaan Data Produk</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Cari Data Produk..."
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
          Tambah Data Produk
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Produk</th>
              <th>Keterangan Produk</th>
              <th>Stok Produk</th>
              <th>Harga Produk</th>
              <th>Gambar Produk</th>

              <th>Ubah</th>
              <th>Hapus</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduks.length > 0 ? (
              filteredProduks.map((produk, index) => (
                <tr key={produk.id_produk}>
                  <td>{index + 1}</td>
                  <td>{produk.nama_produk}</td>
                  <td>{produk.keterangan_produk}</td>
                  <td>{produk.stock_produk}</td>
                  <td>Rp {produk.harga_produk}</td>
                  <td>
                    <img
                      src={`http://127.0.0.1:8000/images/produk/${produk.gambar_produk}`}
                      alt={produk.nama_produk}
                      width={50}
                    />
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditClick(produk)}
                    >
                      <FaEdit />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(produk.id_produk)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Tidak ada data produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Ubah Data Produk" : "Tambah Data Produk"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama Produk</Form.Label>
              <Form.Control
                type="text"
                name="nama_produk"
                placeholder="Masukkan Nama Produk"
                value={formValues.nama_produk}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Keterangan Produk</Form.Label>
              <Form.Control
                as="textarea"
                name="keterangan_produk"
                placeholder="Masukkan Keterangan Produk"
                value={formValues.keterangan_produk}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Stok Produk</Form.Label>
              <Form.Control
                type="number"
                name="stock_produk"
                placeholder="Masukkan Stok Produk"
                value={formValues.stock_produk}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Harga Produk</Form.Label>
              <Form.Control
                type="number"
                name="harga_produk"
                placeholder="Masukkan Harga Produk"
                value={formValues.harga_produk}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Gambar Produk</Form.Label>
              <div>
                {formValues.gambar_produk && (
                  <img
                    src={`http://127.0.0.1:8000/images/produk/${formValues.gambar_produk}`}
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
                  name="gambar_produk"
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
            {isEditMode ? "Simpan Perubahan" : "Tambah Data Produk"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CRUDProduk;
