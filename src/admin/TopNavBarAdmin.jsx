import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap"; // Import dari react-bootstrap
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";

const TopNavBarAdmin = ({}) => {
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
            <Nav.Link onClick={() => navigate("/admin/pegawai")}>
              Pegawai
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/perawatan")}>
              Perawatan
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/produk")}>
              Produk
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/admin/ruangan")}>
              Ruangan
            </Nav.Link>
          </Nav>
          <Nav>
            <Button variant="danger" onClick={logout}>
              LOG OUT
            </Button>
            <Nav.Link onClick={() => ProfilePop()}>ADMIN</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavBarAdmin;
