
import './App.css';
import LoginButton from './components/login/LoginButton';
import LogoutButton from './components/login/LogoutButton';
import Profile from './components/profile/Profile';

function App() {
  return (
    <div className="App">
     <LoginButton />
     <LogoutButton />
     <Profile />
    </div>
  );
}

export default App;
