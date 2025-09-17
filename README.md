# Resume Matcher Backend

This project is a backend application for matching resumes using FastAPI. It provides an API for uploading resumes and matching them against job descriptions.

## Features

- Upload resumes in PDF and DOCX formats.
- Match resumes with job descriptions using a custom algorithm.
- Validate and serialize data using Pydantic models.

## Project Structure

```
resume-matcher-backend
├── app
│   ├── main.py            # Entry point of the FastAPI application
│   ├── api
│   │   └── routes.py      # API routes for handling requests
│   ├── services
│   │   └── matcher.py      # Business logic for matching resumes
│   ├── models
│   │   └── schemas.py      # Data models and schemas
│   └── utils
│       └── file_parser.py   # Utility functions for file parsing
├── requirements.txt        # Project dependencies
├── README.md               # Project documentation
└── .gitignore              # Files to ignore in Git
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd resume-matcher-backend
   ```

2. Create a virtual environment:
   ```
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     .venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source .venv/bin/activate
     ```

4. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

To run the application, execute the following command:
```
uvicorn app.main:app --reload
```

Visit `http://127.0.0.1:8000/docs` to access the interactive API documentation.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.