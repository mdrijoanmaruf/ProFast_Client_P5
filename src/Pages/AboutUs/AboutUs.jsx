import React from 'react';

const AboutUs = () => {
  const stats = [
    { number: "50K+", label: "Happy Customers", icon: "👥" },
    { number: "100+", label: "Cities Covered", icon: "🏙️" },
    { number: "99.9%", label: "Delivery Success", icon: "✅" },
    { number: "24/7", label: "Customer Support", icon: "🕒" }
  ];

  const values = [
    {
      icon: "⚡",
      title: "Speed & Efficiency",
      description: "We prioritize fast delivery without compromising on safety and quality of service."
    },
    {
      icon: "🛡️",
      title: "Trust & Security",
      description: "Your packages are insured and handled with utmost care by our professional team."
    },
    {
      icon: "🌍",
      title: "Wide Coverage",
      description: "Extensive network covering major cities with plans for continuous expansion."
    },
    {
      icon: "💡",
      title: "Innovation",
      description: "Leveraging latest technology for real-time tracking and seamless user experience."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 my-4 rounded-2xl">
      {/* Hero Section */}
      <section data-aos="fade-down" data-aos-duration="1000" className="bg-[#CAEB66] text-gray-900 py-16 lg:py-24 rounded-t-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000" className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              About <span className="text-teal-600">ProFast</span>
            </h1>
            <p data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000" className="text-lg sm:text-xl lg:text-2xl text-gray-800 leading-relaxed">
              Revolutionizing delivery services with speed, reliability, and innovation. 
              We're committed to connecting people and businesses through seamless logistics solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-aos="fade-up" data-aos-duration="800" className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                data-aos="zoom-in" 
                data-aos-delay={`${index * 100}`}
                data-aos-duration="600"
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section data-aos="fade-up" data-aos-duration="1000" className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="200">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
                <p data-aos="fade-up" data-aos-delay="300" data-aos-duration="600">
                  Founded in 2020, ProFast emerged from a simple vision: to make delivery 
                  services faster, more reliable, and accessible to everyone. What started 
                  as a small local delivery service has grown into a comprehensive logistics 
                  platform serving thousands of customers daily.
                </p>
                <p data-aos="fade-up" data-aos-delay="400" data-aos-duration="600">
                  Our journey began when our founder, Sarah Johnson, experienced the 
                  frustration of unreliable delivery services firsthand. Determined to 
                  create a better solution, she assembled a team of logistics experts and 
                  technology innovators to build ProFast from the ground up.
                </p>
                <p data-aos="fade-up" data-aos-delay="500" data-aos-duration="600">
                  Today, we're proud to be one of the fastest-growing delivery services 
                  in the region, with a commitment to sustainability, innovation, and 
                  exceptional customer service that drives everything we do.
                </p>
              </div>
            </div>
            <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="400" className="relative">
              <div className="bg-[#CAEB66] rounded-2xl p-8 text-gray-900">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg leading-relaxed">
                  "To connect communities through reliable, fast, and sustainable 
                  delivery solutions that enhance everyday life and support local businesses."
                </p>
              </div>
              <div 
                data-aos="zoom-in" 
                data-aos-delay="800" 
                data-aos-duration="600"
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center text-4xl"
              >
                🚀
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section data-aos="fade-up" data-aos-duration="1000" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div data-aos="fade-down" data-aos-duration="800" className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide every decision we make and every service we provide
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                data-aos="flip-up" 
                data-aos-delay={`${index * 150}`}
                data-aos-duration="800"
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="text-4xl sm:text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-aos="fade-up" data-aos-duration="1000" className="py-16 lg:py-24 bg-[#CAEB66] rounded-b-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 data-aos="fade-down" data-aos-delay="200" data-aos-duration="800" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Experience ProFast?
          </h2>
          <p data-aos="fade-up" data-aos-delay="400" data-aos-duration="800" className="text-lg sm:text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ProFast for their delivery needs
          </p>
          <div data-aos="zoom-in" data-aos-delay="600" data-aos-duration="800" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Send Your First Package
            </button>
            <button className="bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;