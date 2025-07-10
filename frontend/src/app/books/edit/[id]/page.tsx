"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, gql, useMutation } from "@apollo/client";
import BookForm from "@/app/components/BookForm";
import { BASE_URL } from "@/app/configs";

const GET_BOOK_BY_ID = gql`
  query GetBookById($id: ID!) {
    book(id: $id) {
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
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String!, $description: String!) {
    updateBook(id: $id, title: $title, description: $description) {
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
  }
`;

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { data, loading, error } = useQuery(GET_BOOK_BY_ID, { variables: { id } });
  const [updateBook, { loading: updating, error: updateError }] = useMutation(UPDATE_BOOK);
  const [success, setSuccess] = useState<string | null>(null);

  if (loading) return <div>Loading book details...</div>;
  if (error) return <div>Error loading book details.</div>;
  const book = data.book;

  async function handleEdit(formData: any) {
    try {
      await updateBook({
        variables: {
          id,
          title: formData.get('title'),
          description: formData.get('description'),
        },
      });
      setSuccess("Book updated successfully!");
      setTimeout(() => router.push(`/books/${id}`), 1500);
    } catch (err: any) {
      // Error handled by updateError
    }
  }
  console.log('book>>>>', book)
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
      {updateError && <div className="text-red-600 mb-2">{updateError.message}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <BookForm
        defaultValues={{
          title: book.title,
          description: book.description,
          thumbnail: book.thumbnail,
          author_id: book.author.id,
        }}
        onSubmit={handleEdit}
        loading={updating}
        submitLabel="Update Book"
      />
    </div>
  );
} 