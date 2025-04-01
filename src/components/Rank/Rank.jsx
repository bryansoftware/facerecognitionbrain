import React from 'react'

const Rank = ({ userName, userEntries }) => {
	return (
		<>
			<div className='white f3 center'>
				{`${userName}, your current entry count is...`}
			</div>
			<div className='white f1 center'>
				{userEntries}
			</div>
		</>
	);
}

export default Rank