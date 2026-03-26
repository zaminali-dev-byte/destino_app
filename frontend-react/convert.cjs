const fs = require('fs');

let html = fs.readFileSync('../frontend/index.html', 'utf8');

// Extract the page-wrapper
let pageWrapper = html.split('<div class="page-wrapper">')[1].split('<!--End pagewrapper-->')[0];
pageWrapper = '<div className="page-wrapper">' + pageWrapper;

// Basic JSX replacements
let jsx = pageWrapper;
jsx = jsx.replace(/class="/g, 'className="');
jsx = jsx.replace(/for="/g, 'htmlFor="');
jsx = jsx.replace(/<!--([^>]*?)-->/g, '{/* $1 */}'); // Be careful with inner > inside comments

// Self closing tags
jsx = jsx.replace(/<img([^>]*[^/])>/g, '<img$1 />');
jsx = jsx.replace(/<input([^>]*[^/])>/g, '<input$1 />');
jsx = jsx.replace(/<br>/gi, '<br />');
jsx = jsx.replace(/<hr>/gi, '<hr />');

// Replace style="width: 150px; height: 100px;" with style={{ width: '150px', height: '100px' }}
jsx = jsx.replace(/style="([^"]*)"/g, (match, styleString) => {
    const rules = styleString.split(';').filter(rule => rule.trim());
    const reactStyleObj = rules.map(rule => {
        let [key, value] = rule.split(':');
        if (!key || !value) return null;
        key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        value = value.trim().replace(/'/g, "\\'"); // escape quotes
        // For urls
        if (value.startsWith('url(') && value.endsWith(')')) {
            value = `url(${value.substring(4, value.length - 1).replace(/['"]/g, '')})`;
        }
        return `${key}: '${value}'`;
    }).filter(Boolean).join(', ');
    return `style={{ ${reactStyleObj} }}`;
});

// Some attributes might need fixing e.g., required="" -> required
jsx = jsx.replace(/required=""/g, 'required');
// height="100px"
jsx = jsx.replace(/ height="(\d+px?)"/gi, ' height="$1"');

// Fix unclosed comments
// Because of the split, let's just make sure there are no raw <!-- or -->
jsx = jsx.replace(/<!--/g, '{/*').replace(/-->/g, '*/}');
// In case the comment replacement corrupted something, let's fix it.
// React component structure
const fullComponent = `import React from 'react';

function App() {
  return (
    ${jsx}
  );
}

export default App;
`;

fs.writeFileSync('src/App.jsx', fullComponent);
console.log('App.jsx has been generated.');
