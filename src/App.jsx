import React, { useState, useEffect } from 'react'
import './App.css'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'

function App() {
  const [userInput, setUserInput] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [box, setBox] = useState({
    // topRow: 0,
    // leftCol: 0,
    // bottomRow: 0,
    // rightCol: 0
  });
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }) 
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
        setIsSignedIn(false);
        setUserInput(null);
        setImageUrl(null);
        setBox({});
        setRoute('signin');
        setUser({
          id: '',
          name: '',
          email: '',
          password: '',
          entries: 0,
          joined: ''
        })
    } else if (route === 'home') {
        setIsSignedIn(true);
    }
    setRoute(route);
  }

  const onInputChange = (event) => {
    setUserInput(event.target.value);
  }

  const onSubmitButtonClicked = () => {
    setImageUrl(userInput);   // REDUNDANT ??

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        imageUrl: userInput
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('*****************************************')
        console.log('response in App.jsx: ', data)
        
        if (data) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              setUser(Object.assign(user, { entries: count }))
            })
            .catch(error => {console.log('/image route fetch error, ', error)})
        }
        
        setBox(calculateFaceLocation(data))
        console.log('box: ', box)
        // displayFaceBox(calculateFaceLocation(data))  // REDUNDANT ??
// {
        // displayFaceBox(calculateFaceLocation(data))

        // const regions = response.outputs[0].data.regions;

        // regions.forEach(region => {
        //   // Accessing and rounding the bounding box values
        //   const boundingBox = region.region_info.bounding_box;
        //   const topRow = boundingBox.top_row.toFixed(3);
        //   const leftCol = boundingBox.left_col.toFixed(3);
        //   const bottomRow = boundingBox.bottom_row.toFixed(3);
        //   const rightCol = boundingBox.right_col.toFixed(3);

        //   region.data.concepts.forEach(concept => {
        //     // Accessing and rounding the concept value
        //     const name = concept.name;
        //     const value = concept.value.toFixed(4);

        //     console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);                
        //     displayFaceBox(calculateFaceLocation(topRow, leftCol, bottomRow, rightCol));
        //   });
        // })
        // .catch(console.log)
// }
      })
     .catch(error => {console.log('Clarifai API fetch error', error)})
  }

// {
  // const calculateFaceLocation = (topRow, leftCol, bottomRow, rightCol) => {
  //   const image = document.getElementById('inputimage');
  //   const width = Number(image.width);
  //   const height = Number(image.height);
  //   return {
  //     toprow: topRow * height,
  //     leftcol: leftCol * width,
  //     rightcol: width - (rightCol * width),
  //     bottomrow: height - (bottomRow * height)
  //   }
  // }
// }

  const calculateFaceLocation = (faceData) => {
    const clarifaiFace = faceData.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    console.log('clarifai face (in calculateFaceLocation()): ', clarifaiFace);
    console.log('height: ', height)
    console.log('width: ', width)
    console.log('topRow: ', clarifaiFace.top_row * height)
    console.log('leftCol: ', clarifaiFace.left_col * width)
    console.log('bottomRow: ', height - (clarifaiFace.bottom_row * height))
    console.log('rightCol: ', width - (clarifaiFace.right_col * width))

    return {
      topRow: clarifaiFace.top_row * height,
      leftCol: clarifaiFace.left_col * width,
      bottomRow: height - (clarifaiFace.bottom_row * height),
      rightCol: width - (clarifaiFace.right_col * width)  
    }
  }


  // REDUNDANT ??
  // const displayFaceBox = (box) => {
  //   setBox(box);
  // }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Logo />
        <Navigation 
          onRouteChange={onRouteChange} 
          isSignedIn={isSignedIn} 
        />
      </div>


      {route === 'home' 
        ? <div>
            <Rank 
              userName={user.name} 
              userEntries={user.entries} 
            />
            <ImageLinkForm 
              onInputChange={onInputChange} 
              onSubmitButtonClicked={onSubmitButtonClicked} 
              />
            <FaceRecognition 
              box={box} 
              userInput={userInput}
              // imageUrl={imageUrl} 
            />
          </div>

        : ( 
            route === 'signin' || route === 'signout'
              ? <Signin 
                  route={route}
                  loadUser={loadUser} 
                  onRouteChange={onRouteChange} 
                />
              : <Register 
                  route={route}
                  loadUser={loadUser} 
                  onRouteChange={onRouteChange} 
                />
          )
      }            
    </>
  )
}

export default App
