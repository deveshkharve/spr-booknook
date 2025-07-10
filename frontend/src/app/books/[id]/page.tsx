"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, gql, useMutation } from "@apollo/client";
import { CarouselDefault } from "@/app/components/Carousel";
import ReviewRating from "@/app/components/ReviewRating";

const GET_BOOK_BY_ID = gql`
  query GetBookById($id: ID!) {
    book(id: $id) {
      id
      title
      description
      images
      avg_rating
      author {
        id
        name
      }
    }
  }
`;

const GET_REVIEWS_BY_BOOK_ID = gql`
  query bookReviews($bookId: ID!, $page: Int!, $pageSize: Int!) {
    bookReviews(bookId: $bookId, page: $page, pageSize: $pageSize) {
      reviews {
        id
        review
        rating
      }
      total
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation createBookReview($bookId: ID!, $review: String!, $rating: Int!) {
    createBookReview(bookId: $bookId, review: $review, rating: $rating) {
      bookId
      review
      rating
    }
  }
`;

const PAGE_SIZE = 2;

function ReviewItem (props: {item: { rating: number; review: string }}) {
  console.log('review Item ', props.item)
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        {Array.from({ length: props.item.rating }).map((_, idx) => (
          <span key={idx} className="text-yellow-500 font-bold">★</span>
        ))}
        {/* <span className="text-black-800 font-medium">{props.item.rating}</span> */}
      </div>
      <div className="text-gray-700 text-sm">{props.item?.review}</div>
  </>
)
}


export default function BookDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [page, setPage] = useState(1);
  const [createBookReview] = useMutation(CREATE_REVIEW);

  const { data, loading, error } = useQuery(GET_BOOK_BY_ID, { variables: { id } });
  const { data: reviewsData, loading: reviewsLoading, error: reviewsError } = useQuery(GET_REVIEWS_BY_BOOK_ID, {
    variables: { bookId: id, page, pageSize: PAGE_SIZE },
    skip: !id,
  });

  if (loading) return <div>Loading book details...</div>;
  if (error) return <div>Error loading book details.</div>;
  const book = data.book;

  const reviews = reviewsData?.bookReviews.reviews || [];
  console.log('reviews>>>', {bookReviews: reviewsData?.bookReviews.reviews, reviews})
  const totalReviews = reviewsData?.bookReviews.total || 0;
  console.log('totalReviews>>', totalReviews)
  const totalPages = Math.ceil(totalReviews / PAGE_SIZE);

  const submitReviewForm = async (data: { review: string, rating: number }) => {
    await createBookReview({ variables: { bookId: id, ...data } })
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col items-center">
      {/* <img
        src={`${BASE_URL}/${book.images[0]}` || "/file.svg"}
        alt={book.title}
        className="w-40 h-56 object-cover rounded mb-6 border"
      /> */}
      <CarouselDefault images={book.images}></CarouselDefault>
      <h1 className="text-3xl font-bold py-5 mb-2 text-center">{book.title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-500 font-bold text-lg">★</span>
        <span className="text-gray-800 font-medium text-lg">{book.avg_rating ?? 'N/A'}</span>
      </div>
      <div className="text-gray-700 text-base mb-4 text-center">By <a href={`/authors/${book.author.id}`} className="font-medium">{book.author ? book.author.name : "Unknown Author"}</a></div>
      <p className="text-gray-600 text-md text-center whitespace-pre-line mb-6">{book.description}</p>
      <div className="w-full mt-6">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {reviewsLoading ? (
          <div>Loading reviews...</div>
        ) : reviewsError ? (
          <div className="text-red-500">Error loading reviews.</div>
        ) : reviews.length > 0 ? (
          <>
            <ul className="space-y-4">
              {reviews.map((reviewItem: { id: string; reviewer: string; rating: number; review: string }) => (
                <li key={reviewItem.id} className="border border-gray-100 rounded p-4 bg-gray-50">
                  <ReviewItem item={reviewItem} />
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-4">
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
          </>
        ) : (
          <div className="text-gray-500">No reviews yet.</div>
        )}
        <div className="pt-15">
          <ReviewRating onSubmit={submitReviewForm} />
        </div>
      </div>
    </div>
  );
} 