import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap"; // Import dari react-bootstrap
import { useNavigate } from "react-router-dom";
import logoAtma from "./assets/images/uajy.png";
import logo from "./assets/images/logo.jpg";

const TopNavBar = ({}) => {
  const navigate = useNavigate();
  return (
    <Navbar
      fixed="top"
      collapseOnSelect
      expand="lg"
      className="topNav"
      style={{ backgroundColor: "white" }}
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{
            borderRadius: "50%",
            cursor: "pointer", // Menambahkan pointer saat hover
            transition: "transform 0.2s", // Menambahkan transisi untuk animasi
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src={logo}
            alt=""
            style={{ height: "40px", borderRadius: "50%" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => navigate("/perawatan")}
              style={{ transition: "transform 0.2s" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Treatment
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/produk")}
              style={{ transition: "transform 0.2s" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Product
            </Nav.Link>
            <Nav.Link
              style={{ transition: "transform 0.2s" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              About
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              onClick={() => navigate("/login")}
              style={{ transition: "transform 0.2s" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavBar;
