import { React, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


import { JoinIcon, RoomIdIcon, UsernameIcon } from '../assets/icons';

const Login = () => {

	const navigate = useNavigate();

	const [roomId, setRoomId] = useState('')
	const [username, setUsername] = useState('')

	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([])

	// input focusing constants
	const roomIdRef = useRef(null);
	const usernameRef = useRef(null);


	useEffect(() => {
		// Focus on the roomId input when the component mounts
		roomIdRef.current.focus();
	}, []);

	const handleKeyPress = (e) => {
		// Handle "Enter" key press for form submission
		if (e.key === 'Enter') {
			handleNewRoom();
		}
	};

	const handleNewRoom = async (e) => {
		e.preventDefault();

		const newEmptyFields = [];

		if (!roomId) {
			newEmptyFields.push('room-id');
		}
		if (!username) {
			newEmptyFields.push('username');
		}

		setEmptyFields(newEmptyFields);

		if (newEmptyFields.length === 2) {
			setError('Room ID and username cannot be empty');
		} else if (newEmptyFields.length === 1) {
			if (newEmptyFields.includes('room-id')) {
				setError('Room ID is required to join the session');
			} else if (newEmptyFields.includes('username')) {
				setError('Username cannot be empty.');
			}
		} else {
			setError(null);

			navigate(`editor/${roomId}`, {
				state: {
					username,
				}
			})
		}
	};


	const handleGenerateId = (e) => {
		e.preventDefault();

		const id = uuidv4();
		setRoomId(id);
		toast.success('Fresh Room Invitation ID Created!.')

		// Focus on the username input after creating a new roomId
		usernameRef.current.focus();
	}

	const handleInputEnter = (e) => {
		if (e.code === 'Enter') {
			handleNewRoom();
		}
	}

	return (
		<form

			onKeyUp={handleInputEnter}
			onSubmit={handleNewRoom}
			className="flex flex-col w-[350px] text-md py-2 px-4 font-nunito"
		>
			<p className="text-secondary font-semibold">Paste the invitation Room ID to join.</p>
			<label className="form-label m-0">Room Id <span className='text-red-500'>*</span></label>
			<div className={emptyFields.includes('room-id') ? 'input-div error' : 'input-div'}>
				<span className="w-10 h-10 flex justify-center">
					<img
						src={RoomIdIcon}
						alt="icon"
						width={34}
						height="auto"
						className="p-1 rounded-l-md"
					/>
				</span>
				<input
					type="text"
					onChange={(e) => setRoomId(e.target.value)}
					value={roomId}
					placeholder='Room id'
					ref={roomIdRef}
					onKeyUp={handleKeyPress}
				/>
			</div>

			<label className='form-label'>Username <span className='text-red-500'>*</span></label>
			<div className={emptyFields.includes('username') ? 'input-div error' : 'input-div'}>
				<span className="w-10 h-10 flex justify-center">
					<img
						src={UsernameIcon}
						alt="icon"
						width={30}
						height="auto"
						className="p-1 rounded-l-md"
					/>
				</span>
				<input
					type="text"
					onChange={(e) => setUsername(e.target.value)}
					value={username}
					placeholder='Username'
					ref={usernameRef}
					onKeyUp={handleKeyPress}
				/>
			</div>

			<button className="join-btn group relative">
				<span className="group-hover:-translate-x-4 transition-transform duration-200">Join Session</span>

				<span className="ms-5 absolute top-1/2 transform -translate-y-1/2 right-8 opacity-0 group-hover:right-24 group-hover:opacity-100 transition-all duration-200">
					<img
						src={JoinIcon}
						alt="icon"
						height="auto"
						width={22}
					/>
				</span>

			</button>

			{error && <div className="bg-secondary/90 text-red-800 px-2 py-1 rounded-md border border-green">{error}</div>}

			<p className="text-secondary font-semibold mt-2">Generate a

				<a
					onClick={handleGenerateId}
					href='/'
					className="text-yellow/70">&nbsp;
					<span className="underline decoration-wavy decoration-green/80">New Invitation
					</span>&nbsp;
				</a>

				if you haven't received one.</p>
		</form>
	)
}

export default Login