import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


import { SyncedScriptLogo } from '../assets/images';
import Clients from '../components/Clients';
import CodePlayground from '../components/CodePlayground';
import { clientSocket } from '../services/clientSocket';
import ACTIONS from '../services/Actions'
import { CopyIcon, LeaveIcon } from '../assets/icons';

const Collab = () => {

	const socketRef = useRef(clientSocket);
	const codeRef = useRef(null);
	const location = useLocation();
	const { roomId } = useParams();
	const reactNavigator = useNavigate();

	const [clients, setClients] = useState([]);

	const [sessionTime, setSessionTime] = useState(0);

	const handleErrors = (e) => {
		console.log('socket error', e);
		toast.error('Socket connection error, try again later.')
		reactNavigator('/');
	}

	// Function to format time in HH:mm:ss
	const formatTime = (timeInSeconds) => {
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60);
		const seconds = timeInSeconds % 60;

		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	useEffect(() => {
		if (location.state) {

			// Listen for the beforeunload event
			const handleBeforeUnload = () => {
				socketRef.current.disconnect();
				socketRef.current.removeAllListeners();
				socketRef.current.off(ACTIONS.JOINED);
				socketRef.current.off(ACTIONS.DISCONNECTED);
			};

			// Add the event listener
			// window.addEventListener('beforeunload', handleBeforeUnload);


			// Establish connection with client Socket
			socketRef.current.connect()
			socketRef.current.on('connect_error', (err) => handleErrors(err))
			socketRef.current.on('connect_failed', (err) => handleErrors(err))

			// sending JOIN event to server
			socketRef.current.emit(ACTIONS.JOIN, {
				roomId,
				// getting username from Login Component
				username: location.state?.username,
			});

			// listening for JOINED event from server
			socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
				if (username !== location.state?.username) {
					toast.success(`${username} joined the room`);
				}

				setClients(clients);

				// load current code from previous users to new user on first load
				socketRef.current.emit(ACTIONS.SYNC_CODE, {
					code: codeRef.current,
					socketId,
				});
			});

			// listening for DISCONNECTED event from server
			socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
				toast.success(`${username} left the room`);

				// TODO: Display a pop-up with elapsed session time

				setClients((prev) => (
					prev.filter((client) => client.socketId !== socketId)
				));
			});
		}

		// Start the timer when the component mounts
		const intervalId = setInterval(() => {
			setSessionTime((prevTime) => prevTime + 1);
		}, 1000);

		return () => {
			// Clear the interval when the component unmounts
			clearInterval(intervalId);

			// Clean up the socket connection when the component unmounts
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current.removeAllListeners();
				socketRef.current.off(ACTIONS.JOINED);
				socketRef.current.off(ACTIONS.DISCONNECTED);
			}
		};
	}, [location.state]); // Dependency array ensures useEffect runs after location.state changes

	const handleCopyRoomId = async () => {
		try {
			await navigator.clipboard.writeText(roomId)
			toast.success('RoomId copied to clipboard')
		} catch (error) {
			toast.error('couldn\'d copy RoomId');
			console.log(error);
		}
	}
	const handleLeaveRoom = async () => {
		reactNavigator('/');
		toast.success('You left the room');
	}

	// redirect user if username not found in connecion
	if (!location.state) {
		// console.log(state);
		<Navigate to="/" />
	}

	return (
		<div className="h-screen relative flex overflow-hidden bg-primary text-secondary font-nunito">
			<aside className="px-4 py-4 flex flex-col justify-end items-start">
				<div className="h-full w-[300px]">
					<img
						src={SyncedScriptLogo}
						alt="Synced-Script-logo"
						width={250}
						height="auto"
					/>

					<div className="flex flex-col justify-start items-start my-4">
						<p className="text-lg text-emerald-400 font-bold">Connected.</p>
						<p>
							<span className="font-semibold">Session Time:</span> {formatTime(sessionTime)}
						</p>
						{/* <span className="absolute top-1.5 h-3 w-3 bg-emerald-500 rounded-full"></span> */}
					</div>
					<div className="h-0.5 bg-secondary rounded-full opacity-10 mt-2 mb-3"></div>

					<div className="flex flex-wrap justify-start items-center mx-auto ">
						{clients.map((client) => (
							<Clients
								key={client.socketId}
								username={client.username}
							/>
						))}
					</div>
				</div>
				<div className="w-full gap-x-6 flex justify-between items-center">
					<button
						className="editor-button w-2/5"
						onClick={handleCopyRoomId}>
						Copy Id
						<span className=" opacity-90">
							<img src={CopyIcon} alt="icon" height="auto" width={18} />
						</span>
					</button>
					<button
						className="editor-button flex-1"
						onClick={handleLeaveRoom}>
						Leave Room
						<span className="opacity-90">
							<img src={LeaveIcon} alt="icon" height="auto" width={20} />
						</span>
					</button>
				</div>
			</aside>
			<main className="h-screen w-full bg-slate-600 flex-1 pt-10">

				<CodePlayground
					socketRef={socketRef}
					roomId={roomId}
					onCodeChange={(code) => {
						codeRef.current = code;
					}}
				/>

			</main>
		</div>
	)
}

export default Collab