"use client";
import AuthorForm from "@/app/components/AuthorForm";
import Link from "next/link";

import { useParams } from "next/navigation";
import { useQuery, gql, useMutation } from "@apollo/client";


const GET_AUTHOR_BY_ID = gql`
  query author($id: ID!) {
    author(id: $id) {
      id
      name
      biography
      born_date
    }
  }
`;


const UPDATE_AUTHOR = gql`
mutation updateAuthor($id: ID!, $name: String!, $biography: String!) {
  updateAuthor(id: $id, name: $name, biography: $biography) {
    id
    name
    biography
    born_date
  }
}
`;

export default function AuthorsPage() {
  const params = useParams();
  const { id } = params;

  const { data, loading, error } = useQuery(GET_AUTHOR_BY_ID, { variables: { id } });
  const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authors</h1>
        <div>Loading author details...</div>
      </div>
    );
  }

  if (error || !data?.author) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authors</h1>
        <div className="text-red-600">Error loading author details.</div>
        <div className="mt-4">
          <Link href="/authors" className="text-blue-600 underline">Go to Authors</Link>
        </div>
      </div>
    );
  }

  const { name, biography, born_date } = data.author;

  const submitForm = async (formData: { [key:string]: string }) => {
    // Convert FormData to variables for GraphQL mutation
    const variables: any = {
      id,
      name: formData['name'],
      biography: formData["biography"] || "",
      // born_date: formData["born_date"] || "",
    };

    console.log('data......', variables)
    // If avatar is present, add it as Upload
    // if (formData.get("avatar") && formData.get("avatar").name) {
    //   variables.avatar = formData.get("avatar");
    // }

    try {
      await updateAuthor({ variables: { id, ...variables } })

      if (typeof window !== "undefined") {
        window.location.href = `/authors/${id}`;
      }
      return { ok: true };
    } catch (err: any) {
      // Mimic fetch API error response
      return {
        ok: false,
        text: async () => err.message || "Failed to update author",
      };
    }
  };


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authors</h1>
      <AuthorForm
        onSubmit={submitForm}
        defaultValues={{ name, biography, born_date }}
      />
      <div className="mt-4">
        <Link href="/authors" className="text-blue-600 underline">Go to Authors</Link>
      </div>
    </div>
  );
} 