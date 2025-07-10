"use client";
import Error from "next/error";
import React from "react";

export default function AuthorForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (formData: {[key: string]: string}) => Promise<any>;
  defaultValues?: { name: string; biography: string; born_date: string };
}) {
  // TODO: Implement form and mutation logic for authors
const [name, setName] = React.useState(defaultValues?.name || "");
const [biography, setBiography] = React.useState(defaultValues?.biography || "");
const [avatar, setAvatar] = React.useState<File | null>(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState<string | null>(null);
const [success, setSuccess] = React.useState<string | null>(null);

const isEdit = defaultValues && defaultValues.name

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("biography", biography);
  if (avatar) {
    formData.append("avatar", avatar);
  }

  try {
    console.log('submitting formData...', formData,  { name, biography })
    await onSubmit({ name, biography }); // <-- Pass FormData here
    setSuccess(`Author ${isEdit ? 'edited' : 'created' } successfully!`);
    setName("");
    setBiography("");
    setAvatar(null);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
      setError((err as any).message);
    } else {
      setError("Something went wrong");
    }
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
    <h2 className="text-xl font-bold mb-2">{isEdit ? 'Edit Author' : 'Create Author'}</h2>
    {error && <div className="text-red-600">{error}</div>}
    {success && <div className="text-green-600">{success}</div>}
    <div>
      <label className="block mb-1 font-medium">Name</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded"
        defaultValue={name}
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Bio</label>
      <textarea
        className="w-full border px-3 py-2 rounded"
        value={biography}
        onChange={e => setBiography(e.target.value)}
        rows={3}
        required
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Avatar</label>
      <input
        type="file"
        accept="image/*"
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
          }
        }}
      />
    </div>
    <button
      type="submit"
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Submitting..." : `${isEdit ? "Edit Author" : "Create Author"}`}
    </button>
  </form>
);
} 