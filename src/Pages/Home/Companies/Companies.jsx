import React from 'react'
import Marquee from 'react-fast-marquee'
import amazon from '../../../assets/brands/amazon_vector.png'
import casio from '../../../assets/brands/casio.png'
import moonstar from '../../../assets/brands/moonstar.png'
import randstad from '../../../assets/brands/randstad.png'
import star from '../../../assets/brands/start.png'
import starPeople from '../../../assets/brands/start-people 1.png'

const Companies = () => {
  const brands = [
    { id: 1, name: 'Amazon', logo: amazon },
    { id: 2, name: 'Casio', logo: casio },
    { id: 3, name: 'Moonstar', logo: moonstar },
    { id: 4, name: 'Randstad', logo: randstad },
    { id: 5, name: 'Star', logo: star },
    { id: 6, name: 'Star People', logo: starPeople },
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-gray-50 my-12 rounded-2xl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            We've helped thousands of sales teams
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Trusted by leading companies worldwide for reliable delivery solutions
          </p>
        </div>

        {/* First Marquee - Left to Right */}
        <div className="mb-6">
          <Marquee 
            speed={50} 
            direction="left" 
            pauseOnHover={true}
            gradient={true}
            gradientColor={[248, 250, 252]}
            gradientWidth={100}
          >
            {brands.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex items-center justify-center w-32 sm:w-40 lg:w-48 h-16 sm:h-20 lg:h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 mx-4 p-3 sm:p-4 group cursor-pointer"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                />
              </div>
            ))}
          </Marquee>
        </div>

        {/* Second Marquee - Right to Left */}
        <div>
          <Marquee 
            speed={40} 
            direction="right" 
            pauseOnHover={true}
            gradient={true}
            gradientColor={[248, 250, 252]}
            gradientWidth={100}
          >
            {brands.map((brand, index) => (
              <div
                key={`reverse-${brand.id}-${index}`}
                className="flex items-center justify-center w-32 sm:w-40 lg:w-48 h-16 sm:h-20 lg:h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 mx-4 p-3 sm:p-4 group cursor-pointer"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  )
}

export default Companies