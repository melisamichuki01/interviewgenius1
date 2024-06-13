"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");
    const [sidebarLinks, setSidebarLinks] = useState([]);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout');
            toast.success('Logout successful');
            router.push('/login');
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setData(res.data.data._id);
        // Set the sidebar links based on user details or other criteria
        setSidebarLinks([
            { name: "Profile", href: `/profile/${res.data.data._id}` },
            { name: "Settings", href: "/settings" },
            { name: "Dashboard", href: "/dashboard" },
        ]);
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="flex min-h-screen">
            <div className="bg-gray-800 text-white w-64 p-4">
                <h2 className="text-xl font-bold mb-4">Sidebar</h2>
                <ul>
                    {sidebarLinks.map((link, index) => (
                        <li key={index} className="mb-2">
                            <Link href={link.href} className="hover:text-gray-300">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={logout}
                    className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >Logout</button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 py-2">
                <h1>Profile</h1>
                <hr />
                <p>Profile page</p>
                <h2 className="p-1 rounded bg-green-500">
                    {data === 'nothing' ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}
                </h2>
                <hr />
                <button
                    onClick={getUserDetails}
                    className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >GetUser Details</button>
            </div>
        </div>
    );
}
