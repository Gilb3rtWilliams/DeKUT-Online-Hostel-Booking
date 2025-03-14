import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaArrowDown } from "react-icons/fa";
import LandingNavBar from "../components/LandingNavBar";
import LoginStudent from "../components/LoginStudent";
import LoginAdmin from "../components/LoginAdmin";
import Register from "../components/Register";
import RegisterAdmin from "../components/RegisterAdmin";
import ContactUs from "../components/ContactUs";
import AboutUs from "../components/AboutUs";
import styles from "../css/LandingPage.module.css";

// Import local images
import hostelImage1 from "../images/hostelimage1.jpg";
import hostelImage2 from "../images/hostelimage2.jpg";
import hostelImage3 from "../images/hostelimage3.jpg";
import hostelImage4 from "../images/hostelimage4.jpg";

// Import amenity icons
import freewifi from "../images/freewifi.png";
import cctvsurveillance from "../images/cctvsurveillance.png";
import twentyfoursevensecurity from "../images/twentyfoursevensecurity.png";
import constantwatersupply from "../images/constantwatersupply.png";
import studyrooms from "../images/studyrooms.png";
import bedsprovided from "../images/bedsprovided.png";
import cleanwashrooms from "../images/cleanwashrooms.png";
import chilloutlounge from "../images/chilloutlounge.png";
import commonroom from "../images/commonroom.png";
import darts from "../images/darts.png";
import chesssilhouette1 from "../images/chesssilhouette1.png";
import freecardgames from "../images/freecardgames.png";
import freepooltable from "../images/freepooltable.png";
import mountkenyaview from "../images/mountkenyaview.png";
import movienight from "../images/movienight.png";
import sereneenvironment from "../images/sereneenvironment.png";
import studentcanteen from "../images/studentcanteen.png";
import changingrooms from "../images/changingrooms.png";

const images = [hostelImage1, hostelImage2, hostelImage3, hostelImage4];

const amenities = [
  { name: "Free Wi-Fi", icon: freewifi },
  { name: "CCTV Surveillance", icon: cctvsurveillance },
  { name: "24/7 Security", icon: twentyfoursevensecurity },
  { name: "Constant Water Supply", icon: constantwatersupply },
  { name: "Study Tables", icon: studyrooms },
  { name: "Beds & Mattresses Provided", icon: bedsprovided },
  { name: "Clean Washrooms", icon: cleanwashrooms },
  { name: "Chill Out Lounge", icon: chilloutlounge },
  { name: "Common Room", icon: commonroom },
  { name: "Darts Board", icon: darts },
  { name: "Free Board Games (Chess, etc.)", icon: chesssilhouette1 },
  { name: "Free Card Games", icon: freecardgames },
  { name: "Free Pool Table", icon: freepooltable },
  { name: "Beautiful View of Mount Kenya", icon: mountkenyaview },
  { name: "Entertainment (Movie Nights)", icon: movienight },
  { name: "Serene Environment", icon: sereneenvironment },
  { name: "Student Canteen", icon: studentcanteen },
  { name: "Changing Rooms (Ladies & Gents)", icon: changingrooms },
];

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [bgIndex, setBgIndex] = useState(0);

  // Auto-change background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manual navigation buttons
  const nextBackground = () => {
    setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevBackground = () => {
    setBgIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const scrollToAmenities = () => {
    const amenitiesSection = document.querySelector(`.${styles.amenitiesSection}`);
    amenitiesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={styles.landingContainer}
      style={{
        backgroundImage: `url(${images[bgIndex]})`,
      }}
    >
      <LandingNavBar setActiveTab={setActiveTab} />

      {/* Background Navigation Buttons */}
      <button
        onClick={prevBackground}
        className={`${styles.navButton} ${styles.navButtonLeft}`}
      >
        ◀
      </button>

      <button
        onClick={nextBackground}
        className={`${styles.navButton} ${styles.navButtonRight}`}
      >
        ▶
      </button>

      {/* System Introduction with Animation */}
      {activeTab === "home" && (
        <>
        <motion.div
            className={styles.introSection}
            key={bgIndex}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to DeKUT Online Hostel Booking
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Experience seamless hostel accommodation booking at DeKUT. 
              Our platform offers convenience, security, and comfort for your stay.
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.introSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Why Choose Our System?
            </motion.h2>
            <motion.div 
              className={styles.featuresGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[
                {
                  title: "Easy Booking Process",
                  description: "Simple and straightforward booking system that allows you to secure your accommodation in minutes."
                },
                {
                  title: "Real-time Availability",
                  description: "Check room availability and book instantly with our real-time updating system."
                },
                {
                  title: "Secure Payments",
                  description: "Safe and secure payment processing with multiple payment options available."
                },
                {
                  title: "24/7 Support",
                  description: "Round-the-clock customer support to assist you with any queries or concerns."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={styles.featureCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.button
              onClick={scrollToAmenities}
              className={styles.viewAmenitiesButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Amenities
              <FaArrowDown className="animate-bounce" />
            </motion.button>
        </motion.div>
        </>
      )}

      {/* Second Page - Amenities Section */}
      {activeTab === "home" && (
        <div className={styles.amenitiesSection}>
        <motion.div
            className={styles.amenitiesContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
            <motion.div
              className={styles.amenitiesHeader}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2>Our Premium Amenities</h2>
              <p>
                Experience comfort and convenience with our comprehensive range of facilities designed for student life.
              </p>
            </motion.div>
            
            <motion.div
              className={styles.amenitiesGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {amenities.map((amenity, index) => (
                <motion.div
                key={index}
                  className={`${styles.amenityCard} backdrop-blur-sm`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className={styles.amenityIcon}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src={amenity.icon} 
                      alt={amenity.name}
                    />
                  </motion.div>
                  <span className={styles.amenityName}>{amenity.name}</span>
                </motion.div>
              ))}
            </motion.div>
        </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === "loginStudent" && (
        <div className="min-h-screen flex items-center justify-center">
          <LoginStudent onClose={(tab) => setActiveTab(tab)} />
        </div>
      )}
      {activeTab === "loginAdmin" && (
        <div className="min-h-screen flex items-center justify-center">
          <LoginAdmin onClose={(tab) => setActiveTab(tab)} />
        </div>
      )}
      {activeTab === "register" && (
        <div className="min-h-screen flex items-center justify-center">
          <Register onClose={(tab) => setActiveTab(tab)} />
        </div>
      )}
      {activeTab === "registerAdmin" && (
        <div className="min-h-screen flex items-center justify-center">
          <RegisterAdmin onClose={(tab) => setActiveTab(tab)} />
        </div>
      )}
      {activeTab === "contact" && (
        <div className="min-h-screen flex items-center justify-center">
          <ContactUs onClose={(tab) => setActiveTab(tab)} />
        </div>
      )}
      {activeTab === "about" && (
        <div className="min-h-screen flex items-center justify-center">
          <AboutUs onClose={(tab) => setActiveTab(tab)} />
        </div>
      )}

      {/* Facility Description with Animation */}
      {activeTab === "home" && (
        <motion.div
          className={styles.facilitySection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Facility Overview
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Modern Security Systems",
                description: "Our hostels are equipped with state-of-the-art security features including:",
                features: [
                  "24/7 CCTV Surveillance",
                  "Secure Access Control Systems",
                  "Well-lit Premises",
                  "Dedicated Security Personnel"
                ]
              },
              {
                title: "Comfortable Living Spaces",
                description: "We provide comfortable and well-maintained living spaces featuring:",
                features: [
                  "Spacious Rooms",
                  "Modern Furniture",
                  "Regular Cleaning Services",
                  "Climate Control Systems"
                ]
              },
              {
                title: "Study Environment",
                description: "Create an ideal study environment with our dedicated facilities:",
                features: [
                  "24/7 Study Rooms",
                  "High-Speed Internet Access",
                  "Group Study Areas",
                  "Computer Labs"
                ]
              },
              {
                title: "Recreational Facilities",
                description: "Balance your studies with our recreational amenities:",
                features: [
                  "Common Room with TV",
                  "Indoor Games Area",
                  "Outdoor Sports Facilities",
                  "Fitness Center"
                ]
              }
            ].map((facility, index) => (
              <motion.div
                key={index}
                className={styles.facilityCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
                <ul>
                  {facility.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-white">
            <p className="mb-4">
              Our facilities are designed to provide a perfect balance between academic focus and comfortable living. 
              We ensure that every aspect of student life is catered to, from study spaces to recreational areas.
            </p>
            <p>
              Regular maintenance and upgrades are conducted to maintain high standards of living and ensure 
              all facilities remain in optimal condition for our students.
            </p>
          </div>
        </motion.div>
      )}

      {/* Social Media Integration with Hover Effects */}
      {activeTab === "home" && (
        <motion.div
          className={styles.socialSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Connect With Us
          </motion.h1>
          <motion.a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialIcon} bg-blue-600`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFacebookF />
          </motion.a>
          <motion.a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialIcon} bg-blue-400`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTwitter />
          </motion.a>
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialIcon} bg-pink-500`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaInstagram />
          </motion.a>
        </motion.div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className="text-white">© 2025 DeKUT Online Hostel Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
