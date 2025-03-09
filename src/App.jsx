import { useState } from 'react'
import React from 'react'
import ParticlesBg from 'particles-bg'
import './App.css'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'


function App() {
  const [userInput, setUserInput] = useState('');
  const [imageUrl, setImageUrl] = useState();
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Your PAT (Personal Access Token) can be found in the Account's Security section
  const PAT = '9887763b45584ba8a8bd63080d35e33c';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'clarifai';
  const APP_ID = 'main';
  const MODEL_ID = 'face-detection';
  // const MODEL_ID = 'color-recognition';
  // const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
  const IMAGE_URL = imageUrl;

  const onRouteChange = (route) => {
    if (route === 'signout') {
        setIsSignedIn(false);
    } else if (route === 'home') {
        setIsSignedIn(true);
    }
    setRoute(route);
  }

  const onInputChange = (event) => {
    setUserInput(event.target.value);
  }

  const onSubmitButtonClicked = () => {
    console.log('click');
    setImageUrl(userInput);

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": IMAGE_URL
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT,
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE'
      },
      body: raw
    };

    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
    fetch("http://cors-anywhere.herokuapp.com/https://api.clarifai.com/v2/models/"
          + MODEL_ID 
          + "/outputs", requestOptions) 
      .then(response => response.json())
      .then(result => { 
        console.log(result)
        const regions = result.outputs[0].data.regions;

        regions.forEach(region => {
          // Accessing and rounding the bounding box values
          const boundingBox = region.region_info.bounding_box;
          const topRow = boundingBox.top_row.toFixed(3);
          const leftCol = boundingBox.left_col.toFixed(3);
          const bottomRow = boundingBox.bottom_row.toFixed(3);
          const rightCol = boundingBox.right_col.toFixed(3);

          region.data.concepts.forEach(concept => {
            // Accessing and rounding the concept value
            const name = concept.name;
            const value = concept.value.toFixed(4);

            console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);                
            displayFaceBox(calculateFaceLocation(topRow, leftCol, bottomRow, rightCol));
          });
        });
      })
    .catch(error => {console.log('error', error)});
  }

  const calculateFaceLocation = (topRow, leftCol, bottomRow, rightCol) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      toprow: topRow * height,
      leftcol: leftCol * width,
      rightcol: width - (rightCol * width),
      bottomrow: height - (bottomRow * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box);
  }

  return (
    <>
      {/*<ParticlesBg type="circle" bg={true} />*/}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Logo />
        <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      </div>

      {route === 'home' 
        ? <div>
            <Rank />
            <ImageLinkForm onInputChange={onInputChange} onSubmitButtonClicked={onSubmitButtonClicked}/>
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>

        : ( 
            route === 'signin' 
              ? <Signin onRouteChange={onRouteChange}/>
              : <Register onRouteChange={onRouteChange}/>
          )
      }            
    </>
  )
}

export default App
