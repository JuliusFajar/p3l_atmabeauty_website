import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Footer from "./Footer.jsx";
import Dashboard from "./Dashboard.jsx";
import LoginPage from "./LoginPage.jsx";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Produk from "./Produk.jsx";
// import Perawatan from './Perawatan.jsx'
import EntriPegawaiPage from "./admin/EntriPegawai.jsx";
import ShowPromo from "./kepalaKlinik/ShowPromo.jsx";
import ShowPegawai from "./admin/ShowPegawai.jsx";

import CRUDPegawai from "./admin/CRUDPegawai.jsx";
import CRUDPerawatan from "./admin/CRUDPerawatan.jsx";
import CRUDProduk from "./admin/CRUDProduk.jsx";
import CRUDRuangan from "./admin/CRUDRuangan.jsx";

import PelayananCustomer from "./customerService/PelayananCustomer.jsx";
import Pemeriksaan from "./dokter/Pemeriksaan.jsx";
import Pembayaran from "./kasir/Pembayaran.jsx";

import { BrowserRouter as Router } from "react-router-dom";

import LaporanPerawatanTerlaris from "./kepalaKlinik/LaporanPerawatanTerlaris.jsx";
import LaporanCustomerPerDokter from "./kepalaKlinik/LaporanCustomerPerDokter.jsx";


import LaporanCustomerBaru from "./kepalaKlinik/LaporanCustomerBaru.jsx";
import LaporanPendapatan from "./kepalaKlinik/LaporanPendapatan.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <TopNavBar />
    <Dashboard />
    <Footer /> */}
    {/* <LoginPage /> */}

    {/* <CRUDPegawai /> */}
    {/* <CRUDPerawatan /> */}
    {/* <CRUDProduk/> */}
    {/* <CRUDRuangan /> */}

    {/* <Pegawai /> */}
    {/* <ShowPegawai /> */}
    {/* <Perawatan /> */}
    {/* <Produk /> */}
    {/* <EntriPegawaiPage /> */}
    {/* <ShowPromo /> */}
    {/* <Router>
      <PelayananCustomer />
    </Router> */}
    {/* <Pemeriksaan /> */}
    {/* <Pembayaran /> */}
    
    {/* <LaporanPerawatanTerlaris /> */}

    {/* <LaporanCustomerBaru />
    <LaporanPendapatan /> */}

    {/* <LaporanPerawatanTerlaris />
    <LaporanCustomerPerDokter /> */}
    <AppRouter />
  </React.StrictMode>
);
