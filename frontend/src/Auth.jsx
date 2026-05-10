import { useState } from 'react';
import { auth, googleProvider, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save user profile to Firestore (including password for educational purposes)
        await setDoc(doc(db, "users", user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password, // Added for educational purposes
          createdAt: new Date().toISOString()
        });
      }
      onLogin(); // Proceed to dashboard after successful auth
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      // If it's a new user, save their profile
      if (!userDocSnap.exists()) {
        const nameParts = user.displayName ? user.displayName.split(' ') : ["User", ""];
        await setDoc(userDocRef, {
          firstName: nameParts[0] || "User",
          lastName: nameParts.slice(1).join(' ') || "",
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }
      
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#164E3E] flex items-center justify-center p-5 font-['Inter']">
      <div className="flex flex-col lg:flex-row w-full max-w-[1200px] bg-white rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.3)] min-h-auto lg:min-h-[700px]">
        
        {/* Image Side */}
        <div className="flex-1 relative overflow-hidden min-h-[250px] lg:min-h-[600px]">
          <div className="absolute top-5 left-6 lg:top-8 lg:left-10 text-2xl font-bold text-white z-10">Travels</div>
          <img 
            src={isLogin 
              ? "https://image.qwenlm.ai/public_source/2172740d-97eb-4f44-9581-eff996332031/157c7301e-fa34-4d27-98ae-f54bfcc5b189.png" 
              : "https://image.qwenlm.ai/public_source/2172740d-97eb-4f44-9581-eff996332031/1ce9f2d8b-6379-40b8-b5b9-dd6cb1cb48f0.png"} 
            alt="Background" 
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 lg:p-10 flex flex-col justify-end text-white">
            <h2 className="text-[22px] lg:text-[28px] font-bold mb-3">
              {isLogin ? "Welcome back!" : "Create Your Account Now!"}
            </h2>
            <p className="text-[13px] lg:text-sm leading-relaxed opacity-90 max-w-[400px] mb-12 lg:mb-0">
              {isLogin 
                ? "Log in to your account to manage your bookings, preferences, and more." 
                : "By creating an account, you'll enjoy personalized travel recommendations, faster bookings, and exclusive offers."}
            </p>
          </div>
          <div className="absolute bottom-5 left-6 right-6 lg:bottom-5 lg:left-10 lg:right-10 flex flex-col lg:flex-row justify-between lg:items-center text-xs text-white/80 gap-2 lg:gap-0">
            <span>Vlatio 2024. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 p-8 lg:p-[60px_50px] flex flex-col justify-center">
          <h1 className="text-[22px] font-bold mb-2 text-center text-gray-900">
            {isLogin ? "Login Now!" : "Register Now!"}
          </h1>
          <p className="text-[13px] text-gray-500 text-center mb-8">
            {isLogin ? "Welcome back! Please enter your details." : "Register now to start your journey!"}
          </p>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="flex flex-col lg:flex-row gap-4 mb-5">
                <div className="flex-1">
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Jonathan" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                    className="w-full p-3.5 bg-[#F3F5F9] border-none rounded-lg text-sm focus:outline-none focus:bg-[#E8EBF0] transition-colors" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                    className="w-full p-3.5 bg-[#F3F5F9] border-none rounded-lg text-sm focus:outline-none focus:bg-[#E8EBF0] transition-colors" 
                  />
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-[13px] font-medium text-gray-800 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="jonathan_doe@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3.5 bg-[#F3F5F9] border-none rounded-lg text-sm focus:outline-none focus:bg-[#E8EBF0] transition-colors" 
              />
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-medium text-gray-800 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="•••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3.5 pr-12 bg-[#F3F5F9] border-none rounded-lg text-sm focus:outline-none focus:bg-[#E8EBF0] transition-colors" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-base"
                >
                  <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-5 text-[13px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-500 cursor-pointer" />
                <span className="text-gray-600">
                  {isLogin ? "Remember me" : "I agree to Terms & Privacy Policy"}
                </span>
              </label>
              {isLogin && <a href="#" className="text-gray-800 font-semibold hover:text-blue-500 transition-colors">Forgot password?</a>}
            </div>

            <button type="submit" className="w-full p-3.5 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors">
              {isLogin ? "Log In" : "Sign Up"} <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>

            <div className="flex items-center my-5 text-gray-400 text-[13px]">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 mb-5">
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="flex-1 p-3 border border-gray-200 rounded-lg bg-white flex items-center justify-center gap-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <i className="fa-brands fa-google text-[#DB4437] text-lg"></i> Google
              </button>
              <button type="button" className="flex-1 p-3 border border-gray-200 rounded-lg bg-white flex items-center justify-center gap-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <i className="fa-brands fa-facebook-f text-[#1877F2] text-lg"></i>
              </button>
              <button type="button" className="flex-1 p-3 border border-gray-200 rounded-lg bg-white flex items-center justify-center gap-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <i className="fa-brands fa-x-twitter text-black text-lg"></i>
              </button>
            </div>

            <p className="text-center text-[13px] text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-gray-900 font-semibold hover:text-blue-500 transition-colors">
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
