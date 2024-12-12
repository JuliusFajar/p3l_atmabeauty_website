import React, { useState } from "react";
import "./Login.css"; // Pastikan Anda menambahkan styling
import { Login } from "./api/apiAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const newData = { ...data, [event.target.name]: event.target.value };
    setData(newData);
    if (newData.username.trim().length > 0 && newData.password.length > 0) {
      // setIsDisabled(false);
    } else {
      // setIsDisabled(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lakukan aksi login, misalnya panggil API
    console.log("Username:", data.username);
    console.log("Password:", data.password);
    Login(data)
      .then((res) => {
        const userData = res.user; // Akses informasi karyawan dari respons
        if (res.user.jabatan_pegawai === undefined) {
          const idUser = userData.id_customer;
          sessionStorage.setItem("user_id", idUser);
          console.log("customer");
          sessionStorage.setItem("token", res.access_token);
          console.log(res.access_token);
          sessionStorage.setItem("user", JSON.stringify(res.user));
          toast.success("Login Berhasil!");
          console.log(res.message);
          navigate("/customer");
        } else {
          const idUser = userData.id_pegawai;
          sessionStorage.setItem("user_id", idUser);
          console.log(res.user.jabatan_pegawai);
          if (res.user.jabatan_pegawai === "Kepala Klinik") {
            sessionStorage.setItem("token", res.access_token);
            console.log(res.access_token);
            sessionStorage.setItem("user", JSON.stringify(res.user));
            toast.success("Login Berhasil!");
            console.log(res.message);
            navigate("/kepalaKlinik");
          } else if (res.user.jabatan_pegawai === "Beautician") {
            sessionStorage.setItem("token", res.access_token);
            console.log(res.access_token);
            sessionStorage.setItem("user", JSON.stringify(res.user));
            toast.success("Login Berhasil!");
            console.log(res.message);
            navigate("/beautician");
          } else if (res.user.jabatan_pegawai === "Customer Service") {
            sessionStorage.setItem("token", res.access_token);
            console.log(res.access_token);
            sessionStorage.setItem("user", JSON.stringify(res.user));
            toast.success("Login Berhasil!");
            console.log(res.message);
            navigate("/customerService");
          } else if (res.user.jabatan_pegawai === "Dokter") {
            sessionStorage.setItem("token", res.access_token);
            console.log(res.access_token);
            sessionStorage.setItem("user", JSON.stringify(res.user));
            toast.success("Login Berhasil!");
            console.log(res.message);
            navigate("/dokter");
          } else if (res.user.jabatan_pegawai === "Kasir") {
            sessionStorage.setItem("token", res.access_token);
            console.log(res.access_token);
            sessionStorage.setItem("user", JSON.stringify(res.user));
            toast.success("Login Berhasil!");
            console.log(res.message);
            navigate("/kasir");
          } else if (res.user.jabatan_pegawai === "Owner") {
            sessionStorage.setItem("token", res.access_token);
            console.log(res.access_token);
            sessionStorage.setItem("user", JSON.stringify(res.user));
            toast.success("Login Berhasil!");
            console.log(res.message);
            navigate("/owner");
          } else if (res.user.jabatan_pegawai === "Admin") {
            sessionStorage.setItem("token", res.access_token);
            console.log(res.access_token);
            sessionStorage.setItem("user", JSON.stringify(res.user));
            toast.success("Login Berhasil!");
            console.log(res.message);
            navigate("/admin");
          } else {
            console.log("gagal login");
            toast.error("Jabatan tidak sesuai peraturan");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("gagal login");
        toast.error("Username atau Password Salah!");
      });
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div
        style={{
          alignItems: "center",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button mb-2">
            Login
          </button>
          <a href="/" style={{ fontSize: "12px" }}>
            Back to Dashboard
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
