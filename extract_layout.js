const fs = require('fs');

let home = fs.readFileSync('c:/Users/ELITE BOOK/Desktop/html/frontend-react/src/pages/Home.jsx', 'utf8');

// 1. Extract Header (including Hidden Sidebar)
const headerStartIdx = home.indexOf('{/*  main header  */}');
const headerEndIdx = home.indexOf('{/* End Hidden Sidebar  */}') + '{/* End Hidden Sidebar  */}'.length;
const headerContent = home.substring(headerStartIdx, headerEndIdx);

// 2. Extract Footer
const footerStartIdx = home.indexOf('{/*  footer area start  */}');
const footerEndIdx = home.indexOf('</footer>') + '</footer>'.length;
const footerContent = home.substring(footerStartIdx, footerEndIdx);

// 3. Generate new Home.jsx
let newHome = home.replace(headerContent, '');
newHome = newHome.replace(footerContent, '');

newHome = newHome.replace('{/* Form Back Drop */}\n        <div className="form-back-drop"></div>', '');
newHome = newHome.replace(/import \{ Link \} from 'react-router-dom';\r?\n/, '');
newHome = newHome.replace(/import \{ AuthContext \} from '\.\.\/context\/AuthContext';\r?\n/, '');
newHome = newHome.replace(/const \{ user, logout \} = useContext\(AuthContext\);\r?\n/, '');

// 4. Create Header.jsx
const headerCode = `import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <>
${headerContent}
            {/* Form Back Drop */}
            <div className="form-back-drop"></div>
        </>
    );
}

export default Header;
`;

// 5. Create Footer.jsx
const footerCode = `import React from 'react';

function Footer() {
    return (
        <>
${footerContent}
        </>
    );
}

export default Footer;
`;

fs.writeFileSync('c:/Users/ELITE BOOK/Desktop/html/frontend-react/src/components/Header.jsx', headerCode);
fs.writeFileSync('c:/Users/ELITE BOOK/Desktop/html/frontend-react/src/components/Footer.jsx', footerCode);
fs.writeFileSync('c:/Users/ELITE BOOK/Desktop/html/frontend-react/src/pages/Home.jsx', newHome);

console.log("Extraction complete!");
