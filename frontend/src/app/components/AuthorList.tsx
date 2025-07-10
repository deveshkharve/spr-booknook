"use client";
import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const GET_AUTHORS = gql`
  query Authors($page: Int!, $pageSize: Int!) {
    authors(page: $page, pageSize: $pageSize) {
      authors {
        id
        name
        books {
          id
          title
        }
      }
      total
    }
  }
`;

const PAGE_SIZE = 6; // or whatever you want

export default function AuthorList() {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(GET_AUTHORS, {
    variables: { page, pageSize: PAGE_SIZE },
  });

  if (loading) return <div>Loading authors...</div>;
  if (error) return <div>Error loading authors.</div>;
  const { authors: authorList, total } = data.authors;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {authorList.map((author: { id: string; name: string; books: { id: string; title: string }[] }) => (
          <div
            key={author.id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl">
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-black-900 dark:text-black-100">{author.name}</h2>
                <p className="text-black-500 dark:text-black-400 text-sm">
                  {author.books.length} {author.books.length === 1 ? "Book" : "Books"}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-black-800 dark:text-black-200 mb-2">Top Books:</h3>
              {author.books.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {author.books.slice(0, 3).map((book) => (
                    <li key={book.id} className="text-black-700 dark:text-black-300">
                      {book.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 dark:text-gray-500 italic">No books yet.</div>
              )}
            </div>
            <div className="mt-4">
            <a
              href={`/authors/${author.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              View Details
            </a>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-gray-600 text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
} 