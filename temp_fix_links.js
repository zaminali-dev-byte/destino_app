const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend-react', 'src', 'pages', 'Home.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Ensure Link is imported
if (!content.includes('import { useNavigate, Link }') && content.includes('import { useNavigate }')) {
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, Link } from 'react-router-dom';");
}

// Replace dead hrefs with React Links
content = content.replace(/<a href="\/blog-details"(.*?)>(.*?)<\/a>/g, '<Link to="/blog-details"$1>$2</Link>');
content = content.replace(/<a href="\/tour-details"(.*?)>(.*?)<\/a>/g, '<Link to="/search"$1>$2</Link>'); // Direct dead tour links to the new Search Engine
content = content.replace(/<a href="\/destination1"(.*?)>(.*?)<\/a>/g, '<Link to="/destinations"$1>$2</Link>');
content = content.replace(/<a href="\/blog"(.*?)>(.*?)<\/a>/g, '<Link to="/blog"$1>$2</Link>');

// Save modifications
fs.writeFileSync(filePath, content);
console.log('Successfully remapped all dead links in Home.jsx to the new architecture');
