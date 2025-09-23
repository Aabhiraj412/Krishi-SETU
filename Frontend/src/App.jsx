import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signin from "./Pages/Signin";
import Chat from "./Pages/Chat";
import Profile from "./Pages/Profile";
// import Profile from "./Pages/Test";
import useStore from "./Store/Store.js";
import { Route, Routes } from "react-router-dom";
import './index.css';

const App = () => {
	const { data } = useStore();

	return (
		<div>
			<Routes>
				<Route path="/" element={data ? <Profile /> : <Home />} />
				<Route path="/login" element={data ? <Profile /> : <Login />} />
				<Route
					path="/signin"
					element={data ? <Profile /> : <Signin />}
				/>
				<Route path="/chat" element={data ? <Chat /> : <Login />} />
				<Route
					path="/profile"
					element={data ? <Profile /> : <Login />}
				/>
			</Routes>
		</div>
	);
};

export default App;
