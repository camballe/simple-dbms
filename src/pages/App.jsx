import { useState, useRef, useEffect } from "react";
import user_img from "./../assets/images/user.png";
import "./../styles/App.css";

function App() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user === "projectors" && pwd === "group11@SCS3102") {
      setSuccess(true);
    } else {
      setErrMsg("Incorrect username or password!");
    }
  };

  function handleEnter(event) {
    console.log(event.key);
    if (event.key === "Enter") {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      console.log(index);
      form[index + 1].focus();
      event.preventDefault();
    }
  }
  return (
    <div className="App">
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="http://localhost:5173/dashboard">Go to Dashboard</a>
          </p>
        </section>
      ) : (
        <>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form className="login-form" onSubmit={handleSubmit}>
            <img src={user_img} alt="Login" className="user-img" />

            <div className="form-title">
              <h2>Log In</h2>
            </div>
            <div className="input-box">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                onKeyDown={(e) => handleEnter(e)}
                required
              />
            </div>
            <div className="input-box">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
            </div>
            <button type="submit" className="login-button">
              CONTINUE
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
