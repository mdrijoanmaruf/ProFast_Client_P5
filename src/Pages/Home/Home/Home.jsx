import React from 'react'
import Banner from '../Banner/Banner'
import NewBanner from '../Banner/NewBanner'
import HowItWorks from '../HowItWorks/HowItWorks'
import OurServices from '../OurServices/OurServices'
import Companies from '../Companies/Companies'
import Path from '../Path/Path'

const Home = () => {
  return (
    <div>
      <div className='mt-4'>
        {/* <Banner></Banner> */}
        <NewBanner></NewBanner>
        <HowItWorks></HowItWorks>
        <OurServices></OurServices>
        <Companies></Companies>
        <Path></Path>
      </div>
    </div>
  )
}

export default Home