import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-white py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <h6 className="text-uppercase fw-bold">Information</h6>
            <ul className="list-unstyled mt-3">
              <li><a href="" className="text-white text-decoration-none">Pages</a></li>
              <li><a href="" className="text-white text-decoration-none">Our Team</a></li>
              <li><a href="" className="text-white text-decoration-none">Features</a></li>
              <li><a href="" className="text-white text-decoration-none">Pricing</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="text-uppercase fw-bold">Resources</h6>
            <ul className="list-unstyled mt-3">
              <li><a href="" className="text-white text-decoration-none">Wikipedia</a></li>
              <li><a href="" className="text-white text-decoration-none">React Blog</a></li>
              <li><a href="" className="text-white text-decoration-none">Terms &amp; Service</a></li>
              <li><a href="" className="text-white text-decoration-none">Angular Dev</a></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="text-uppercase fw-bold">Help</h6>
            <ul className="list-unstyled mt-3">
              <li><a href="" className="text-white text-decoration-none">Sign Up</a></li>
              <li><a href="" className="text-white text-decoration-none">Login</a></li>
              <li><a href="" className="text-white text-decoration-none">Terms of Services</a></li>
              <li><a href="" className="text-white text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="text-uppercase fw-bold">Contact Us</h6>
            <p className="mt-3">Contact Me if you need help with anything.</p>
            <p className="fw-bold">+91 9032050633</p>
            <p className="fw-bold">Papini Abhinav</p>
          </div>
        </div>

        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="mb-0">&copy; 2025 BLOGVERSE, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

