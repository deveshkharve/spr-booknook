"use client";

import BookForm from "@/app/components/BookForm";
import Link from "next/link";
import { Suspense } from "react";

export default function BooksPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      <Suspense fallback={<div>Loading...</div>}>
          <BookForm />
      </Suspense>
      <div className="mt-4">
        <Link href="/books" className="text-blue-600 underline">Go to Books</Link>
      </div>
    </div>
  );
} 