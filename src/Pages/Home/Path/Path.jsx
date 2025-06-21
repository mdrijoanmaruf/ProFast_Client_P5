import React from 'react'
import liveTracking from '../../../assets/live.png'
import safeDelivery from '../../../assets/safe.png'
import callSupport from '../../../assets/safe.png'

const Path = () => {
  const features = [
    {
      id: 1,
      image: liveTracking,
      title: "Live Parcel Tracking",
      description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind."
    },
    {
      id: 2,
      image: safeDelivery,
      title: "100% Safe Delivery",
      description: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time."
    },
    {
      id: 3,
      image: callSupport,
      title: "24/7 Call Center Support",
      description: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us."
    }
  ];

  return (
    <div data-aos="fade-up" className="py-12 sm:py-16 lg:py-20 bg-gray-100 rounded-2xl">
      <div className="container mx-auto md:px-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Why Choose ProFast?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
            Experience reliable, secure, and transparent delivery services with our comprehensive tracking and support system
          </p>
        </div>

        {/* Features Section */}
        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 bg-white p-2 pb-8 md:pb-2 rounded-2xl"
            >
              {/* Image Container - 1/4 size - Always on left */}
              <div className="flex-shrink-0 w-full lg:w-1/4">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 ">
                  <div className="aspect-square max-w-32 sm:max-w-40 lg:max-w-48 mx-auto">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Content Container - 3/4 size - Always on right */}
              <div className="flex-1 lg:w-3/4 text-center lg:text-left">
                <h3 className="text-2xl font-bold text-[#03373D] mb-4 sm:mb-6">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-none mx-auto lg:mx-0">
                  {feature.description}
                </p>
                
                {/* Optional: Add a CTA button */}
                <div className="mt-6 sm:mt-8">
                  <button className="bg-[#CAEB66] text-[#03373D] px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}

export default Path