import React, { useState, useEffect } from "react";
import bannerBg from "../../../assets/NewBanner/bg.png";
import slider1 from "../../../assets/NewBanner/slider1.png";
import slider2 from "../../../assets/NewBanner/slider2.png";
import slider3 from "../../../assets/NewBanner/slider3.png";

const NewBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "We Make Sure Your",
      highlight: "Parcel Arrives",
      subtitle: "On Time – No Fuss.",
      description:
        "Fast, reliable delivery service with real-time tracking and professional handling.",
      image: slider1,
      buttonText: "Send Package",
    },
    {
      id: 2,
      title: "Professional Delivery",
      highlight: "Service",
      subtitle: "You Can Trust.",
      description:
        "Expert handling of your packages with secure transportation and timely delivery.",
      image: slider2,
      buttonText: "Track Package",
    },
    {
      id: 3,
      title: "Wide Coverage",
      highlight: "Network",
      subtitle: "Across The City.",
      description:
        "Extensive delivery network covering all major areas with guaranteed service quality.",
      image: slider3,
      buttonText: "Find Coverage",
    },
  ];

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div
      className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden sm:mx-4 lg:mx-0"
      style={{
        backgroundImage: `url(${bannerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-opacity-20 sm:bg-opacity-10"></div>

      {/* Main Content */}
      <div className="relative z-10 h-full">
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-10 h-full">
          <div className="flex flex-col lg:flex-row justify-between items-center h-full gap-4 sm:gap-6 lg:gap-8">
            {/* Left Content */}
            <div className="text-center lg:text-left w-full lg:w-1/2 space-y-4 sm:space-y-6 mt-8 lg:mt-0 lg:ml-6">
              {/* Running man icon */}
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L9 8.3V13h2V9.6l1.8-.7" />
                  </svg>
                </div>
                <div className="h-0.5 w-8 sm:w-12 bg-teal-600"></div>
              </div>

              {/* Main Title */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-[#CAEB66] leading-tight">
                  {slides[currentSlide].highlight}
                </span>
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  {slides[currentSlide].subtitle}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
                {slides[currentSlide].description}
              </p>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4">
                <button className="bg-[#CAEB66] hover:bg-[#b8d659] text-gray-900 font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
                  {slides[currentSlide].buttonText}
                </button>
              </div>

              {/* Progress Indicators - Hidden on mobile, shown on larger screens */}
              <div className="hidden sm:flex space-x-2 pt-4 sm:pt-6 justify-center lg:justify-start">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1 transition-all duration-300 ${
                      index === currentSlide
                        ? "w-6 sm:w-8 bg-teal-600"
                        : "w-3 sm:w-4 bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end w-full lg:w-1/2 mt-4 lg:mt-0">
              <div className="relative">
                <img
                  src={slides[currentSlide].image}
                  alt={`Slider ${slides[currentSlide].id}`}
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain transition-all duration-500 ease-in-out transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators (Dots) - Always visible */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewBanner;
