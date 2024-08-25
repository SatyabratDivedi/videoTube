import { useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/themes/dist/forest/index.css";
import axios from "axios";
import { FaArrowCircleRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

function VideoComponent({ id }) {
  const [module, setModule] = useState(null);
  const [nextPrevModule, setNextPrevModule] = useState(null);
  const [playPercentage, setPlayPercentage] = useState(0);
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [videoElement, setVideoElement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAllModule() {
      try {
        const res = await axios.get(`http://localhost:5000/api/modules`);
        setNextPrevModule(res?.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching module:", error);
      }
    }
    fetchAllModule();
  }, [id]);

  useEffect(() => {
    let allowedTime = 0;
    async function fetchModule() {
      try {
        const res = await axios.get(`http://localhost:5000/api/modules/${id}`);
        setModule(res?.data);
        console.log("videoPath", res?.data?.videoPath);
        const progressRes = await axios.get(`http://localhost:5000/api/progress/${id}`);

        if (videoPlayer) {
          videoPlayer.dispose();
        }

        const player = videojs(videoElement);
        player.src({ type: "video/mp4", src: res?.data?.videoPath });
        player.currentTime(progressRes.data.timestamp || 0);
        allowedTime = progressRes.data.timestamp || 0;

        player.on("timeupdate", () => {
          const currentTime = player.currentTime();
          allowedTime = Math.max(allowedTime, currentTime);
          const duration = player.duration();
          const percentage = (currentTime / duration) * 100;
          setPlayPercentage(percentage.toFixed());
          axios.post(`http://localhost:5000/api/progress/${id}`, { timestamp: currentTime });
        });

        player.on("seeking", () => {
          const currentTime = player.currentTime();
          if (currentTime > allowedTime) {
            alert("Fast-forwarding is not allowed.");
            player.currentTime(allowedTime);
          }
        });

        setVideoPlayer(player);
      } catch (error) {
        console.error("Error fetching module or progress:", error);
      }
    }

    if (videoElement) {
      fetchModule();
    }

    return () => {
      if (videoPlayer) {
        videoPlayer.dispose();
      }
    };
  }, [id, videoElement]);

  return (
    <div className='module-container relative overflow-hidden px-20 min-h-[70vh] '>
      <div className='w-60 absolute top-[68%] left-0'>
        <img src='src/assets/pic1.png' alt='' />
      </div>
      <div className='w-40  absolute top-[70%] right-0'>
        <img src='src/assets/pic2.png' alt='' />
      </div>

      <div className='module-content'>
        <h2 className='font-bold '>{module?.title || <Skeleton height={30} />}</h2>
        <li className='mt-9 text-[1.2.3rem]'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis autem ratione amet dignissimos aspernatur soluta quo quis perspiciatis consectetur pariatur, rem, aliquid reiciendis, iste
          ab? Repellat inventore nam soluta autem?
        </li>
        <li className='mt-9 text-[1.2.3rem]'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis autem ratione amet dignissimos aspernatur soluta quo quis perspiciatis consectetur pariatur, rem, aliquid reiciendis, iste
          ab? Repellat inventore nam soluta autem?
        </li>
        <li className='mt-9 text-[1.2.3rem]'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis autem ratione amet dignissimos aspernatur soluta quo quis perspiciatis consectetur pariatur, rem, aliquid reiciendis, iste
          ab? Repellat inventore nam soluta autem?
        </li>
      </div>
      <div className='module-media '>
        <div className='module-navigation mb-3 flex justify-end'>
          <div className='module-progress flex flex-col items-center gap-5 '>
            <div className='progress-circle'>
              <svg viewBox='0 0 36 36' className='circular-chart blue '>
                <path
                  className='circle-bg '
                  d='M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831'
                />
                <path
                  className='circle bg-[#6ce5e8]'
                  strokeDasharray={`${playPercentage}, 100`}
                  d='M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831'
                />
              </svg>
              <div className='percentage'>
                <p> {isNaN(playPercentage) ? 0 : playPercentage}%</p>
              </div>
            </div>
            <p className='flex'>
              {(() => {
                const currentIndex = nextPrevModule?.findIndex((item) => item._id === id);
                if (isNaN(currentIndex) || currentIndex === -1) {
                  return <Skeleton width={20} />;
                } else {
                  return currentIndex + 1;
                }
              })()}
              /{nextPrevModule?.length || <Skeleton width={20} />} completed
            </p>
          </div>
        </div>
        <div data-vjs-player>
          {isLoading ? <Skeleton width={400} height={250} /> : <video ref={(element) => setVideoElement(element)} className='video-js' height='260' controls preload='auto'></video>}{" "}
        </div>
        <div className='next-module mt-3 z-50'>
          {nextPrevModule?.map((item, index) => {
            if (item._id === id && index < nextPrevModule.length - 1) {
              const nextItem = nextPrevModule[index + 1];
              return (
                <div key={nextItem._id} className='next-module-content flex items-center justify-center'>
                  <span>{nextItem.title}</span>
                  <span>
                    <FaArrowCircleRight className=' text-[#304994] size-10' />
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default VideoComponent;
