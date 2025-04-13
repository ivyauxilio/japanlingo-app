'use client'
import { useState } from "react";
import signUp from "../firebase/auth/signup";
import { useRouter } from 'next/navigation'

function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter()

    const validatePassword = (password) => {
        return password.length >=12;
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setIsValid(validatePassword(newPassword));
        setError("");
    };

    const handleForm = async (e) => {
        e.preventDefault()

        // try {
        //     if (!isValid) {
        //       throw new Error("Password does not meet the required criteria.");
        //     }
            const { result, error } = await signUp(displayName,email, password);
       
            console.log("Result",result)
            return router.push("/admin")

            if (error) {
                return console.log(error)
            }
          // } catch (err) {
          //   console.log("ERROR", displayName + err)
          //   setError(err.message);
          // }


        // const newPassword = e.target.value;
        // setPassword(newPassword);
        // setIsValid(validatePassword(newPassword));
    }
    return (
    // <div className="wrapper">
    //     <div className="form-wrapper">
    //         <h1 className="mt-60 mb-30">Sign up</h1>
    //         <form onSubmit={handleForm} className="form">
    //             <label htmlFor="email">
    //                 <p>Email</p>
    //                 <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
    //             </label>
    //             <label htmlFor="password">
    //                 <p>Password</p>
    //                 <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
    //             </label>
    //             <button type="submit">Sign up</button>
    //         </form>
    //     </div>
    // </div>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="Your Company"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
        className="mx-auto h-10 w-auto"
      />
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        Sign up to your account
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleForm} className="space-y-6">
        <div>
          <label htmlFor="displayName" className="block text-sm/6 font-medium text-gray-900">Fullname</label>
          <div className="mt-2">
            {/* <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              onChange={(e) => setDisplayName(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            /> */}
              <input
              id="displayName"
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              required
            />

          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
        <div className="relative">
        <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              onChange={handlePasswordChange}
            //   onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-sm text-blue-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className={`text-sm mt-2 ${isValid ? "text-green-600" : "text-red-600"}`}>
              {isValid ? "✅ Password is valid" : "❌ Password must be at least 12 characters"}
            </p>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={!isValid}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm/6 text-gray-500">
        Not a member?{' '}
        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Start a 14 day free trial
        </a>
      </p>
    </div>
  </div>
    );
}

export default Page;