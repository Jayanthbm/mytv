/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import "react-lazy-load-image-component/src/effects/blur.css";
import ChannelCard from "../Components/ChannelCard";
import SearchBox from "../Components/SearchBox";
function HomePage() {
  const [allChannels, setChannels] = useState([]);
  const [baseLogoUrl, setBaseLogoUrl] = useState("");
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({
    hd: "both",
    language: "all",
  });

  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [backendAddress, setBackendAddress] = useState(
    localStorage.getItem("backendAddress") || ""
  );
  const [lastFetchedTime, setLastFetchedTime] = useState(null);
  const [hardRefresh, setHardRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log("FETCH DATA API CALLED");
      const response = await axios.get(
        "https://slcknecdnems07.cdnsrv.jio.com/jiotv.data.cdn.jio.com/apis/v1.4/getMobileChannelList/get/?os=android&devicetype=phone"
      );
      const data = response.data.result;
      setChannels(data);
      setLastFetchedTime(Date.now());
      localStorage.setItem("jsonData", JSON.stringify(data));
      localStorage.setItem("lastFetchedTime", Date.now());
    };

    const storedData = localStorage.getItem("jsonData");
    const storedTime = localStorage.getItem("lastFetchedTime");

    if (
      storedData &&
      storedTime !== undefined &&
      Date.now() - storedTime <= 7 * 24 * 60 * 60 * 1000 &&
      !hardRefresh
    ) {
      setChannels(JSON.parse(storedData));
      setLastFetchedTime(storedTime);
    } else {
      fetchData();
    }
    setBaseLogoUrl("https://jiotv.catchup.cdn.jio.com/dare_images/images");
  }, [hardRefresh, backendAddress]);

  const handleBackendUpdate = () => {
    const newAddress = prompt("Enter the new backend address:", backendAddress);
    if (newAddress) {
      localStorage.setItem("backendAddress", newAddress);
      setBackendAddress(newAddress);
      window.location.reload();
    }
  };

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((text) => {
      setSearchText(text);
    }, 900),
    []
  );

  const applyFilters = useMemo(() => {
    return () => {
      let channels = allChannels;

      if (selectedFilter.hd !== "both") {
        channels = channels.filter(
          (channel) => channel.isHD === (selectedFilter.hd === "hd")
        );
      }

      if (selectedFilter.language !== "all") {
        channels = channels.filter(
          (channel) => channel.channelLanguageId === selectedFilter.language
        );
      }

      return channels;
    };
  }, [allChannels, selectedFilter]);

  useEffect(() => {
    const filtered = applyFilters();
    let filteredBySearch = filtered;
    if (searchText?.length > 0) {
      filteredBySearch = filtered.filter((channel) =>
        channel.channel_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredChannels(filteredBySearch);
  }, [allChannels, applyFilters, searchText]);

  const handleFilterChange = (hd, language) => {
    setSelectedFilter({ hd: hd, language: language });
  };
  return (
    <>
      <header className="header">
        <h1>JioTv</h1>
        <p>Developed by Jayanth</p>
        <button onClick={handleBackendUpdate}>Update Backend Address</button>
      </header>
      <div className="filter-bar">
        <div className="filter">
          <div
            className={`filter-option ${
              selectedFilter.language === "all" ? "active" : ""
            }`}
            onClick={() => handleFilterChange(selectedFilter.hd, "all")}
          >
            All
          </div>
          <div
            className={`filter-option ${
              selectedFilter.language === 13 ? "active" : ""
            }`}
            onClick={() => handleFilterChange(selectedFilter.hd, 13)}
          >
            Kannada
          </div>
          <div
            className={`filter-option ${
              selectedFilter.language === 8 ? "active" : ""
            }`}
            onClick={() => handleFilterChange(selectedFilter.hd, 8)}
          >
            Tamil
          </div>
          <div
            className={`filter-option ${
              selectedFilter.language === 11 ? "active" : ""
            }`}
            onClick={() => handleFilterChange(selectedFilter.hd, 11)}
          >
            Telugu
          </div>
          <div
            className={`filter-option ${
              selectedFilter.language === 7 ? "active" : ""
            }`}
            onClick={() => handleFilterChange(selectedFilter.hd, 7)}
          >
            Malayalam
          </div>
          <div
            className={`filter-option ${
              selectedFilter.language === 1 ? "active" : ""
            }`}
            onClick={() => handleFilterChange(selectedFilter.hd, 1)}
          >
            Hindi
          </div>
          <div
            className={`filter-option ${
              selectedFilter.language === 6 ? "active" : ""
            }`}
            onClick={() => handleFilterChange(selectedFilter.hd, 6)}
          >
            English
          </div>
        </div>
      </div>
      <div className="filter-bar">
        <div className="filter">
          <div
            className={`filter-option ${
              selectedFilter.hd === "both" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("both", selectedFilter.language)}
          >
            All
          </div>
          <div
            className={`filter-option ${
              selectedFilter.hd === "hd" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("hd", selectedFilter.language)}
          >
            HD
          </div>
          <div
            className={`filter-option ${
              selectedFilter.hd === "sd" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("sd", selectedFilter.language)}
          >
            SD
          </div>
        </div>
      </div>
      <SearchBox
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          handleSearch(e.target.value);
        }}
      />

      <div className="container">
        {filteredChannels ? (
          filteredChannels.map((channel) => (
            <ChannelCard
              key={channel.channel_id}
              id={channel.channel_id}
              src={baseLogoUrl + "/" + channel.logoUrl}
              channel_name={channel.channel_name}
              logo={channel.logoUrl}
              backendAdd={backendAddress}
            />
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default HomePage;
