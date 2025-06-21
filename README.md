# WardrobeWhiz

WardrobeWhiz is a full-stack web application designed to help you manage your clothing and sports gear items. It allows users to add new items with detailed descriptions and multiple images, view a catalog of all added items, inspect individual item detail s in a modal, and delete items when no longer needed.

## ✨ Features

* **Add Item:**
    * Form to input Item Name, Item Type (Shirt, Pant, Shoes, Sports Gear, etc.), and Item Description.
    * Upload a primary cover image and up to 3 additional images for each item.
    * Success/error messages for user feedback.
* **View Items:**
    * Displays a grid of all items in the system.
    * Each item card shows the Item Name and its Cover Image.
    * Handles loading and error states gracefully.
* **Item Details Modal:**
    * Clicking an item opens a modal/lightbox displaying all its details.
    * Features an image carousel showing all associated images (cover + additional images) with thumbnails for navigation.
    * "Enquire" button (placeholder for future contact functionality).
    * "Delete Item" button with confirmation prompt to remove an item and its associated images.
* **Responsive Design:** Optimized for various screen sizes, from mobile to desktop.
* **Modern UI:** Clean and colorful design with interactive elements.

## 💻 Technologies Used

**Backend:**
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web framework for building the API.
* **SQLite3:** Lightweight, file-based SQL database for storing item data.
* **Multer:** Node.js middleware for handling `multipart/form-data`, primarily used for file uploads.
* **`dotenv`:** To load environment variables (e.g., PORT).
* **`cors`:** Middleware to enable Cross-Origin Resource Sharing.
* **`nodemon`:** Development tool for automatically restarting the Node.js server on file changes.
* **`concurrently`:** Utility to run multiple commands concurrently (e.g., backend and frontend servers).

**Frontend:**
* **React:** JavaScript library for building user interfaces.
* **React Router DOM:** For declarative routing within the React application.
* **Axios:** Promise-based HTTP client for making API requests to the backend.
* **`react-responsive-carousel`:** A popular React component for building responsive image carousels.
* **`react-modal`:** Accessible modal dialogs for React.
* **CSS:** For styling the application, including custom styles for components.

## 🚀 Getting Started

Follow these steps to set up and run the WardrobeWhiz project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (LTS version recommended): You can check if it's installed by running `node -v` in your terminal. If not installed, download from [nodejs.org](https://nodejs.org/).
* **npm** (Node Package Manager) or **Yarn**: npm comes with Node.js. You can check `npm -v` or `yarn -v`.

### Installation Steps

1.  **Clone the Repository (Hypothetical):**
    If this were a real repository, you would clone it:

    ```bash
    git clone https://github.com/Tiku57/WardrobeWhiz
    cd WardrobeWhiz

    ```

    *For now, ensure your project directory structure is as follows:*

    ```
    WardrobeWhiz/
    ├── backend/
    └── frontend/

    ```

2.  **Backend Setup:**
    Navigate to the `backend` directory, install dependencies, and set up the database.

    ```bash
    cd backend
    npm install

    ```

    * **Create `.env` file:** In the `backend` directory, create a file named `.env` and add the following line:

        ```
        PORT=5001

        ```

    * **Database & Uploads Folder:** The `db.js` script will automatically create `database.sqlite` and the `uploads` folder (`backend/uploads`) when the server starts for the first time.

    * **Default Images:** For the seeded default items (Stylish T-Shirt, Classic Jeans, Running Shoes) to display images, you need to manually place placeholder images in `backend/uploads/` named `default_shirt.jpg`, `default_shirt_1.jpg`, `default_shirt_2.jpg`, etc., as per the `db.js` seeding.

3.  **Frontend Setup:**
    Open a **new terminal tab/window**, navigate to the `frontend` directory, and install dependencies.

    ```bash
    cd ../frontend
    npm install

    ```

4.  **Important Nodemon Configuration (Backend):**
    To prevent the backend server from flickering due to constant restarts (when the database or images are modified), ensure your `backend/package.json` has the `dev` script explicitly ignoring the database and uploads folder.

    * Open `backend/package.json`

    * Verify the `scripts` section looks like this:

        ```json
        "scripts": {
            "start": "node server.js",
            "dev": "nodemon server.js --ignore database.sqlite --ignore uploads/*",
            "dev:fullstack": "concurrently \"npm run dev\" \"npm --prefix ../frontend start\""
        },
        "nodemonConfig": {
            "ignore": [
                "database.sqlite",
                "uploads/*"
            ]
        }

        ```

        *(Note: The `nodemonConfig` block is a fallback, the direct `--ignore` flags in the `dev` script are more reliable.)*

5.  **Run the Full Stack Application:**
    From your **`backend`** directory, run the `dev:fullstack` script:

    ```bash
    cd ../backend
    npm run dev:fullstack

    ```

    This command uses `concurrently` to start both the Node.js backend server (with `nodemon`) and the React development server.

    The application will typically open in your browser at `http://localhost:3000`.

## 🖥️ Usage

Once the application is running:

* **Navbar:** Use the "View Items" and "Add Item" links to navigate.

* **Add Item Page:**

    * Fill out the form fields.

    * For "Item Additional Images", hold down `Ctrl` (Windows/Linux) or `Command` (Mac) while clicking to select multiple image files.

    * Click "Add Item". You'll see a success message.

* **View Items Page:**

    * See a grid of all items.

    * Click on any item card to open a detailed modal.

* **Item Details Modal:**

    * View all item details and images in a carousel with thumbnails at the bottom.

    * **"Enquire" button:** A placeholder.

    * **"Delete Item" button:** Click to remove the item and its images (requires confirmation).

## 📂 Project Structure

```
WardrobeWhiz/
├── backend/
│   ├── node_modules/
│   ├── uploads/                # Directory for uploaded images
│   ├── .env                    # Environment variables (e.g., PORT)
│   ├── db.js                   # SQLite database connection and table creation
│   ├── server.js               # Main Express server file
│   ├── package.json
│   ├── package-lock.json
│   └── routes/
│       └── items.js            # API routes for items (add, get, update, delete)
│
└── frontend/
    ├── node_modules/
    ├── public/
    │   ├── index.html          # Main HTML template (site title, favicon)
    │   ├── favicon.ico         # Old React favicon (delete to remove)
    │   ├── logo192.png         # Old React logo (delete to remove)
    │   └── logo512.png         # Old React logo (delete to remove)
    │   └── placeholder.png     # Fallback image for broken links
    ├── src/
    │   ├── api.js              # Centralized API calls (axios)
    │   ├── App.js              # Main React component, defines routes
    │   ├── index.js            # React app entry point
    │   ├── index.css           # Global CSS styles (body background, horizontal scrollbar fix)
    │   ├── components/
    │   │   ├── AddItemForm.js  # Form for adding new items
    │   │   ├── AddItemForm.css # Styles for AddItemForm
    │   │   ├── ItemDetailModal.js # Modal for displaying item details
    │   │   ├── ItemDetailModal.css # Styles for ItemDetailModal (includes button and carousel styles)
    │   │   ├── Navbar.js       # Navigation bar component
    │   │   └── Navbar.css      # Styles for Navbar
    │   └── pages/
    │       ├── AddItemPage.js  # Page for adding items
    │       └── ViewItemsPage.js # Page for viewing items
    ├── package.json
    └── package-lock.json
```
## 👨‍💻 Author

Created by Aaditya Sattawan
