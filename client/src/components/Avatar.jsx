import React, { memo } from 'react';

const Avatar = memo(({ img_url, name }) => (
	<div>
		{!!img_url ? (
			<img src={img_url} alt="avatar" className="avatar-img" />
		) : (
			<div className="avatar-txt">{name.charAt(0)}</div>
		)}
	</div>
));

export default Avatar;
