
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery, gql, useMutation } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";

const GET_AUTHOR_BY_ID = gql`
    query author($id: ID!) {
      author(id: $id) {
        id
        name
        biography
        born_date
        books {
          id
          title
          published_date
        }
      }
    }
  `;

const DELETE_AUTHOR_BY_ID = gql`
  mutation deleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;

export default function AuthorProfilePage() {
  const params = useParams();
  const { id } = params;

  // Create the deleteAuthor mutation function
  const [deleteAuthor] = useMutation(DELETE_AUTHOR_BY_ID);
  const { data, loading, error } = useQuery(GET_AUTHOR_BY_ID, { variables: { id } });

  if (loading) return <div className="p-8">Loading author profile...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading author profile.</div>;

  const author = data?.author;

  if (!author) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
        <Link href="/authors" className="text-blue-600 underline">Back to Authors</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col">
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
          {author.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <div className="ml-6">
          <h1 className="text-3xl font-bold mb-1">{author.name}</h1>
          {author.biography && (
            <p className="text-gray-700 text-base">{author.biography}</p>
          )}
        </div>
      <div className="ml-auto">
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex items-center justify-center hover:bg-green-100 text-white p-2 rounded transition"
            title="Edit"
            href={`/authors/edit/${id}`}
            style={{ width: 36, height: 36 }}
          >
            <img src="/edit-pen.svg" alt="Edit" className="w-5 h-5" />
          </Link>
          <button
            className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
            onClick={() => {
              if (confirm("Are you sure you want to delete this author?")) {
                deleteAuthor({ variables: { id } })
                  .then(() => {
                    window.location.href = "/authors";
                  })
                  .catch((err) => {
                    alert("Error deleting author profile.");
                  });
              }
            }}
            title="Delete Author"
            style={{ width: 36, height: 36 }}
          >
            <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
          </button>
        </div>
      </div>
      </div>
      <div className="mb-6">
        <hr className="pb-6" />
        <h2 className="text-xl font-semibold mb-2">Books by author</h2>
        {author.books && author.books.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {author.books.map((book: { id: string; title: string }) => (
              <li key={book.id} className="text-gray-800">
                <Link href={`/books/${book.id}`} className="text-blue-600 underline">
                  {book.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 italic">No books yet.</div>
        )}
      </div>
      <div className="mt-4 flex gap-4">
        <Link href="/authors" className="text-blue-600 underline">Back to Authors</Link>
        <Link href="/books" className="text-blue-600 underline">Go to Books</Link>
        <Link href={`/books/add?author_id=${id}`} className="text-blue-600 underline">Add Books</Link>
      </div>
    </div>
  );
}
