# Authentication & Authorization API

Welcome to my Authentication and Authorization API repository! This project serves as a robust solution for user authentication, providing essential features for secure login and user management. Below, you'll find details about the technologies used, project structure, and how to get started.

🌐 **Project Link**

Explore the API here: [Auth API Repository](https://github.com/AyushKatiyar13/authen-api.git)

## 🚀 Technologies Used

- **Backend**:
  - **FastAPI**: A modern, fast web framework for building APIs with Python.
  - **Python**: The primary programming language used for backend development.
  - **MongoDB**: A NoSQL database for storing user data and authentication details.
  - **JWT (JSON Web Tokens)**: Used for secure user authentication and session management.
  - **Passlib**: A library for hashing passwords securely.

- **Frontend**:
  - **HTML**: Structured the user interface for registration and login forms.
  - **CSS**: Designed responsive styles for a better user experience.
  - **JavaScript**: Implemented client-side logic for form validation and interactions.

- **Development Tools**:
  - **Postman**: For testing API endpoints and ensuring proper functionality.
  - **Git**: Version control for managing the project codebase.
  - **Render**: Hosting platform for deploying the API.

## 💡 Features

- **User Registration**: 
  - Allows users to sign up with a unique email and password.
  - Implements password hashing for security.

- **Email Verification**: 
  - Ensures that users confirm their email addresses upon registration.

- **Login & Logout**: 
  - Securely authenticates users and manages sessions using JWT.

- **Password Reset**: 
  - Provides functionality for users to recover their accounts.

- **Protected Routes**: 
  - Ensures that certain API endpoints are accessible only to authenticated users.

- **User Management**: 
  - Admin functionality to manage user data and account status.

## 🔧 Challenges Encountered

- **API Development**: 
  - Gained hands-on experience in building a fully functional API from scratch.

- **Database Integration**: 
  - Successfully integrated MongoDB for persistent data storage.

- **Security Implementation**: 
  - Implemented secure authentication and password management techniques.

## 📝 Installation & Usage

To run the API locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/AyushKatiyar13/authen-api.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd authen-api
   ```

3. **Set Up a Virtual Environment:**
   ```bash
   python -m venv venv
   ```

4. **Activate the Virtual Environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

5. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Run the API:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

7. **Access the API:**
   Open your browser or Postman and navigate to `http://localhost:8000` to explore the API endpoints.

## 📈 API Endpoints

- **POST /register**: Register a new user.
- **POST /login**: Authenticate a user and return a JWT.
- **POST /password-reset**: Initiate a password reset process.
- **GET /protected**: Access a protected route (requires authentication).

## 📬 Contact

For inquiries or feedback, feel free to reach out via GitHub or explore the project repository for more information.

## Thank you for exploring my Authentication & Authorization API! I hope you find it useful and informative. If you have any suggestions or contributions, please feel free to get involved!
