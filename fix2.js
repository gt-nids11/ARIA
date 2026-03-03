const fs = require('fs');
let c1 = fs.readFileSync('src/app/alerts/page.tsx', 'utf8');
c1 = c1.replace(/AlertTriangle,\s*/g, '');
fs.writeFileSync('src/app/alerts/page.tsx', c1);

let c2 = fs.readFileSync('src/app/speeches/page.tsx', 'utf8');
c2 = c2.replace(/"Generate"/g, '&quot;Generate&quot;');
fs.writeFileSync('src/app/speeches/page.tsx', c2);

let c3 = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
c3 = c3.replace(/,\s*Settings\s*}/g, ' }');
fs.writeFileSync('src/components/Navbar.tsx', c3);
