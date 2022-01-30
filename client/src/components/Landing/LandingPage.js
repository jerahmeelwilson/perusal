import React from "react";
import { useNavigate } from "react-router-dom";
import bookshelf from "../../images/bookshelf.jpeg"
import './LandingPage.css';
export default function LandingPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) =>{
      e.preventDefault();
      navigate("/register")
  }

  return (
    <div className="landingPage">
     <section>
      <h1>Lets Read!</h1>
      <p>
        Persual is an app that helps you improve your reading skills by providing tools to digitize your personal libary and track how often your read each book. To begin, click the signup button below!
      </p>
      <button onClick={handleSubmit}>Signup</button>
      </section>
      <div>
          <img className="landingImage"src={bookshelf} alt="Bookshelf"/>
      </div>
    </div>
  );
}
