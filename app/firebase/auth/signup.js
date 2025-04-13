import firebase_app from "../config";
import { createUserWithEmailAndPassword, updateProfile, getAuth } from "firebase/auth";


export default async function signUp(displayName,email, password) {
    const auth = getAuth(firebase_app);
    let result = null,
        error = null;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // const user = userCredential.user;
        console.log("User", displayName)
        // if (user) {
            await updateProfile(auth.currentUser, {
                displayName: displayName, // Ensure correct key
              });

            console.log("User profile updated:");

            // updateProfile(user, { displayName }).then(() => {
            //     user.reload().then(() => {
            //     //   console.log('Profile reloaded');
            //     //   setFirebaseUser(auth.currentUser);
            //     console.log("User profile updated:", user);
            //     });
            //   }).catch((error) => {
            //     console.log(error);
            //   }); 
        // }
        // await updateProfile(userCredential.user, {
        //     displayName: displayName,
        //   });
          console.log("User signed up:");
    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
            console.log("This email is already registered. Try logging in.");
        } else {
            console.log(err);
        }
      }


    return { result, error };
}