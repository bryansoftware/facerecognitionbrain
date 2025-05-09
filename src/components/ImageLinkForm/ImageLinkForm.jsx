import React from 'react'
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onSubmitButtonClicked}) => {
	return (
		<div style={{ padding: "3em" }}>
			<p className='center'>
				{'This Magic Brain will detect faces in your pictures.  Give it a try.'}
			</p>
			<div className='center form pa4 br3 shadow-5'>
				<input className='f4 pa2 w-70' onChange={onInputChange} type='text' />
				<button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onSubmitButtonClicked}>
					Detect
				</button>
			</div>
		</div>
	);
}

export default ImageLinkForm