import React from 'react'
import Banner from '../Banner/Banner'
import NewBanner from '../Banner/NewBanner'

const Home = () => {
  return (
    <div>
      <div className='mt-4'>
        {/* <Banner></Banner> */}
        <NewBanner></NewBanner>
      </div>
    </div>
  )
}

export default Home