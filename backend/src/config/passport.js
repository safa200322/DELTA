const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../db"); // ✅ Import database connection
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // ✅ Ensure this matches Google Console settings
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔍 Received Google Profile:", profile);

        const email = profile.emails[0].value;
        const googleId = profile.id;
        const name = profile.displayName;

        console.log("🔍 Checking if user exists...");
        
        db.query(
          "SELECT * FROM User WHERE GoogleID = ? OR Email = ?",
          [googleId, email],
          (err, results) => {
            if (err) {
              console.error("❌ Database Query Error:", err);
              return done(err, null);
            }

            if (results.length > 0) {
              console.log("✅ Existing User Found:", results[0]);
              return done(null, results[0]); // ✅ User exists, return them
            }

            console.log("⚡ User Not Found, Creating a New One...");

            db.query(
              "INSERT INTO User (Name, Email, GoogleID, PhoneNumber, Password) VALUES (?, ?, ?, ?, NULL)",
              [name, email, googleId, "0000000000"],
              (err, result) => {
                if (err) {
                  console.error("❌ Insert Error:", err);
                  return done(err, null);
                }

                console.log("✅ User Inserted Successfully, ID:", result.insertId);

                const newUser = {
                  UserID: result.insertId,
                  Name: name,
                  Email: email,
                  GoogleID: googleId,
                  PhoneNumber: "0000000000",
                };

                return done(null, newUser);
              }
            );
          }
        );
      } catch (error) {
        console.error("❌ OAuth2 Authentication Error:", error);
        return done(error, null);
      }
    }
  )
);

// ✅ Serialize user (store only UserID in session)
passport.serializeUser((user, done) => {
  console.log("📌 Serializing User:", user);
  done(null, user.UserID);
});

// ✅ Deserialize user (retrieve full user from database)
passport.deserializeUser((id, done) => {
  console.log("🔄 Deserializing User, ID:", id);
  db.query("SELECT * FROM User WHERE UserID = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Deserialization Error:", err);
      return done(err, null);
    }
    console.log("✅ Deserialized User:", results[0]);
    done(null, results[0]);
  });
});

module.exports = passport;
