import React from 'react';
import { FaMapMarkerAlt, FaMoneyBillWave, FaWarehouse, FaBuilding } from 'react-icons/fa';

const HowItWorks = () => {
  const services = [
    {
      id: 1,
      icon: <FaMapMarkerAlt className="w-8 h-8 text-gray-700" />,
      title: "Booking Pick & Drop",
      description: "From personal packages to business shipments — we deliver on time, every time."
    },
    {
      id: 2,
      icon: <FaMoneyBillWave className="w-8 h-8 text-gray-700" />,
      title: "Cash On Delivery",
      description: "From personal packages to business shipments — we deliver on time, every time."
    },
    {
      id: 3,
      icon: <FaWarehouse className="w-8 h-8 text-gray-700" />,
      title: "Delivery Hub",
      description: "From personal packages to business shipments — we deliver on time, every time."
    },
    {
      id: 4,
      icon: <FaBuilding className="w-8 h-8 text-gray-700" />,
      title: "Booking SME & Corporate",
      description: "From personal packages to business shipments — we deliver on time, every time."
    }
  ];

  return (
    <div className=" py-12 sm:py-16 lg:py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className=" mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How it Works
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service) => (
            <div key={service.id} className="group h-full">
              {/* Content Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 h-full flex flex-col min-h-[280px] sm:min-h-[320px]">
                {/* Icon */}
                <div className="mb-4 sm:mb-6">
                  {service.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm sm:text-base text-[#606060] leading-relaxed flex-grow">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;