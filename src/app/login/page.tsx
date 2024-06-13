"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";


export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error:any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen py-2"
            style={{
                background: "linear-gradient(to right,#9c59f6,  #4b7bf6)" // Adjusted the blue to a lighter shade
            }}>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full flex">
                <div className="w-1/2 flex justify-center items-center">
                    <img src="/login.png" alt="Login Image" className="h-64"/>
                </div>
                <div className="w-1/2 p-4 ml-4"> {/* Added margin-left to create spacing */}
                    <h1 className="text-left text-black text-2xl font-bold mb-6">Hey there,welcome Back</h1>
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-gray-600 text-black"
                        id="email"
                        type="text"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        placeholder="Email"
                    />
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-gray-600 text-black"
                        id="password"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({...user, password: e.target.value})}
                        placeholder="Password"
                    />
                    <button
                        onClick={onLogin}
                        className="bg-blue-500 text-white p-2 rounded-lg mb-4 w-full focus:outline-none hover:bg-blue-600 transition duration-300"
                        disabled={buttonDisabled}>
                        {loading ? "Processing..." : "Submit"}
                    </button>
                    <div className="text-center">
                        <Link href="/signup">
                            <span className="text-blue-500 hover:underline">Create your Account</span>
                        </Link>
                        <br />
                        <Link href="/forgot-password">
                            <span className="text-blue-500 hover:underline">Forgot Username / Password?</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
