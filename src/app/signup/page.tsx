"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            toast.success("Signup success");
            router.push("/login");
        } catch (error: any) {
            console.log("Signup failed", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen py-2"
            style={{
                background: "linear-gradient(to right, #9c59f6, #4b7bf6)" // Adjusted the blue to a lighter shade
            }}>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full flex">
                <div className="w-1/2 flex justify-center items-center">
                    <img src="/login.png" alt="Signup Image" className="h-64" />
                </div>
                <div className="w-1/2 p-4 ml-4">
                    <h1 className="text-center text-2xl font-bold mb-2">Join Us</h1>
                    <h2 className="text-center text-xl font-bold mb-6">{loading ? "Processing" : "Signup"}</h2>
                    <label htmlFor="username" className="block text-gray-700">Username</label>
                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-gray-600 text-black"
                        id="username"
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        placeholder="Username"
                    />
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-gray-600 text-black"
                        id="email"
                        type="text"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Email"
                    />
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-gray-600 text-black"
                        id="password"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Password"
                    />
                    <button
                        onClick={onSignup}
                        className="bg-blue-500 text-white p-2 rounded-lg mb-4 w-full focus:outline-none hover:bg-blue-600 transition duration-300"
                        disabled={buttonDisabled}>
                        {buttonDisabled ? "No Signup" : "Signup"}
                    </button>
                    <div className="text-center">
                        <Link href="/login">
                            <span className="text-blue-500 hover:underline">Already have an account </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
