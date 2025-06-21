import React from 'react'
// Try importing differently
import bg from '../../../assets/customer.png'

const CustomerSatisfaction = () => {
  return (
    <div data-aos="fade-up"
      className="relative bg-cover bg-center bg-no-repeat mt-6 flex items-center rounded-2xl"
      style={{ 
        backgroundImage: `url("${bg}")`,
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Content */}
      <div className="relative z-10 w-full p-8 sm:p-12 lg:p-20 xl:p-[80px]">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Merchant and Customer Satisfaction <br /> is Our First Priority
          </h1>
          
          <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 lg:mb-12 leading-relaxed max-w-3xl">
            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button className="bg-[#CAEB66] text-[#03373D] px-8 py-4 rounded-full font-semibold text-sm sm:text-base hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg">
              Become a Merchant
            </button>
            <button className="text-[#CAEB66] border-2 border-[#CAEB66] px-8 py-4 rounded-full font-semibold text-sm sm:text-base hover:bg-[#CAEB66] hover:text-[#03373D] transition-all duration-300">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSatisfaction