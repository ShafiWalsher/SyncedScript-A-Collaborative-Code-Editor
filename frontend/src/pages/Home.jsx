import { SyncedScriptLogo } from '../assets/images';
import Login from '../components/Login';


const Home = () => {


	return (
		<div className="realtive h-screen bg-primary font-nunito py-4 px-20 overflow-hidden">
			<div className="absolute inset-0 h-full">
				<div className="h-5/6 flex justify-center items-center">
					<div
						className="bg-gray-600/20 px-4 py-2 rounded-lg  shadow-lg shadow-green/20 hover:shadow-lg hover:shadow-yellow/10 focus-within:shadow-lg focus-within:shadow-yellow/10 transition-all duration-350">
						<img
							src={SyncedScriptLogo}
							alt="Synced-Script-logo"
							width={250}
							height="auto"
							className='py-2'
						/>
						<Login />
					</div>
				</div >
				<h4 className="text-secondary flex justify-center items-center mt-28">
					Coded with hate 💛 by {`{`} <span>&nbsp;<span className="underline decoration-wavy text-green decoration-yellow/80 italic font-bold">Shafi D.</span>&nbsp;</span> {`}`}
				</h4>
			</div>
		</div>
	)
}

export default Home