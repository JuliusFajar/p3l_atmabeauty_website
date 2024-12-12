import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CreatePegawai } from "../api/apiPegawai";
import { toast } from "react-toastify";

const EntriPegawaiPage = () => {
  //   const navigate = useNavigate();
  const [data, setData] = useState({
    id_ruangan: null,
    jabatan_pegawai: "",
    nama_pegawai: "",
    alamat_pegawai: "",
    nomor_telepon: null,
    status_pegawai: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "id_ruangan" && value ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(data);
    AddPegawai(data)
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return (
    <div
      className="container"
      style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}
    >
      <h1>Entri Data Pegawai</h1>
      <Form onSubmit={handleSubmit}>
        {/* Jabatan Pegawai */}
        <div className="form-group">
          <label>Jabatan Pegawai</label>
          <select
            name="jabatan_pegawai"
            value={data.jabatan_pegawai}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Pilih Jabatan</option>
            <option value="Kepala klinik">Kepala klinik</option>
            <option value="Beautician">Beautician</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Dokter">Dokter</option>
            <option value="Kasir">Kasir</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* ID Ruangan */}
        {(data.jabatan_pegawai === "Beautician" ||
          data.jabatan_pegawai === "Dokter") && (
          <div className="form-group">
            <label>ID Ruangan (Opsional)</label>
            <select
              name="id_ruangan"
              value={data.id_ruangan}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Pilih Ruangan</option>
              <option value="1">Ruangan 1</option>
              <option value="2">Ruangan 2</option>
              {/* Tambahkan opsi lainnya sesuai data ruangan yang ada */}
            </select>
          </div>
        )}
        

        {/* Nama Pegawai */}
        <div className="form-group">
          <label>Nama Pegawai</label>
          <input
            type="text"
            name="nama_pegawai"
            value={data.nama_pegawai}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Alamat Pegawai */}
        <div className="form-group">
          <label>Alamat Pegawai</label>
          <input
            type="text"
            name="alamat_pegawai"
            value={data.alamat_pegawai}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Nomor Telepon */}
        <div className="form-group">
          <label>Nomor Telepon</label>
          <input
            type="number"
            name="nomor_telepon"
            value={data.nomor_telepon}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Status Pegawai */}
        {(data.jabatan_pegawai === "Beautician" ||
          data.jabatan_pegawai === "Dokter") && (
          <div className="form-group">
            <label>Status Pegawai</label>
            <select
              name="status_pegawai"
              value={data.status_pegawai}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Pilih Status</option>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
            </select>
          </div>
        )}

        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={data.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Simpan Data Pegawai
        </button>
      </Form>
    </div>
  );
};

export default EntriPegawaiPage;
