import React, { memo, useState } from 'react';

const EditTweetForm = memo((tweet, onUpdate, onClose) => {
	const [text, setText] = useState(tweet.text);

	const onSubmit = async (event) => {
		event.preventDefault();
		onUpdate(tweet.id, text);
		onClose();
	};

	const onChange = (event) => {
		setText(event.target.value);
	};

	return (
		<form onSubmit={onSubmit} className="edit-tweet-form">
			<input
				type="text"
				placeholder="Edit your tweet"
				value={text}
				required
				autoFocus
				onChange={onChange}
				className="form-input tweet-input"
			/>
			<div className="edit-tweet-form-action">
				<button type="submit" className="form-btn-update">
					Update
				</button>
				<button type="button" className="form-btn-cancel" onClick={onClose}>
					Cancel
				</button>
			</div>
		</form>
	);
});

export default EditTweetForm;
