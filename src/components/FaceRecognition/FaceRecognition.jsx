import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ box, userInput }) => {
	return (
		<>
			{console.log('within FaceRecognition component: ', box)}
			<div className='center ma'>
				<div className='absolute mt2'>
					<img id='inputimage' alt='' src={userInput} width='500px' height='auto' />
					<div className='bounding-box' style={{ top: box.topRow, left: box.leftCol, bottom: box.bottomRow, right: box.rightCol }}></div>
					{/*<div className='bounding-box' style={{ top: "208px", left: "100px", bottom: "128px", right: "90px" }}></div>*/}
				</div>
			</div>
		</>
	);
}

export default FaceRecognition