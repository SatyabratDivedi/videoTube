import { useEffect, useState, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/themes/dist/forest/index.css";
import axios from "axios";

function VideoComponent() {
  const [module, setModule] = useState(null);
  const [playPercentage, setPlayPercentage] = useState(0); 
  const videoRef = useRef(null);

  useEffect(() => {
    let player;
    let allowedTime = 0;
    async function fetchModule() {
      try {
        const res = await axios.get(`http://localhost:5000/api/modules/66c5e348315179aa79965c9e`);
        setModule(res.data);
        const progressRes = await axios.get(`http://localhost:5000/api/progress/66c5e348315179aa79965c9e`);

        player = videojs(videoRef.current);
        player.src({ type: "video/mp4", src: res.data.videoPath });
        player.currentTime(progressRes.data.timestamp || 0);
        allowedTime = progressRes.data.timestamp || 0;

        player.on("timeupdate", () => {
          const currentTime = player.currentTime();
          allowedTime = Math.max(allowedTime, currentTime);
          const duration = player.duration();
          const percentage = (currentTime / duration) * 100;
          setPlayPercentage(percentage.toFixed(2)); // Update play percentage
          axios.post(`http://localhost:5000/api/progress/66c5e348315179aa79965c9e`, { timestamp: currentTime });
        });

        player.on("seeking", () => {
          const currentTime = player.currentTime();
          if (currentTime > allowedTime) {
            alert("Fast-forwarding is not allowed.");
            player.currentTime(allowedTime);
          }
        });
      } catch (error) {
        console.error("Error fetching module or progress:", error);
      }
    }

    fetchModule();

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  return (
    <div className='module-container'>
      <div className='module-content'>
        <h2>{module?.title}</h2>
        <p>Importance of PPE: Explain the significance of PPE in preventing injuries and illnesses in the workplace.</p>
        <p>Types of PPE: Introduce various types of PPE, such as hard hats, safety glasses, gloves, earplugs, respirators, and steel-toed boots.</p>
        <p>Proper Use and Maintenance: Demonstrate how to properly use and maintain PPE, including inspection procedures and storage guidelines.</p>
      </div>
      <div className='module-media'>
        <div className='module-navigation'>
          <div className='module-progress'>
            <div className='progress-circle'>
              <svg viewBox='0 0 36 36' className='circular-chart blue'>
                <path
                  className='circle-bg'
                  d='M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831'
                />
                <path
                  className='circle'
                  strokeDasharray={`${playPercentage}, 100`} 
                  d='M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831'
                />
              </svg>
              <div className='percentage'>
              <p>{playPercentage}%</p>
              <p>1/8 completed</p>
              </div>
            </div>
          </div>
        </div>
        <div data-vjs-player>
          <video ref={videoRef} className='video-js' height='260' controls preload='auto'></video>
        </div>
          <div className='next-module'>
            <span>Module 2: Fire Safety and Prevention</span>
            <button className='arrow-button'>&rarr;</button>
          </div>
      </div>
    </div>
  );
}

export default VideoComponent;
