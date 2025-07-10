import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLFloat,
} from 'graphql';
import AuthorService from '@services/authors.service.js';
import BookService from '@services/books.service.js';
import { AuthorType } from '@graphql/schema/author.schema.js';
import CreatedByUserType from '@graphql/schema/common.schema.js';

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        published_date: { type: GraphQLString },
        author_id: { type: GraphQLID },
        thumbnail: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) },
        created_by: { type: CreatedByUserType },
        author: {
            type: AuthorType,
            resolve: AuthorService.getAuthorByBook,
        },
        avg_rating: {
            type: GraphQLFloat,
            resolve: (book) => {
                if (
                    typeof book.total_rating_sum === 'number' &&
                    typeof book.total_rating_count === 'number' &&
                    book.total_rating_count > 0
                ) {
                    return Math.round((book.total_rating_sum / book.total_rating_count) * 10) / 10;
                }
                return null;
            },
        }
    }),
});

const BookPageType = new GraphQLObjectType({
    name: 'BookPage',
    fields: () => ({
        books: { type: new GraphQLList(BookType) },
        total: { type: GraphQLInt },
    }),
});


const BookReviewType = new GraphQLObjectType({
    name: 'BookReview',
    fields: () => ({
        id: { type: GraphQLID },
        bookId: { type: GraphQLID },
        userId: { type: GraphQLID },
        review: { type: GraphQLString },
        rating: { type: GraphQLInt },
        createdAt: { type: GraphQLString },
    }),
});

const BookReviewPageType = new GraphQLObjectType({
    name: 'BookReviewPage',
    fields: () => ({
        reviews: { type: new GraphQLList(BookReviewType) },
        total: { type: GraphQLInt },
    }),
});


const BookQueryFields = {
    books: {
        type: BookPageType,
        args: {
            page: { type: GraphQLInt, defaultValue: 1 },
            pageSize: { type: GraphQLInt, defaultValue: 10 },
            author: { type: GraphQLString },
            publishedDate: { type: GraphQLString },
            title: { type: GraphQLString },
            search: {type: GraphQLString },
        },
        resolve: (_, args, context) => {
            return BookService.getBooks(args)
        },
    },
    book: {
        type: BookType,
        args: { id: { type: GraphQLID } },
        resolve: (_, args) => BookService.getBookById(args),
    },
    bookReviews: {
        type: BookReviewPageType,
        args: {
            bookId: { type: GraphQLID },
            page: { type: GraphQLInt, defaultValue: 1 },
            pageSize: { type: GraphQLInt, defaultValue: 10 }
        },
        resolve: (_, args) => BookService.getBookReviews(args),
    },
    booksByAuthor: {
        type: new GraphQLList(BookType),
        args: { authorId: { type: GraphQLID } },
        resolve: (_, args) => BookService.getBooksByAuthor(args),
    },
};


const BookMutationFields = {
    // createBook: {
    //     type: BookType,
    //     args: {
    //         title: { type: new GraphQLNonNull(GraphQLString) },
    //         description: { type: GraphQLString },
    //         published_date: { type: GraphQLString },
    //         author_id: { type: new GraphQLNonNull(GraphQLID) },
    //     },
    //     resolve: (_, args) => BookService.createBook(args)
    // },
    updateBook: {
        type: BookType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            title: { type: GraphQLString },
            description: { type: GraphQLString },
            published_date: { type: GraphQLString },
        },
        async resolve(_, args) {
            return BookService.updateBook(args)
        },
    },
    deleteBook: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        async resolve(_, args) {
            return BookService.deleteBook(args)
        }
    },
    createBookReview: {
        type: BookReviewType,
        args: {
            bookId: { type: new GraphQLNonNull(GraphQLID) },
            // userId: { type: new GraphQLNonNull(GraphQLID) },
            review: { type: GraphQLString },
            rating: { type: GraphQLInt },
        },
        resolve: (_, args) => BookService.createBookReview(args)
    },
};

export { BookQueryFields, BookMutationFields, BookType, BookPageType }; 
