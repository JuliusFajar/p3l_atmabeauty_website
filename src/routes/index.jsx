import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import TopNavBar from "../TopNavBar";
import TopNavBarAdmin from "../admin/TopNavBarAdmin";
import Footer from "../Footer";
import Dashboard from "../Dashboard";
import LoginPage from "../LoginPage";
import TesCS from "../customerService/tes";
import TesCustomer from "../customer/tes";
import TesDokter from "../dokter/tes";
import TesKK from "../kepalaKlinik/tes";
import TesKasir from "../kasir/tes";
import TesBC from "../beautician/tes";
import TesOwner from "../owner/tes";
import Produk from "../Produk";
import Perawatan from "../Perawatan";
import EntriPegawaiPage from "../admin/EntriPegawai";
import PelayananCustomer from "../customerService/PelayananCustomer";

//ADMIN
import CRUDPegawai from "../admin/CRUDPegawai";
import CRUDPerawatan from "../admin/CRUDPerawatan";
import CRUDProduk from "../admin/CRUDProduk";
import CRUDRuangan from "../admin/CRUDRuangan";

//CUSTOMER SERVICE
import ShowCustomer from "../customerService/DaftarCustomer";
import TopNavBarCS from "../customerService/TopNavBarCS";

//KEPALA KLINIK
import ShowJadwal from "../kepalaKlinik/Jadwal";
import ShowPromo from "../kepalaKlinik/ShowPromo";
import TopNavBarKK from "../kepalaKlinik/TopNavBarKK";
import LaporanCustomer from "../kepalaKlinik/LaporanCustomerBaru";
import LaporanCustomerPerDokter from "../kepalaKlinik/LaporanCustomerPerDokter";
import LaporanPendapatan from "../kepalaKlinik/LaporanPendapatan";
import LaporanPerawatanTerlaris from "../kepalaKlinik/LaporanPerawatanTerlaris";
import LaporanProdukTerlaris from "../kepalaKlinik/LaporanProduk";

//KASIR
import Pembayaran from "../kasir/Pembayaran";
import TopNavBarKasir from "../kasir/TopNavBarKasir";

//DOKTER
import Pemeriksaan from "../dokter/Pemeriksaan";
import TopNavBarDokter from "../dokter/TopNavBarDokter";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Not Found!</div>,
  },
  {
    path: "/",
    element: (
      <div className="">
        <TopNavBar />
        <Dashboard />
        <Footer />
      </div>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/customer",
    element: <TesCustomer />,
  },
  {
    path: "/admin",
    element: (
      <div className="">
        <TopNavBarAdmin />
        <CRUDPegawai />
        <Footer />
      </div>
    ),
  },
  {
    path: "/admin/pegawai",
    element: (
      <div className="">
        <TopNavBarAdmin />
        <CRUDPegawai />
        <Footer />
      </div>
    ),
  },
  {
    path: "/admin/perawatan",
    element: (
      <div className="">
        <TopNavBarAdmin />
        <CRUDPerawatan />
        <Footer />
      </div>
    ),
  },
  {
    path: "/admin/produk",
    element: (
      <div className="">
        <TopNavBarAdmin />
        <CRUDProduk />
        <Footer />
      </div>
    ),
  },
  {
    path: "/admin/ruangan",
    element: (
      <div className="">
        <TopNavBarAdmin />
        <CRUDRuangan />
        <Footer />
      </div>
    ),
  },
  {
    path: "/customerService",
    element: (
      <div className="">
        <TopNavBarCS />
        <ShowCustomer />
        <Footer />
      </div>
    ),
  },
  {
    path: "/customerService/PelayananCustomer",
    element: (
      <div className="">
        <TopNavBarCS />
        <PelayananCustomer />
        <Footer />
      </div>
    ),
  },
  {
    path: "/dokter",
    element: (
      <div className="">
        <TopNavBarDokter />
        <Pemeriksaan />
        <Footer />
      </div>
    ),
  },
  {
    path: "/kepalaKlinik",
    element: (
      <div className="">
        <TopNavBarKK />
        <ShowJadwal />
        <Footer />
      </div>
    ),
  },
  {
    path: "/kepalaKlinik/jadwal",
    element: (
      <div className="">
        <TopNavBarKK />
        <ShowJadwal />
        <Footer />
      </div>
    ),
  },
  {
    path: "/kepalaKlinik/promo",
    element: (
      <div className="">
        <TopNavBarKK />
        <ShowPromo />
        <Footer />
      </div>
    ),
  },
  {
    path: "/kepalaKlinik/laporanCustomerBaru",
    element: (
      <div className="">
        <TopNavBarKK />
        <LaporanCustomer />
        <Footer />
      </div>
    ),
  },
  {
    path: "/kepalaKlinik/laporanCustomerPerDokter",
    element: (
      <div className="">
        <TopNavBarKK />
        <LaporanCustomerPerDokter />
        <Footer />
      </div>
    ),
  },
  {
    path: "/kepalaKlinik/laporanPendapatan",
    element: (
      <div className="">
        <TopNavBarKK />
        <LaporanPendapatan />
        <Footer />
      </div>
    ),
  },
  {
    path: "/kepalaKlinik/laporanPerawatanTerlaris",
    element: (
      <div className="">
        <TopNavBarKK />
        <LaporanPerawatanTerlaris />
        <Footer />
      </div>
    ),
  },
  {
    path: "/kepalaKlinik/laporanProdukTerlaris",
    element: (
      <div className="">
        <TopNavBarKK />
        <LaporanProdukTerlaris />
        <Footer />
      </div>
    ),
  },
  {
    path: "/beautician",
    element: <TesBC />,
  },
  {
    path: "/owner",
    element: <TesOwner />,
  },
  {
    path: "/produk",
    element: (
      <div className="">
        <TopNavBar />
        <Produk />
        <Footer />
      </div>
    ),
  },
  {
    path: "/perawatan",
    element: (
        <div className="">
          <TopNavBar />
          <Perawatan />
          <Footer />
        </div>
      ),
  },
  {
    path: "/perawatan",
    element: (
        <div className="">
          <TopNavBar />
          <Perawatan />
          <Footer />
        </div>
      ),
  },
  {
    path: "/pegawai/entriPegawai",
    element: (
        <div className="">
          <TopNavBar />
          <EntriPegawaiPage />
          <Footer />
        </div>
      ),
  },
  {
    path: "/kasir",
    element: (
        <div className="">
          <TopNavBarKasir />
          <Pembayaran />
          <Footer />
        </div>
      ),
  },
]);

const AppRouter = () => {
  return (
    <>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
