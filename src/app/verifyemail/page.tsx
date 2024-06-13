"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {

    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token })
            setVerified(true);
        } catch (error: any) {
            setError(true);
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex items-center justify-center min-h-screen py-2"
            style={{
                background: "linear-gradient(to right, #9c59f6, #4b7bf6)" // Adjusted the blue to a lighter shade
            }}>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-black text-4xl font-bold mb-6">Verify Email</h1>
                <h2 className="p-2 bg-blue-500 text-white rounded-lg mb-6">{token ? `${token}` : "No token"}</h2>

                {verified && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Email Verified</h2>
                        <Link href="/login">
                            <a className="text-blue-500 hover:underline">Login</a>
                        </Link>
                    </div>
                )}
                {error && (
                    <div>
                        <h2 className="text-2xl bg-red-500 text-black p-2 rounded-lg">Error</h2>
                    </div>
                )}
            </div>
        </div>
    )
}
