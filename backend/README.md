# BookNook Backend

## Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- MongoDB and/or PostgreSQL running (depending on your configuration)

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd booknook/backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Environment Variables**
   - Copy the example environment file and update it with your settings:
     ```sh
     cp env.example .env
     ```
   - Edit `.env` to set your database URIs, JWT secret, and any other required variables.

4. **Database Setup**
   - Ensure your MongoDB and/or PostgreSQL instances are running and accessible.
   - Run any necessary migrations or seed scripts if provided (not included by default).

5. **Create Uploads Directory (for file uploads)**
   ```sh
   mkdir -p uploads
   ```

6. **Run the server**
   ```sh
   npm start
   ```
   The server will start on the port specified in your `.env` file (default: 4000).

## Development
- For development with auto-reload, you can use:
  ```sh
  npm run dev
  ```

## API
- The backend exposes both REST and GraphQL endpoints.
- GraphQL endpoint: `/graphql`
- REST endpoints: see routes in `src/routes/`

## File Uploads
- File uploads (e.g., book images) are handled via REST endpoints using `multipart/form-data` and `multer`.
- Uploaded files are stored in the `uploads/` directory.

## Troubleshooting
- Ensure all environment variables are set correctly.
- Check that your databases are running and accessible.
- For directory import errors, always use explicit file paths or ensure an `index.js` exists in the directory.

---

For more details, see the source code and comments in each file.
