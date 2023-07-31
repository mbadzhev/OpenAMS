import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();

  function handleSignIn() {
    setLoading(true); // Set loading to true when starting the sign-in process
    setError(null); // Clear any previous errors

    // Use Firebase's signInWithEmailAndPassword method to sign in the user
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        // You don't need to fetch user data here since it's handled in the App component
        // The App component will automatically redirect to the appropriate dashboard based on user role
        setLoading(false); // Set loading to false to stop the loading state
      })
      .catch((error) => {
        // Handle sign-in errors
        const errorMessage = error.message;
        setError(errorMessage);
        setLoading(false); // Set loading to false to stop the loading state
      });
  }

  return (
    <>
      {loading && <h1>Loading...</h1>}
      {error && <h1>{`Error: ${error}`}</h1>}
      {!loading && !error && (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign In</button>
        </>
      )}
    </>
  );
}

export default Login;
