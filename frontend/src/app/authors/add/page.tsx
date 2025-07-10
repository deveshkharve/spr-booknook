"use client"
import AuthorForm from "@/app/components/AuthorForm";
import { BASE_URL, getAuthToken } from "@/app/configs";
import Link from "next/link";

export default function AuthorsPage() {

    const submitForm = async (data: unknown) => {
        try {
            // If data is a plain object, convert to FormData
            
            const headers: Record<string, string> = {
                'Authorization': `Bearer ${getAuthToken()}`,
            };

            const body: BodyInit = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';

            const res = await fetch(`${BASE_URL}/api/authors/`, {
                method: "POST",
                headers,
                body,
            });

            if (!res.ok) {
                let errMsg = "Failed to create author";
                try {
                    const errJson = await res.json();
                    errMsg = errJson?.message || JSON.stringify(errJson) || errMsg;
                } catch {
                    const errText = await res.text();
                    if (errText) errMsg = errText;
                }
                throw new Error(errMsg);
            }
            
            const created = await res.json();
            if (created && created.id) {
                if (typeof window !== "undefined") {
                    window.location.href = `/authors`;
                }
            }
            return true;
        } catch (error: any) {
            console.error("Error submitting author form:", error);
            throw error;
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Authors</h1>
            <AuthorForm onSubmit={submitForm} />
            <div className="mt-4">
                <Link href="/authors" className="text-blue-600 underline">Go to Authors</Link>
            </div>
        </div>
    );
} 