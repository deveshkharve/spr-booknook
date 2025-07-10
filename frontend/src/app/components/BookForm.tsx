"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { BASE_URL, DEFAULT_TOKEN, getAuthToken } from "../configs";

export default function BookForm() {
  // TODO: Implement form and mutation logic for books
  //   curl --location 'http://localhost:4000/api/books/' \
// --header 'Authorization: ••••••' \
// --form 'title="book of the one"' \
// --form 'description="someone book number one"' \
// --form 'author_id="3"' \
// --form 'thumbnail=@"/Users/spyder/Downloads/img3.jpeg"' \
// --form 'images=@"/Users/spyder/Downloads/img1.jpeg"' \
// --form 'images=@"/Users/spyder/Downloads/img2.jpeg"' \
// --form 'images=@"/Users/spyder/Downloads/img3.jpeg"'

const [title, setTitle] = React.useState("");
const [description, setDescription] = React.useState("");

const searchParams = useSearchParams();
const defaultAuthorId = searchParams?.get("author_id") || "";
const [authorId, setAuthorId] = React.useState(defaultAuthorId);
const [thumbnail, setThumbnail] = React.useState<File | null>(null);
const [images, setImages] = React.useState<FileList | null>(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState<string | null>(null);
const [success, setSuccess] = React.useState<string | null>(null);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("author_id", authorId);
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }
  if (images && images.length > 0) {
    Array.from(images).forEach((img) => {
      formData.append("images", img);
    });
  }

  try {
    const res = await fetch(`${BASE_URL}/api/books/`, {
      method: "POST",
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }, // Uncomment and set token if needed
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to create book");
    }
    setSuccess("Book created successfully!");
    setTitle("");
    setDescription("");
    setAuthorId("");
    setThumbnail(null);
    setImages(null);
    // Optionally reset file inputs
    (document.getElementById("thumbnail-input") as HTMLInputElement).value = "";
    (document.getElementById("images-input") as HTMLInputElement).value = "";
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
    encType="multipart/form-data"
  >
    <h2 className="text-xl font-bold mb-2">Add a New Book</h2>
    {error && <div className="text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>}
    {success && <div className="text-green-700 bg-green-50 px-3 py-2 rounded">{success}</div>}
    <div>
      <label className="block mb-1 font-medium">Title</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Description</label>
      <textarea
        className="w-full border px-3 py-2 rounded"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
        required
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Author ID</label>
      <input
        type="number"
        className="w-full border px-3 py-2 rounded"
        value={authorId}
        onChange={e => setAuthorId(e.target.value)}
        required
        min={1}
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Thumbnail</label>
      <input
        id="thumbnail-input"
        type="file"
        accept="image/*"
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
          }
        }}
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Images (multiple allowed)</label>
      <input
        id="images-input"
        type="file"
        accept="image/*"
        multiple
        onChange={e => {
          setImages(e.target.files);
        }}
      />
    </div>
    <button
      type="submit"
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Submitting..." : "Create Book"}
    </button>
  </form>
);

} 