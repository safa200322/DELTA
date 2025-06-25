import React from "react";

import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import AboutSection from "../components/UI/AboutSection";
import { Container, Row, Col } from "reactstrap";
//import BecomeDriverSection from "../components/UI/BecomeDriverSection";

import driveImg from "../assets/all-images/drive.jpg";
//import OurMembers from "../components/UI/OurMembers";
import "../styles/about.css";
import Footer from "../components/Footer/Footer";

const About = () => {
  return (
    <Helmet title="About">
      <CommonSection title="About Us" />
      <AboutSection aboutClass="aboutPage" />

      <section className="about__page-section">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12">
              <div className="about__page-img">
                <img src={driveImg} alt="" className="w-100 rounded-3" />
              </div>
            </Col>

            <Col lg="6" md="6" sm="12">
              <div className="about__page-content">
                <h2 className="section__title">
                  We Are Committed To Provide Safe Ride Solutions
                </h2>

                <p className="section__description">
                  We Are Committed to Providing Safe Ride Solutions At Delta
                  Rent Service, your safety and satisfaction are our top
                  priorities. Whether you're commuting within the city or
                  planning a scenic tour in Northern Cyprus, we offer secure and
                  reliable ride solutions tailored to your needs.
                </p>

                <p className="section__description">
                  Modern Vehicles: Well-maintained and equipped for a
                  comfortable experience. Safety First: Chauffeur services with
                  professional drivers available. Convenience: Easy booking,
                  multiple pickup/drop-off points, and 24/7 support.
                </p>

                <div className=" d-flex align-items-center gap-3 mt-4">
                  <span className="fs-4">
                    <i class="ri-phone-line"></i>
                  </span>

                  <div>
                    <h6 className="section__subtitle">Need Any Help?</h6>
                    <h4>+90(548) 000 0000</h4>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* <BecomeDriverSection />

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">Experts</h6>
              <h2 className="section__title">Our Members</h2>
            </Col>
            <OurMembers />
          </Row>
        </Container>
      </section> */}
      <Footer />
    </Helmet>
  );
};

export default About;
