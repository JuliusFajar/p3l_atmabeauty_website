import React, { useEffect, useState } from "react";
import {
  GetAllCustomer,
  UpdateCustomer,
  DeleteCustomer,
  AddCustomer,
} from "../api/apiDaftarCustomer";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "react-bootstrap";

const ShowCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formValues, setFormValues] = useState({
    nama_customer: "",
    username: "",
    tanggal_lahir: "",
    jenis_kelamin: "P", // Default to Perempuan
    alamat_customer: "",
    nomor_telepon: "",
    email_customer: "",
    alergi_obat: "",
    poin_customer: "",
    tanggal_registrasi: "",
    password: "",
    profile_customer: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCustomers = async () => {
    try {
      const data = await GetAllCustomer();
      setCustomers(data);
    } catch (error) {
      toast.error(error.message || "Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setFormValues({
      nama_customer: customer.nama_customer,
      username: customer.username,
      tanggal_lahir: customer.tanggal_lahir,
      jenis_kelamin: customer.jenis_kelamin,
      alamat_customer: customer.alamat_customer,
      nomor_telepon: customer.nomor_telepon,
      email_customer: customer.email_customer,
      alergi_obat: customer.alergi_obat,
      poin_customer: customer.poin_customer,
      tanggal_registrasi: customer.tanggal_registrasi,
      password: customer.password,
      profile_customer: customer.profile_customer,
    });
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await DeleteCustomer(id);
        toast.success("Customer deleted successfully!");
        fetchCustomers();
      } catch (error) {
        toast.error(error.message || "Failed to delete customer");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        const updatedCustomer = { ...selectedCustomer, ...formValues };
        await UpdateCustomer(updatedCustomer);
        toast.success("Customer updated successfully!"); // Toast for successful update
      } else {
        await AddCustomer(formValues);
        toast.success("Customer added successfully!"); // Toast for successful addition
      }
      fetchCustomers();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save customer");
    }
  };

  const resetForm = () => {
    setFormValues({
      nama_customer: "",
      username: "",
      tanggal_lahir: "",
      jenis_kelamin: "P", // Default to Perempuan
      alamat_customer: "",
      nomor_telepon: "",
      email_customer: "",
      alergi_obat: "",
      poin_customer: "",
      tanggal_registrasi: "",
      password: "",
      profile_customer: "",
    });
    setSelectedCustomer(null);
    setShowForm(false);
  };

  const handlePrintCard = (customer) => {
    const registrationDate = new Date(customer.tanggal_registrasi);
    const monthYear = `${("0" + (registrationDate.getMonth() + 1)).slice(
      -2
    )}/${registrationDate.getFullYear().toString().slice(-2)}`;

    const cardWindow = window.open(
      "",
      "Print Customer Card",
      "width=300,height=250"
    );
    cardWindow.document.write(`
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
              text-align: left; /* Align Card Holder Since to the left */
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
              text-align: left; /* Align date to the left */
            }
            .name {
              font-size: 16px;
              margin-top: 10px;
              text-align: left; /* Align name to the left */
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">Natural Beauty Center</div>
            <div class="address">Jl. Babarsari No. 43 Yogyakarta 55281 <br> Telp. (0274) 487711</div>
            <div class="number">${customer.nomor_customer}</div>
            <div class="small-text">Card Holder Since:</div>
            <div class="date">${monthYear}</div>
            <div class="name">${customer.nama_customer}</div>
            <div class="card-footer">Your NBC Card has no expiration date</div>
          </div>
        </body>
      </html>
    `);
    cardWindow.document.close();
    cardWindow.print();
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.nama_customer && // Check if nama is defined
      customer.nama_customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container mt-5"
      style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}
    >
      <h1>Daftar Pelanggan</h1>

      {/* Search and Add New Customer Button (Sejajar) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search Input */}
        <div className="form-group mb-0">
          <label> </label>
          <div className="form-group mb-3">
            <label>Search Customer</label>
            <input
              type="text"
              className="form-control"
              placeholder="Cari Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "300px" }}
            />
          </div>

          {/* Button to Add New Customer */}
          <Button className="btn btn-success" onClick={() => setShowForm(true)}>
            Tambah Pelanggan
          </Button>
        </div>

        {/* Customer Form in Modal */}
        <Modal show={showForm} onHide={resetForm}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCustomer ? "Edit Customer" : "Tambah Pelanggan Baru"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {/* Nama Customer */}
              <div className="form-group">
                <label>Nama Customer</label>
                <input
                  type="text"
                  name="nama_customer"
                  value={formValues.nama_customer}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Username */}
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="form-group">
                <label>Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formValues.tanggal_lahir}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="form-group">
                <label>Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={formValues.jenis_kelamin}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="P">P (Perempuan)</option>
                  <option value="L">L (Laki-Laki)</option>
                </select>
              </div>

              {/* Alamat Lengkap */}
              <div className="form-group">
                <label>Alamat Lengkap</label>
                <input
                  type="text"
                  name="alamat_customer"
                  value={formValues.alamat_customer}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Nomor Telepon */}
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input
                  type="tel"
                  name="nomor_telepon"
                  value={formValues.nomor_telepon}
                  onChange={handleChange}
                  className="form-control"
                  required
                  placeholder="Masukkan Nomor Telepon"
                  pattern="[0-9]{10,15}"
                  title="Nomor telepon harus berupa angka dan terdiri dari 10-15 digit"
                />
              </div>

              {/* Email Customer */}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email_customer"
                  value={formValues.email_customer}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Alergi Obat */}
              <div className="form-group">
                <label>Alergi Obat</label>
                <input
                  type="text"
                  name="alergi_obat"
                  value={formValues.alergi_obat}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Poin Customer */}
              <div className="form-group">
                <label>Poin Customer</label>
                <input
                  type="number"
                  name="poin_customer"
                  value={formValues.poin_customer}
                  onChange={handleChange}
                  className="form-control"
                  required
                  min="0"
                />
              </div>
              {/* Submit Button */}
              <Button className="mt-3" variant="primary" type="submit">
                {selectedCustomer ? "Update" : "Simpan"}
              </Button>
              <Button
                className="mt-3 ms-2"
                variant="secondary"
                onClick={resetForm}
              >
                Kembali
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Customer List */}
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Nama Customer</th>
              <th>Username</th>
              <th>Nomor Telepon</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id_customer}>
                  <td>{customer.nama_customer}</td>
                  <td>{customer.username}</td>
                  <td>{customer.nomor_telepon}</td>
                  <td>{customer.email_customer}</td>
                  <td>
                    <Button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(customer)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(customer.id_customer)}
                    >
                      Hapus
                    </Button>
                    <Button
                      className="btn btn-info btn-sm"
                      onClick={() => handlePrintCard(customer)}
                    >
                      Cetak Kartu
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Pelanggan tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowCustomer;
