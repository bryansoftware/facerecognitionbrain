import React from 'react'
import Tilt from 'react-parallax-tilt';
import logo from './brain.png';
import './Logo.css'

const Logo = () => {
	return (
			<div className='ma2'>
				<Tilt className='shadow-2' style={{ width: '100px', height: '100px' }}>
					<img alt='logo' src={logo} />
				</Tilt>
			</div>
	);
}

export default Logo