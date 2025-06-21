import React from 'react'
import Banner from '../Banner/Banner'
import NewBanner from '../Banner/NewBanner'
import HowItWorks from '../HowItWorks/HowItWorks'

const Home = () => {
  return (
    <div>
      <div className='mt-4'>
        {/* <Banner></Banner> */}
        <NewBanner></NewBanner>
        <HowItWorks></HowItWorks>
      </div>
    </div>
  )
}

export default Home