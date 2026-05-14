import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Feature'
import Footer from '../components/Footer'
import CTA from '../components/CTA'

const LandingPage = () => {
  return (
    <>
    <Navbar />
    <Hero />
    <Features/>
    <CTA/>
    <Footer/>
    </>
  )
}

export default LandingPage