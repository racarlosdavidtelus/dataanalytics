# Analytics Tech Specs Creator

This project is a static web application that helps create technical specifications for analytics implementations. It provides templates for page load events and custom tracking events.

## Features

- Page Load Event template generation
- Custom Event Tracking template generation (Click, Form Submission, Custom)
- Preview of generated templates
- Copy to clipboard functionality
- Export templates as Markdown files

## How to Use

1. Open `index.html` in a web browser.
2. Choose between "Page Load" and "Event Tracking" options.
3. For Event Tracking, fill in the required details:
   - Event Type (Click, Form Submission, Custom)
   - Event Name
   - Event Properties
4. Generate the template and preview the result.
5. Copy the template to clipboard or export as a Markdown file.

## Project Structure

- `index.html`: The main HTML file
- `styles.css`: CSS styles for the application
- `script.js`: JavaScript file containing all the logic

## Deploying to GitHub Pages

To deploy this project to GitHub Pages:

1. Create a new repository on GitHub or use an existing one.
2. Push your code to the repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```
3. Go to your repository settings on GitHub.
4. Scroll down to the "GitHub Pages" section.
5. In the "Source" dropdown, select "main" branch.
6. Click "Save".

Your site will be published at `https://yourusername.github.io/your-repo-name/`.

## Development

This is a static site that runs entirely in the browser. To make changes:

1. Edit the HTML, CSS, or JavaScript files as needed.
2. Test your changes by opening `index.html` in a browser.
3. Commit and push your changes to GitHub to update the live site.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
