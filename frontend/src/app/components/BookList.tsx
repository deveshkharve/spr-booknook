"use client";
import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { BASE_URL } from "../configs";

const GET_BOOKS = gql`
  query books($page: Int!, $pageSize: Int!, $search: String!) {
    books(page: $page, pageSize: $pageSize, search: $search) {
      books {
        id
        title
        description
        thumbnail
        avg_rating
        author {
          id
          name
        }
      }
      total
    }
  }
`;

export default function BookList() {
  // Set default values for query variables
  const [title, setTitle] = React.useState("");
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 10;

  // Debounced search implementation
  // We'll use a debounced state for the title used in the query.
  const [debouncedSeachTerm, setDebouncedSearchTerm] = React.useState(title);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(title);
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [title]);

  // Use debouncedTitle in the query instead of title
  const { data: bookData, loading, error } = useQuery(GET_BOOKS, {
    variables: { search: debouncedSeachTerm, page, pageSize: PAGE_SIZE },
  });

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error loading books.</div>;
  const { books: bookList } = bookData;

  const totalPages = Math.ceil(bookData.books.total / PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bookList?.books && bookList.books.length > 0 ? (
          bookList.books.map(
            (book: {
              id: string;
              title: string;
              description: string;
              thumbnail: string;
              avg_rating: number;
              author: { id: string; name: string };
            }) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center h-[400px] transition hover:shadow-lg cursor-pointer"
              >
                <img
                  src={
                    book.thumbnail
                      ? `${BASE_URL}/${book.thumbnail}`
                      : "/file.svg"
                  }
                  alt={book.title}
                  className="w-32 h-40 object-cover rounded mb-4 border"
                  onError={e => {
                    (e.target as HTMLImageElement).src = "/file.svg";
                  }}
                />
                <h2 className="text-xl font-semibold mb-2 text-center">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2 text-center break-words overflow-auto w-full">
                  {book.description}
                </p>
                <div className="flex-1" />
                <div className="w-full flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 font-bold">★</span>
                    <span className="text-gray-800 font-medium">
                      {book.avg_rating ?? "N/A"}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm text-right">
                    By{" "}
                    <span className="font-medium">
                      {book.author ? book.author.name : "Unknown Author"}
                    </span>
                  </div>
                </div>
              </Link>
            )
          )
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No books found.
          </div>
        )}
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