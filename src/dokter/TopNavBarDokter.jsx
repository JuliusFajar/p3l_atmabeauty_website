import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap"; // Import dari react-bootstrap
import { useNavigate } from "react-router-dom";
// import logoAtma from "./assets/images/uajy.png"
import logo from "../assets/images/logo.jpg";

const TopNavBarDokter = ({}) => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };
  return (
    <Navbar fixed="top" collapseOnSelect expand="lg" className="topNav" style={{ backgroundColor: "#FFEFEF" }} >
      <Container>
        <Navbar.Brand>
          <img src={logo} alt="" style={{ height: "40px", borderRadius: "50%" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>Pemeriksaan</Nav.Link>
            {/* <Nav.Link>History</Nav.Link>
            <Nav.Link>About</Nav.Link>
            <Nav.Link>Keranjang</Nav.Link>
            <Nav.Link>Dalam Pengiriman</Nav.Link> */}
          </Nav>
          <Nav>
            <Button variant="danger" onClick={logout}>
              LOG OUT
            </Button>
            <Nav.Link onClick={() => ProfilePop()}>DOKTER</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavBarDokter;
