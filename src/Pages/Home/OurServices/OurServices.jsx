import React from 'react';
import { FaTruck, FaGlobe, FaCogs, FaMoneyBillWave, FaBuilding, FaUndo } from 'react-icons/fa';

const OurServices = () => {
  const services = [
    {
      id: 1,
      icon: <FaTruck className="w-12 h-12 text-teal-600" />,
      title: "Express & Standard Delivery",
      description: "We deliver parcels within 24-72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4-6 hours from pick-up to drop-off.",
      highlighted: false
    },
    {
      id: 2,
      icon: <FaGlobe className="w-12 h-12 text-teal-600" />,
      title: "Nationwide Delivery",
      description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48-72 hours.",
      highlighted: true
    },
    {
      id: 3,
      icon: <FaCogs className="w-12 h-12 text-teal-600" />,
      title: "Fulfillment Solution",
      description: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
      highlighted: false
    },
    {
      id: 4,
      icon: <FaMoneyBillWave className="w-12 h-12 text-teal-600" />,
      title: "Cash on Home Delivery",
      description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
      highlighted: false
    },
    {
      id: 5,
      icon: <FaBuilding className="w-12 h-12 text-teal-600" />,
      title: "Corporate Service / Contract In Logistics",
      description: "Customized corporate services which includes warehouse and inventory management support.",
      highlighted: false
    },
    {
      id: 6,
      icon: <FaUndo className="w-12 h-12 text-teal-600" />,
      title: "Parcel Return",
      description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
      highlighted: false
    }
  ];

  return (
    <div className="">
      <div className="">
        <div className="rounded-2xl sm:rounded-3xl bg-[#03373D] py-8 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-12">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            {/* Icon */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-blue-500 rounded-lg p-2 sm:p-3">
                <FaTruck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-6">
              Our Services
            </h2>
            
            {/* Description */}
            <p className="text-[#DADADA] text-sm sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
              Enjoy fast, reliably parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white text-[#03373D] rounded-xl sm:rounded-2xl lg:rounded-3xl py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-8 transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-[#CAEB66] group"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 rounded-full bg-gray-100 group-hover:bg-white group-hover:bg-opacity-20">
                    {React.cloneElement(service.icon, {
                      className: "w-6 h-6 sm:w-8 sm:h-8 text-teal-600"
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-[#03373D] leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-[#606060] group-hover:text-[#03373D] group-hover:text-opacity-80">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;