import "bootstrap/dist/css/bootstrap.min.css";
import { NavDropdown, Navbar, Nav, Container, Button } from "react-bootstrap"; // Import dari react-bootstrap
import { useNavigate } from "react-router-dom";
// import logoAtma from "./assets/images/uajy.png"
// import logo from "./assets/images/logo.jpg"
import logo from "../assets/images/logo.jpg";

const TopNavBarKK = ({}) => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };
  return (
    <Navbar
      fixed="top"
      collapseOnSelect
      expand="lg"
      className="topNav"
      style={{ backgroundColor: "#FFEFEF" }}
    >
      <Container>
        <Navbar.Brand>
          <img
            src={logo}
            alt=""
            style={{ height: "40px", borderRadius: "50%" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/kepalaKlinik/jadwal")}>
              Jadwal
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/kepalaKlinik/promo")}>
              Promo
            </Nav.Link>
            <NavDropdown title="Laporan" id="laporan-dropdown">
              <NavDropdown.Item
                onClick={() => navigate("/kepalaKlinik/laporanCustomerBaru")}
              >
                Laporan Customer Baru
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => navigate("/kepalaKlinik/laporanCustomerPerDokter")}
              >
                Laporan Customer Per Dokter
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => navigate("/kepalaKlinik/laporanPendapatan")}
              >
                Laporan Pendapatan
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => navigate("/kepalaKlinik/laporanPerawatanTerlaris")}
              >
                Laporan 10 Perawatan Terlaris
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => navigate("/kepalaKlinik/laporanProdukTerlaris")}
              >
                Laporan 10 Produk Terlaris
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Button variant="danger" onClick={logout}>
              LOG OUT
            </Button>
            <Nav.Link onClick={() => ProfilePop()}>KEPALA KLINIK</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavBarKK;
