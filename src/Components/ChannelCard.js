import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
const ChannelCard = ({ id, src, channel_name, logo, backendAdd }) => {
  const [backendAddress, setBackendAddress] = useState(backendAdd);
  const navigate = useNavigate();
  const openChannel = (id, logo, option) => {
    if (!backendAddress || backendAddress === "") {
      alert("Please update the backend address");
      const newAddress = prompt(
        "Enter the new backend address:",
        backendAddress
      );
      if (newAddress) {
        localStorage.setItem("backendAddress", newAddress);
        setBackendAddress(newAddress);
      }
      return true;
    }
    if (option === "option1") {
      //Open new browser window in new tab
      window.open(`${backendAddress}/play.html?id=${id}&ch=${logo}`, "_blank");
    }

    if (option === "option2") {
      return navigate(`/video/${id}`);
    }
  };

  return (
    <div className="channel-card" key={id}>
      <LazyLoadImage src={src} alt={channel_name} effect="blur" />
      <div className="channel-info">
        <h3>{channel_name}</h3>
      </div>
      <button
        className="watch-btn"
        onClick={() => {
          openChannel(id, logo, "option1");
        }}
      >
        Watch
      </button>
      {/* <button
        className="watch-btn"
        onClick={() => {
          openChannel(id, logo, "option2");
        }}
      >
        Watch Option 2
      </button> */}
    </div>
  );
};

export default React.memo(ChannelCard);
