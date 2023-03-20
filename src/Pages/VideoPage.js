import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import Hls from "hls.js";
import Plyr from "plyr-react";
function VideoPage() {
  const { id } = useParams();

  const ref = useRef(null);
  const backendAddress = localStorage.getItem("backendAddress");

  const videoUrl = `${backendAddress}/getm3u8`;
  useEffect(() => {
    const loadVideo = async () => {
      const video = document.getElementById("plyr");
      var hls = new Hls();
      let url = `${videoUrl}/${id}/master.m3u8`;
      hls.loadSource(url);
      hls.attachMedia(video);
      ref.current.plyr.media = video;

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        ref.current.plyr.play();
      });
    };
    loadVideo();
  },[id, videoUrl]);
  return (
    <div>
      <Plyr
        id="plyr"
        options={{
          volume: 0.1,
          muted: false,
          controls: [
            "play-large",
            "play",
            "mute",
            "volume",
            "fullscreen",
            "airplay",
          ],
          autoplay: true,
          blankVideo: "https://cdn.plyr.io/static/blank.mp4",
          disableContextMenu: false,
          hideControls:true
        }}
        source={{}}
        ref={ref}
      />
    </div>
  );
}

export default VideoPage;
