import React from "react";
import bannerImg1 from "../../../assets/banner/banner1.png";
import bannerImg2 from "../../../assets/banner/banner2.png";
import bannerImg3 from "../../../assets/banner/banner3.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  return (
    <div className="overflow-hidden rounded-xl">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        interval={4000}
        transitionTime={600}
        swipeable={true}
        emulateTouch={true}
      >
        <div>
          <img
            src={bannerImg1}
            alt="Banner 1"
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
        </div>
        <div>
          <img
            src={bannerImg2}
            alt="Banner 2"
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
        </div>
        <div>
          <img
            src={bannerImg3}
            alt="Banner 3"
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
