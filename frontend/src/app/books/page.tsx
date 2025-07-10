"use client";


import Link from "next/link";
import BookList from "../components/BookList";

export default function BooksPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      {/* <BookForm /> */}
      <BookList />
      <div className="mt-4">
        <Link href="/authors" className="text-blue-600 underline">Go to Authors</Link>
      </div>
    </div>
  );
} 