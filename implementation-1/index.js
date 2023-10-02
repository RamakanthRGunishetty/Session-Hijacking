const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");

// Set up session middleware
app.use(
  session({
    secret: "secret_key", // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000, // Session timeout in milliseconds (e.g., 60 seconds)
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Function to reset the session timeout
function resetSessionTimeout(req) {
  if (req.session.authenticated) {
    req.session.cookie.expires = new Date(Date.now() + 60000); // Reset session timeout to 60 seconds
    req.session.cookie.maxAge = 60000;
  }
}

// Function to calculate time remaining in seconds
function getTimeRemaining(req) {
  if (req.session.authenticated) {
    const currentTime = new Date().getTime();
    const sessionTimeout = req.session.cookie.expires.getTime();
    console.log(currentTime);
    console.log(sessionTimeout);
    const timeRemaining = Math.max(0, (sessionTimeout - currentTime) / 1000); // in seconds
    return Math.floor(timeRemaining);
  }
  return 0;
}

// Routes
app.get("/", (req, res) => {
  // Check if user is authenticated (session exists)
  if (req.session.authenticated) {
    // Reset session timeout
    // resetSessionTimeout(req);
    res.send(`<p>Welcome, User! Your Session ID: ${req.session.sessionId}</p>
    <p>Time remaining: ${getTimeRemaining(req)} seconds</p>
            <p><a href="/reinitiate-session">Click here to reinitiate your session</a></p>`);
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  if (req.session.authenticated) {
    // Session has timed out, ask if user wants to reinitiate the session
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/login.html");
  }
});

app.get("/reinitiate-session", (req, res) => {
  // Create a new session ID and reinitiate the session
  req.session.sessionId = generateSessionId();
  req.session.authenticated = true;
  // Reset session timeout
  resetSessionTimeout(req);
  res.redirect("/");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simulate user authentication (in a real app, you'd check credentials)
  if (username === "admin" && password === "admin") {
    // Create a session ID
    req.session.sessionId = generateSessionId();
    // Simulate successful authentication
    req.session.authenticated = true;
    // Reset session timeout
    resetSessionTimeout(req);
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  // Destroy the session (logout)
  req.session.destroy();
  res.redirect("/login");
});

// Generate a random session ID
function generateSessionId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let sessionId = "";
  for (let i = 0; i < 32; i++) {
    sessionId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return sessionId;
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
