const fs = require('fs');
let file1 = 'src/app/alerts/page.tsx';
if (fs.existsSync(file1)) {
    let c1 = fs.readFileSync(file1, 'utf8');
    c1 = c1.replace("import { AlertTriangle, Clock, Activity, CheckCircle, ShieldAlert } from 'lucide-react';", "import { Clock, Activity, CheckCircle, ShieldAlert } from 'lucide-react';");
    fs.writeFileSync(file1, c1);
}

let file2 = 'src/app/speeches/page.tsx';
if (fs.existsSync(file2)) {
    let c2 = fs.readFileSync(file2, 'utf8');
    c2 = c2.replace('click "Generate" to instruct', 'click &quot;Generate&quot; to instruct');
    fs.writeFileSync(file2, c2);
}

let file3 = 'src/components/Navbar.tsx';
if (fs.existsSync(file3)) {
    let c3 = fs.readFileSync(file3, 'utf8');
    c3 = c3.replace("import { Bell, Search, UserCircle, Settings } from 'lucide-react';", "import { Bell, Search, UserCircle } from 'lucide-react';");
    fs.writeFileSync(file3, c3);
}
