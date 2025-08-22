"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

interface NextAuthLoginFormProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function NextAuthLoginForm({ onSuccess, onError }: NextAuthLoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false
            });

            if (result?.error) {
                onError?.(result.error);
                return;
            }

            if (result?.ok) {
                onSuccess?.();
                router.push("/my-profile");
            }
        } catch (error) {
            onError?.(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                    Email
                </label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Enter your email'
                />
            </div>

            <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                    Password
                </label>
                <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Enter your password'
                />
            </div>

            <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {isLoading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    );
}
