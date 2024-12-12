import React from "react";
import logo from "./assets/images/logo.jpg"

const Footer = () => {
  return (
    <div className="container mt-5">
      <footer>
        <div className="row">
          {/* Kolom 1 */}
          <div className="col-md-3 mb-3">
            <h5>Natural Beauty Center</h5>
            <ul className="list-unstyled mt-4">
              <li className="mb-2">
                <a href="/" className="text-body-secondary">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/features" className="text-body-secondary">
                  Features
                </a>
              </li>
              <li className="mb-2">
                <a href="/pricing" className="text-body-secondary">
                  Pricing
                </a>
              </li>
              <li className="mb-2">
                <a href="/faqs" className="text-body-secondary">
                  FAQs
                </a>
              </li>
              <li className="mb-2">
                <a href="/about" className="text-body-secondary">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 2 */}
          <div className="col-md-3 mb-3">
            <h5>About Us</h5>
            <ul className="list-unstyled mt-4">
              <li className="mb-2">
                <a href="/teams" className="text-body-secondary">
                  Our Teams
                </a>
              </li>
              <li className="mb-2">
                <a href="/company" className="text-body-secondary">
                  Natural Beauty Center
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3 */}
          <div className="col-md-3 mb-3">
            <h5>Contact</h5>
            <ul className="list-unstyled mt-4">
              <li className="mb-2">
                <a href="/contact" className="text-body-secondary">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Logo */}
          <div className="col-md-3 mb-3 d-flex align-items-center justify-content-center">
            <img
              style={{ height: "100px", borderRadius: "50%" }}
              src={logo}
              alt="Natural Beauty Center Logo"
            />
          </div>
        </div>

        {/* Bagian Bawah Footer */}
        <div className="d-flex flex-column flex-sm-row justify-content-between py-2 border-top">
          <p className="text-muted">
            © 2024 Natural Beauty Center. Designed by Bryan, Fajar, Rico
          </p>
          <ul className="list-unstyled d-flex">
            <li className="ms-3">
              <a className="link-body-emphasis" href="https://twitter.com">
                <i className="bi bi-twitter"></i>
              </a>
            </li>
            <li className="ms-3">
              <a className="link-body-emphasis" href="https://instagram.com">
                <i className="bi bi-instagram"></i>
              </a>
            </li>
            <li className="ms-3">
              <a className="link-body-emphasis" href="https://facebook.com">
                <i className="bi bi-facebook"></i>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
