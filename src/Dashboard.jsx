import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import carousel1 from "./assets/images/beauty.jpg";
import carousel2 from "./assets/images/treatment.jpg";
import carousel3 from "./assets/images/gambar_produk.jpg";
import dokter from "./assets/images/dokter.png";
import beautician from "./assets/images/beautician.png";
import staff from "./assets/images/staff.png";
import facial from "./assets/images/greenteafacial.jpg";
import laser from "./assets/images/laserCO2.jpg";
import botanical from "./assets/images/botanicalMesotherapy.jpg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <Container fluid>
      <Carousel showArrows={true} autoPlay={true} infiniteLoop={true}>
        <div
          className="carousel-slide"
          style={{ backgroundImage: `url(${carousel1})`, borderRadius: "15px" }}
        >
          <div
            className="carousel-content"
            style={{ textAlign: "left", left: "30%" }}
          >
            <h1>Natural Beauty Center</h1>
            <p>Natural Beauty, True Charm</p>
            <button className="order-button">About Us</button>
          </div>
        </div>
        <div
          className="carousel-slide"
          style={{ backgroundImage: `url(${carousel2})`, borderRadius: "15px" }}
        >
          <div
            className="carousel-content"
            style={{ textAlign: "right", left: "70%" }}
          >
            <h1>Treatment</h1>
            <p>Choose Your Favorite Treatment</p>
            <button className="order-button">Learn More</button>
          </div>
        </div>
        <div
          className="carousel-slide"
          style={{ backgroundImage: `url(${carousel3})`, borderRadius: "15px" }}
        >
          <div className="carousel-content">
            <h1>Our Product</h1>
            <p>Best Recommended Product</p>
            <button className="order-button">Order Now</button>
          </div>
        </div>
      </Carousel>

      <div style={{}}>
        <h1 className="my-3">About Us</h1>
        <p>
          Welcome to Natural Beauty Center, the beauty clinic that offers the
          finest treatments for your skin and body! With experienced
          professionals and state-of-the-art technology, we are here to help you
          achieve a radiant, natural beauty. At Natural Beauty Center, we
          believe that every individual's uniqueness deserves care and
          enhancement. Enjoy a personalized and comprehensive experience, from
          facials and skincare treatments to relaxing body therapies. Trust us
          with your beauty needs, and feel the real transformation with stunning
          results!
        </p>
      </div>
      <h1 className="my-5">Our Treatments</h1>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Img
              style={{ height: "20vw", objectFit: "contain", width: "100%" }}
              variant="top"
              src={facial}
              alt="Analytics Image"
            />
            <Card.Body>
              <Card.Title>Green Tea Facial</Card.Title>
              <Card.Text>
                A rejuvenating treatment rich in antioxidants to soothe, reduce
                redness, control oil, and leave skin feeling refreshed and
                balanced.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img
              style={{ height: "20vw", objectFit: "contain", width: "100%" }}
              variant="top"
              src={laser}
              alt="Analytics Image"
            />
            <Card.Body>
              <Card.Title>Laser CO 2</Card.Title>
              <Card.Text>
                Provides deep skin rejuvenation, targeting scars, fine lines,
                and skin texture. This advanced treatment stimulates collagen
                production, promoting smoother and more youthful-looking skin
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img
              style={{ height: "20vw", objectFit: "contain", width: "100%" }}
              variant="top"
              src={botanical}
              alt="Analytics Image"
            />
            <Card.Body>
              <Card.Title>Botanical Mesotherapy</Card.Title>
              <Card.Text>
                Infuses your skin with plant-based nutrients, enhancing
                hydration and radiance. Ideal for revitalizing dull skin, it
                naturally supports a healthy glow and improved skin tone
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h1 className="my-5">Our Products</h1>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Img
              style={{ height: "20vw", objectFit: "contain", width: "100%" }}
              variant="top"
              src={facial}
              alt="Analytics Image"
            />
            <Card.Body>
              <Card.Title>Green Tea Facial</Card.Title>
              <Card.Text>
                A rejuvenating treatment rich in antioxidants to soothe, reduce
                redness, control oil, and leave skin feeling refreshed and
                balanced.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img
              style={{ height: "20vw", objectFit: "contain", width: "100%" }}
              variant="top"
              src={laser}
              alt="Analytics Image"
            />
            <Card.Body>
              <Card.Title>Laser CO 2</Card.Title>
              <Card.Text>
                Provides deep skin rejuvenation, targeting scars, fine lines,
                and skin texture. This advanced treatment stimulates collagen
                production, promoting smoother and more youthful-looking skin
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img
              style={{ height: "20vw", objectFit: "contain", width: "100%" }}
              variant="top"
              src={botanical}
              alt="Analytics Image"
            />
            <Card.Body>
              <Card.Title>Botanical Mesotherapy</Card.Title>
              <Card.Text>
                Infuses your skin with plant-based nutrients, enhancing
                hydration and radiance. Ideal for revitalizing dull skin, it
                naturally supports a healthy glow and improved skin tone
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h1 className="mt-5">Meet Our Glowist</h1>
      <div
        className="mb-5 p-3"
        style={{
          display: "flex",
          alignItems: "center",
          // backgroundColor: "white",
          borderRadius: "20px",
          // boxShadow: "2px 2px 10px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="mx-5">
          <img
            style={{
              width: "15vw",
              borderRadius: "50%",
              background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            }}
            src={dokter}
            alt="Doctor Image"
          />
        </div>
        <div
          className="my-2"
          style={{ paddingLeft: "20px", textAlign: "left" }}
        >
          <h3>Doctor</h3>
          At Natural Beauty Center, our doctors are dedicated professionals
          committed to providing each patient with the highest level of care
          tailored to individual skin types and needs. With deep knowledge and
          extensive experience in skin health, our doctors use the latest
          technology and safe methods to help you achieve healthy, radiant skin.
          Your safety and comfort are our top priorities!
        </div>
      </div>
      <div
        className="my-5 p-3"
        style={{
          display: "flex",
          alignItems: "center",
          // backgroundColor: "white",
          borderRadius: "20px",
          // boxShadow: "2px 2px 10px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ paddingLeft: "20px", textAlign: "right" }}>
          <h3>Beautician</h3>
          Our team of beauticians consists of skilled professionals who
          understand precisely how to care for your skin. They are ready to
          provide a relaxing and comprehensive experience, from facials and skin
          treatments to soothing body therapies. Our beauticians are dedicated
          to making you feel refreshed, relaxed, and confident, with treatments
          personalized to meet your skin’s unique needs.
        </div>
        <div className="mx-5">
          <img
            style={{
              width: "15vw",
              borderRadius: "50%",
              background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            }}
            src={beautician}
            alt=""
          />
        </div>
      </div>
      <div
        className="my-5 p-3"
        style={{
          display: "flex",
          alignItems: "center",
          // backgroundColor: "white",
          borderRadius: "20px",
          // boxShadow: "2px 2px 10px 3px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="mx-5">
          <img
            style={{
              width: "15vw",
              borderRadius: "50%",
              background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            }}
            src={staff}
            alt=""
          />
        </div>
        <div style={{ paddingLeft: "20px", textAlign: "left" }}>
          <h3>Staff</h3>
          At Natural Beauty Center, our dedicated team of highly trained
          professionals prioritizes your comfort and satisfaction. Passionate
          about beauty and wellness, each staff member is committed to providing
          exceptional service tailored to your unique needs. We strive to create
          a rejuvenating and memorable experience that supports your journey to
          radiant beauty.
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
