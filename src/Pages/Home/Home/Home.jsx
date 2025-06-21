import React from 'react'
import Banner from '../Banner/Banner'
import NewBanner from '../Banner/NewBanner'
import HowItWorks from '../HowItWorks/HowItWorks'
import OurServices from '../OurServices/OurServices'
import Companies from '../Companies/Companies'
import Path from '../Path/Path'
import CustomerSatisfaction from '../CustomerSatisfaction/CustomerSatisfaction'
import FAQ from '../FAQ/FAQ'

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
        <CustomerSatisfaction></CustomerSatisfaction>
        <FAQ></FAQ>
      </div>
    </div>
  )
}

export default Home