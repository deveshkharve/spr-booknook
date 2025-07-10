import AuthorList from "../components/AuthorList";
import Link from "next/link";

export default function AuthorsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
      <h1 className="text-2xl font-bold">Authors</h1>
      <div className="ml-auto">
        <Link
          className="bg-gray-500 hover:bg-gray-600 text-white px-15 py-3 rounded transition"
          title="Add Author"
          href="/authors/add"
        >
          Add Author
        </Link>
      </div>
      </div>
      <AuthorList />
      <div className="mt-4">
        <Link href="/books" className="text-blue-600 underline">Go to Books</Link>
      </div>
    </div>
  );
} 