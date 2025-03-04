// import { useState } from 'react'
import React from 'react'
import ParticlesBg from 'particles-bg'
import './App.css'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <ParticlesBg type="circle" bg={true} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Logo />
        <Navigation />
      </div>
      <Rank />
      <ImageLinkForm />
      {/*<FaceRecognition />*/}
    </>
  )
}

export default App
