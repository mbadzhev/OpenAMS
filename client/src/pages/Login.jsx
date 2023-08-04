import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
      {loading && <h1 className="pb-3 text-center">Loading...</h1>}
      {error && <h1 className="pb-3 text-center">{`Error: ${error}`}</h1>}
      {!loading && !error && (
        <Container>
          <Row className="my-lg-4">
            <Col lg={4} xs={12}></Col>
            <Col lg={4} xs={12} className="bg-component py-3 rounded">
              <h1 className="pb-3 text-center">OpenAMS Login</h1>
              <Form>
                <div className="d-grid gap-2">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />

                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="mb-4"
                  />

                  <Button
                    variant="primary"
                    onClick={handleSignIn}
                    type="submit"
                  >
                    Log in
                  </Button>
                </div>
              </Form>
            </Col>
            <Col lg={4} xs={12}></Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Login;
