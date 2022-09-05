import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// We will load this lazily instead.
// import videojs from "video.js";
import { client } from "../utils";
import "video.js/dist/video-js.css";

const Player = ({ previewUrl }) => {
  const videoRef = useRef(null);

  const dispatch = useDispatch();
  const { id: videoId, url: src, thumb: poster } = useSelector(
    (state) => state.video.data
  );

  useEffect(() => {
    let vjsPlayer;
    (async () => {

      const { default : videojs } = await import('video.js');
      vjsPlayer = videojs(videoRef.current);
      
      if (!previewUrl) {
        vjsPlayer.poster(poster);
        vjsPlayer.src(src);
      }
      
      if (previewUrl) {
        vjsPlayer.src({ type: "video/mp4", src: previewUrl });
      }
      
      vjsPlayer.on("ended", () => {
        client(`${process.env.REACT_APP_BE}/videos/${videoId}/view`);
      });
      
    })();
    return () => {
      if (vjsPlayer) {
        vjsPlayer.dispose();
      }
    };
  }, [videoId, dispatch, src, previewUrl, poster]);

  return (
    <div data-vjs-player>
      <video
        controls
        ref={videoRef}
        className="video-js vjs-fluid vjs-big-play-centered"
      ></video>
    </div>
  );
};

export default Player;
