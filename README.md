# CheckMyFinals

CheckMyFinals is a small web app that helps students quickly look up their final exam dates, times, rooms, and instructors from an official exam schedule file.

You upload the university’s Excel or CSV file, and the app parses it in the browser, then lets you search by course code (for example `CSC 212`) to see all matching exam slots.

This project is open source on GitHub. Replace the placeholder repository URL below with your own.

## Features

- Upload `.xlsx`, `.xls`, or `.csv` exam schedule files.
- Client‑side parsing using [SheetJS](https://sheetjs.com/) (no server required).
- Search by course code with a clean, responsive UI.
- Shows exam date, time, room, section, title, and instructor.

## Getting Started

These instructions assume you have Git installed and a modern web browser (Chrome, Edge, Firefox, or Safari).

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/CheckMyFinals.git
cd CheckMyFinals
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub handle or the organization that hosts the repo.

### 2. Run the app

Because this is a static site, you have two simple options:

- **Open directly in a browser**
  - Double‑click `finals.html` (or open it from your browser’s “Open File” menu).
  - This is enough for basic use.

- **Serve with a simple local web server (recommended)**
  - If you have Node.js installed, you can use a small static server:
    ```bash
    npx serve .
    ```
  - Then open the provided URL (usually `http://localhost:3000` or `http://localhost:5000`) in your browser.

## Usage

1. Open the app (`finals.html` or the local server URL).
2. Click **“Select .xlsx or .csv File”** and pick your official exam schedule file.
3. Wait for the status message to show that parsing has completed.
4. In the search box, type a course code such as `CSC 212` or `CSC212`.
5. The results table will show all matching exam entries with date, time, room, and instructor.

## Contributing

Contributions are welcome. Typical workflow:

1. Fork the repository on GitHub.
2. Create a feature branch.
3. Make your changes and test them locally.
4. Open a pull request describing what you changed and why.

## License

Add your preferred open‑source license here (for example MIT, Apache‑2.0, or GPL‑3.0). If you plan to share the project publicly, it is recommended to include a `LICENSE` file at the root of the repository.

