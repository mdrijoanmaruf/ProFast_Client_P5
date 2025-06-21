import React, { useState } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqData = [
    {
      id: 1,
      question: "How does ProFast delivery service work?",
      answer: "ProFast provides fast and reliable delivery services across Bangladesh. Simply place your order, and we'll pick up your parcel and deliver it to the destination within 24-72 hours depending on the location."
    },
    {
      id: 2,
      question: "What are your delivery charges?",
      answer: "Our delivery charges are competitive and depend on the weight, size, and destination of your parcel. We offer the lowest rates in the market while maintaining the highest quality service."
    },
    {
      id: 3,
      question: "Do you provide cash on delivery service?",
      answer: "Yes, we provide 100% cash on delivery service anywhere in Bangladesh with guaranteed safety of your product. We collect payment from customers and transfer it to merchants securely."
    },
    {
      id: 4,
      question: "How can I track my parcel?",
      answer: "You can track your parcel in real-time using our live tracking system. We provide instant status updates from pick-up to delivery, so you always know where your parcel is."
    },
    {
      id: 5,
      question: "What areas do you cover?",
      answer: "We deliver parcels nationwide with coverage in every district of Bangladesh. Express delivery is available in major cities like Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi."
    },
    {
      id: 6,
      question: "How do I become a merchant with ProFast?",
      answer: "Becoming a merchant is easy! Simply contact our support team or visit our website to register. We'll guide you through the process and help you start using our delivery services for your business."
    },
    {
      id: 7,
      question: "What is your return policy?",
      answer: "We offer reverse logistics facility that allows end customers to return or exchange their products with online business merchants. This service helps maintain customer satisfaction and business growth."
    },
    {
      id: 8,
      question: "Do you provide customer support?",
      answer: "Yes, we have 24/7 customer support available. Our dedicated support team is ready to assist you with any questions, updates, or delivery concerns anytime you need help."
    }
  ]

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div data-aos="fade-up" className="my-12 sm:py-16 lg:py-20 bg-gray-50 rounded-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-[#03373D] mb-4 sm:mb-6">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-gray-600 text-base sm:text-lg  max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about ProFast delivery services. Can't find what you're looking for? Contact our support team for assistance.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-1">
            {faqData.map((faq, index) => (
              <div
                key={faq.id}
                className={`border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? 'bg-[#E6F2F3] shadow-lg' : 'bg-white hover:shadow-md'
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#03373D] focus:ring-opacity-20 transition-all duration-200"
                >
                  <h3 className={`text-base sm:text-lg lg:text-xl font-semibold pr-4 ${
                    activeIndex === index ? 'text-[#03373D]' : 'text-gray-800'
                  }`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? 'bg-[#03373D] text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activeIndex === index ? (
                      <FaMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>
                </button>

                {/* Answer */}
                {activeIndex === index && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#03373D] mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 text-base sm:text-lg mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#CAEB66] text-[#03373D] px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg">
                Contact Support
              </button>
              <button className="border-2 border-[#CAEB66] text-[#CAEB66] px-8 py-4 rounded-full font-semibold hover:bg-[#CAEB66] hover:text-[#03373D] transition-all duration-300">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ