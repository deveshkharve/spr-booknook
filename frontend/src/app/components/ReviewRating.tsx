"use client";
import React, { useState } from "react";

type ReviewFormProps = {
    onSubmit: (data: { review: string; rating: number; }) => Promise<any>;
};

function StarRating({
    rating,
    setRating,
    disabled = false,
}: {
    rating: number;
    setRating: (n: number) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"
                        } focus:outline-none`}
                    onClick={() => !disabled && setRating(star)}
                    disabled={disabled}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

const ReviewRating: React.FC<ReviewFormProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (rating === 0) {
            setError("Please select a star rating.");
            setLoading(false);
            return;
        }

        try {
            await onSubmit({ rating: rating, review: text });

            setSuccess("Review submitted!");
            setText("");
            setRating(0);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            className="max-w-md mx-auto p-6 bg-white rounded shadow flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl font-bold mb-2">Write a Review</h2>
            {error && (
                <div className="text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
            )}
            {success && (
                <div className="text-green-700 bg-green-50 px-3 py-2 rounded">
                    {success}
                </div>
            )}
            <div>
                <label className="block mb-1 font-medium">Your Rating</label>
                <StarRating rating={rating} setRating={setRating} disabled={loading} />
            </div>
            <div>
                <label className="block mb-1 font-medium">Your Review</label>
                <textarea
                    className="w-full border px-3 py-2 rounded"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    required
                    disabled={loading}
                    placeholder="Share your thoughts about this book..."
                />
            </div>
            <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
};

export default ReviewRating;
