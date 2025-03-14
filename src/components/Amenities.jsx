import React from "react";

// Import amenity icons
import freeWifi from "../images/freewifi.png";
import cctv from "../images/cctvsurveillance.png";
import security from "../images/twentyfoursevensecurity.png";
import water from "../images/constantwatersupply.png";
import studyRooms from "../images/studyrooms.png";
import beds from "../images/bedsprovided.png";
import washrooms from "../images/cleanwashrooms.png";
import lounge from "../images/chilloutlounge.png";
import commonRoom from "../images/commonroom.png";
import darts from "../images/darts.png";
import chess from "../images/chesssilhouette1.png";
import cards from "../images/freecardgames.png";
import poolTable from "../images/freepooltable.png";
import mountKenya from "../images/mountkenyaview.png";
import entertainment from "../images/movienight.png";
import serene from "../images/sereneenvironment.png";
import canteen from "../images/studentcanteen.png";
import changingRooms from "../images/changingrooms.png";

const amenities = [
  { name: "Free Wi-Fi", icon: freeWifi },
  { name: "CCTV Surveillance", icon: cctv },
  { name: "24/7 Security", icon: security },
  { name: "Constant Water Supply", icon: water },
  { name: "Study Tables", icon: studyRooms },
  { name: "Beds & Mattresses", icon: beds },
  { name: "Clean Washrooms", icon: washrooms },
  { name: "Chill Out Lounge", icon: lounge },
  { name: "Common Room", icon: commonRoom },
  { name: "Darts Board", icon: darts },
  { name: "Board Games (Chess, etc.)", icon: chess },
  { name: "Free Card Games", icon: cards },
  { name: "Free Pool Table", icon: poolTable },
  { name: "Beautiful Mount Kenya View", icon: mountKenya },
  { name: "Entertainment (Movie Nights)", icon: entertainment },
  { name: "Serene Environment", icon: serene },
  { name: "Student Canteen", icon: canteen },
  { name: "Changing Rooms", icon: changingRooms },
];

const AmenitiesSection = () => {
  return (
    <div className="flex flex-col items-center py-16 bg-gray-100">
      {/* Section Header */}
      <h2 className="text-red-500 uppercase text-lg font-semibold">Our Amenities</h2>
      <h3 className="text-3xl font-bold text-gray-800">Amenities</h3>

      {/* Amenities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3 p-4 bg-white shadow-md rounded-lg">
            <img src={amenity.icon} alt={amenity.name} className="w-10 h-10" />
            <span className="text-gray-700 font-medium">{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesSection;
