// ============================================
// HOPE HAVEN - COMPLETE APPLICATION LOGIC (v3 FIXED)
// All 7 Features Integrated
// ============================================

let currentUser = JSON.parse(localStorage.getItem('hopeHavenCurrentUser') || 'null');
let currentChartInstance = null;
let currentRole = 'admin';
let currentProfileTab = 'overview';

// ================= AUTH =================
function login(email, password, role) {
    const user = DB.users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
        currentUser = user;
        localStorage.setItem('hopeHavenCurrentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        const exists = DB.users.find(u => u.email === email);
        alert(exists ? "❌ Wrong password or role." : "❌ No account with that email.\n\nTry: admin@hopehaven.rw / admin123");
    }
}
function handleLogin(e) { e.preventDefault(); login(document.getElementById('email').value, document.getElementById('password').value, currentRole); }

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const role = document.getElementById('regRole').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) { alert("❌ Passwords do not match!"); return; }
    if (DB.users.find(u => u.email === email)) { alert("❌ Email already exists."); return; }

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    DB.users.push({ id: DB.users.length + 1, name, email, password, role, initials, phone: phone || "", memberSince: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }) });
    saveDB();
    alert(`✅ Account created!\n\nWelcome, ${name}!`);
    document.getElementById('email').value = email;
    document.getElementById('registerForm').reset();
    showLogin();
}
function logout() { localStorage.removeItem('hopeHavenCurrentUser'); window.location.href = 'index.html'; }
function setRole(role) {
    currentRole = role;
    const bA = document.getElementById('btn-admin'), bS = document.getElementById('btn-staff'), sB = document.getElementById('submitBtn');
    if (!bA) return;
    if (role === 'admin') {
        bA.className = "flex-1 py-3 rounded-lg border border-emerald-500 bg-emerald-500/10 text-emerald-400 font-medium text-sm transition";
        bS.className = "flex-1 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 font-medium text-sm hover:border-slate-500 transition";
        sB.className = "w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition";
        sB.innerText = "Login as Administrator";
    } else {
        bS.className = "flex-1 py-3 rounded-lg border border-orange-500 bg-orange-500/10 text-orange-400 font-medium text-sm transition";
        bA.className = "flex-1 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 font-medium text-sm hover:border-slate-500 transition";
        sB.className = "w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition";
        sB.innerText = "Login as Staff";
    }
}

// ================= DASHBOARD ROUTER =================
function renderDashboard(page) {
    if (!currentUser) { window.location.href = 'login.html'; return; }
    const isAdmin = currentUser.role === 'admin';
    const accent = isAdmin ? 'emerald' : 'orange';
    renderSidebar(isAdmin, accent);
    renderTopNav(isAdmin, accent);
    const main = document.getElementById('dashboard-content');
    if (!main) return;

    if (page === 'dashboard') { isAdmin ? renderAdminDashboard(main) : renderStaffDashboard(main); }
    else if (page === 'children') renderChildrenPage(main);
    else if (page === 'staff') renderStaffPage(main);
    else if (page === 'donations') renderDonationsPage(main);
    else if (page === 'health') renderHealthPage(main);
    else if (page === 'education') renderEducationPage(main);
    else if (page === 'sponsors') renderSponsorsPage(main);
    else if (page === 'reports') renderReportsPage(main);
    else if (page === 'reportcenter') renderReportCenterPage(main);
    else if (page === 'alerts') renderAlertsPage(main);
    else if (page === 'profile') renderProfilePage(main);
}

function renderSidebar(isAdmin, accent) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const roleName = isAdmin ? 'ADMIN PANEL' : 'STAFF PANEL';
    const urgentCount = (DB.alerts || []).filter(a => a.severity === 'urgent').length;
    const alertBadge = urgentCount ? `<span class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">${urgentCount}</span>` : '';

    let links = `<a href="#" onclick="renderDashboard('dashboard')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>📊</span> Dashboard</a>`;

    if (isAdmin) {
        links += `
            <a href="#" onclick="renderDashboard('children')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>👶</span> Children</a>
            <a href="#" onclick="renderDashboard('staff')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>👥</span> Staff</a>
            <a href="#" onclick="renderDashboard('donations')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>💝</span> Donations</a>
            <a href="#" onclick="renderDashboard('health')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>🏥</span> Health</a>
            <a href="#" onclick="renderDashboard('education')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>📚</span> Education</a>
            <a href="#" onclick="renderDashboard('sponsors')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>🤝</span> Sponsors</a>
            <a href="#" onclick="renderDashboard('alerts')" class="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span class="flex items-center gap-3"><span>🔔</span> Alerts</span>${alertBadge}</a>
            <a href="#" onclick="renderDashboard('reports')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>📈</span> Reports</a>
            <a href="#" onclick="renderDashboard('reportcenter')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>📄</span> Report Center</a>
        `;
    } else {
        links += `
            <a href="#" onclick="renderDashboard('children')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>👶</span> Children</a>
            <a href="#" onclick="renderDashboard('health')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>🏥</span> Health</a>
            <a href="#" onclick="renderDashboard('education')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>📚</span> Education</a>
            <a href="#" onclick="renderDashboard('alerts')" class="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span class="flex items-center gap-3"><span>🔔</span> Alerts</span>${alertBadge}</a>
            <a href="#" onclick="renderDashboard('profile')" class="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-400 hover:bg-slate-800 hover:text-white"><span>⚙️</span> My Profile</a>
        `;
    }
    sidebar.innerHTML = `
        <div class="p-6 text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800"><span class="bg-${accent}-500 text-white p-1 rounded text-sm">🏠</span> Hope<span class="text-${accent}-500">Haven</span></div>
        <div class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">${roleName}</div>
        <nav class="flex-1 px-4 space-y-1 overflow-y-auto">${links}</nav>
        <div class="p-4 border-t border-slate-800"><button onclick="logout()" class="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition"><span>🚪</span> Logout</button></div>
    `;
}

function renderTopNav(isAdmin, accent) {
    const topnav = document.getElementById('topnav');
    if (!topnav) return;
    const urgentCount = (DB.alerts || []).filter(a => a.severity === 'urgent').length;
    topnav.innerHTML = `
        <div class="flex items-center gap-4 text-slate-400"><button class="hover:text-white transition">☰</button><span>${isAdmin ? 'Administrator' : 'Staff Member'}</span></div>
        <div class="flex items-center gap-6">
            <button onclick="renderDashboard('alerts')" class="text-slate-400 hover:text-white transition relative">🔔${urgentCount ? `<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-[#0B1120] text-white text-[10px] font-bold flex items-center justify-center">${urgentCount}</span>` : ''}</button>
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-${accent}-500 rounded-full flex items-center justify-center text-white font-bold text-sm">${currentUser.initials}</div>
                <div class="hidden md:block"><p class="text-sm font-bold text-white leading-tight">${currentUser.name}</p><p class="text-xs text-slate-500">${currentUser.email}</p></div>
            </div>
        </div>
    `;
}

// ================= ADMIN DASHBOARD (with Impact) =================
function renderAdminDashboard(container) {
    const totalChildren = DB.children.length;
    const activeChildren = DB.children.filter(c => c.status === 'ACTIVE').length;
    const totalStaff = DB.staff.length;
    const totalDonations = DB.donations.reduce((sum, d) => sum + d.amount, 0);
    const withDisability = DB.children.filter(c => c.disability !== 'None').length;

    const sponsoredChildren = DB.children.filter(c => c.sponsor !== 'Unsponsored').length;
    const sponsorshipRate = Math.round((sponsoredChildren / totalChildren) * 100);
    const educationRecords = DB.education.filter(e => e.grade).length;
    const avgGrade = "B+";
    const healthHealthy = DB.children.filter(c => c.healthStatus === 'Healthy').length;
    const healthRate = Math.round((healthHealthy / totalChildren) * 100);
    const urgentAlerts = (DB.alerts || []).filter(a => a.severity === 'urgent').length;
    const costPerChild = 45000;
    const totalMilestones = (DB.milestones || []).length;

    container.innerHTML = `
        <div class="fade-in">
            <h1 class="text-3xl font-bold text-white mb-1">Welcome back, ${currentUser.name} 👋</h1>
            <p class="text-slate-400 mb-8">Here's what's happening at Hope Haven today.</p>

            ${urgentAlerts ? `
                <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <span class="text-2xl">🚨</span>
                    <div class="flex-1">
                        <p class="text-white font-bold">${urgentAlerts} urgent alert${urgentAlerts > 1 ? 's' : ''} need your attention</p>
                        <p class="text-slate-400 text-sm">Click the bell icon or Alerts menu to review.</p>
                    </div>
                    <button onclick="renderDashboard('alerts')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">View</button>
                </div>
            ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">TOTAL CHILDREN</p><p class="text-3xl font-bold text-emerald-400">${totalChildren}</p><p class="text-emerald-500 text-xs mt-2">↑ ${activeChildren} active</p></div>
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">STAFF MEMBERS</p><p class="text-3xl font-bold text-blue-400">${totalStaff}</p><p class="text-emerald-500 text-xs mt-2">↑ dedicated team</p></div>
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">TOTAL DONATIONS</p><p class="text-3xl font-bold text-purple-400">${totalDonations.toLocaleString()} FRw</p><p class="text-emerald-500 text-xs mt-2">↑ this period</p></div>
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">WITH DISABILITY</p><p class="text-3xl font-bold text-orange-400">${withDisability}</p><p class="text-amber-400 text-xs mt-2">specialized care</p></div>
            </div>

            <div class="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6 mb-8">
                <div class="flex items-center gap-3 mb-6">
                    <span class="text-3xl">💫</span>
                    <div>
                        <h2 class="text-xl font-bold text-white">Impact Dashboard</h2>
                        <p class="text-slate-400 text-sm">Real impact we're making this year</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div><p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Sponsorship Rate</p><p class="text-2xl font-bold text-emerald-400">${sponsorshipRate}%</p><p class="text-xs text-slate-500">${sponsoredChildren} of ${totalChildren} children</p></div>
                    <div><p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Health Rate</p><p class="text-2xl font-bold text-blue-400">${healthRate}%</p><p class="text-xs text-slate-500">${healthHealthy} healthy now</p></div>
                    <div><p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Average Grade</p><p class="text-2xl font-bold text-purple-400">${avgGrade}</p><p class="text-xs text-slate-500">${educationRecords} graded records</p></div>
                    <div><p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Cost / Child</p><p class="text-2xl font-bold text-amber-400">${costPerChild.toLocaleString()}</p><p class="text-xs text-slate-500">FRw per month</p></div>
                    <div><p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Milestones</p><p class="text-2xl font-bold text-pink-400">${totalMilestones}</p><p class="text-xs text-slate-500">moments captured</p></div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div class="flex justify-between items-center mb-6"><div><h2 class="text-lg font-bold text-white">Donations Overview</h2><p class="text-xs text-slate-500">Funds received over time</p></div></div>
                    <div class="chart-container"><canvas id="donationChart"></canvas></div>
                </div>
                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 class="text-lg font-bold text-white mb-1">Children by Disability</h2><p class="text-xs text-slate-500 mb-6">Distribution overview</p>
                    <div class="space-y-4">
                        <div><div class="flex justify-between text-sm mb-1"><span class="text-slate-400">No Disability</span><span class="text-emerald-400 font-bold">${DB.children.filter(c => c.disability === 'None').length}</span></div><div class="w-full bg-slate-800 rounded-full h-2"><div class="bg-emerald-500 h-2 rounded-full" style="width: ${(DB.children.filter(c => c.disability === 'None').length / totalChildren) * 100}%"></div></div></div>
                        <div><div class="flex justify-between text-sm mb-1"><span class="text-slate-400">Hearing</span><span class="text-blue-400 font-bold">${DB.children.filter(c => c.disability === 'Hearing Impairment').length}</span></div><div class="w-full bg-slate-800 rounded-full h-2"><div class="bg-blue-500 h-2 rounded-full" style="width: ${(DB.children.filter(c => c.disability === 'Hearing Impairment').length / totalChildren) * 100}%"></div></div></div>
                        <div><div class="flex justify-between text-sm mb-1"><span class="text-slate-400">Visual</span><span class="text-purple-400 font-bold">${DB.children.filter(c => c.disability === 'Visual Impairment').length}</span></div><div class="w-full bg-slate-800 rounded-full h-2"><div class="bg-purple-500 h-2 rounded-full" style="width: ${(DB.children.filter(c => c.disability === 'Visual Impairment').length / totalChildren) * 100}%"></div></div></div>
                        <div><div class="flex justify-between text-sm mb-1"><span class="text-slate-400">Physical</span><span class="text-amber-400 font-bold">${DB.children.filter(c => c.disability === 'Physical Disability').length}</span></div><div class="w-full bg-slate-800 rounded-full h-2"><div class="bg-amber-500 h-2 rounded-full" style="width: ${(DB.children.filter(c => c.disability === 'Physical Disability').length / totalChildren) * 100}%"></div></div></div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-bold text-white">🔔 Smart Alerts</h2>
                        <button onclick="renderDashboard('alerts')" class="text-emerald-400 text-sm hover:underline">View all →</button>
                    </div>
                    <div class="space-y-3">
                        ${(DB.alerts || []).slice(0, 4).map(a => {
                            const child = DB.children.find(c => c.id === a.childId);
                            const color = a.severity === 'urgent' ? 'border-l-red-500 bg-red-500/5' : a.severity === 'soon' ? 'border-l-amber-500 bg-amber-500/5' : 'border-l-blue-500 bg-blue-500/5';
                            const dot = a.severity === 'urgent' ? 'bg-red-500' : a.severity === 'soon' ? 'bg-amber-500' : 'bg-blue-500';
                            return `<div class="border-l-4 ${color} p-3 rounded-r-lg">
                                <div class="flex items-start gap-3">
                                    <div class="w-2 h-2 ${dot} rounded-full mt-2 flex-shrink-0"></div>
                                    <div class="flex-1"><p class="text-white font-semibold text-sm">${a.title}</p><p class="text-xs text-slate-400 mt-0.5">${child ? child.name : ''} • ${a.description}</p></div>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-bold text-white">🌟 Recent Milestones</h2>
                    </div>
                    <div class="space-y-3">
                        ${(DB.milestones || []).slice(-4).reverse().map(m => {
                            const child = DB.children.find(c => c.id === m.childId);
                            return `<div class="flex gap-3 items-start">
                                <div class="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center text-lg flex-shrink-0">${m.icon}</div>
                                <div class="flex-1"><p class="text-white font-medium text-sm">${m.title}</p><p class="text-xs text-slate-400">${child ? child.name : ''} • ${m.date}</p></div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 class="text-lg font-bold text-white mb-4">Recent Donations</h2>
                <table class="w-full text-left"><thead><tr class="text-slate-500 text-xs uppercase border-b border-slate-800"><th class="pb-3 font-medium">ID</th><th class="pb-3 font-medium">Donor</th><th class="pb-3 font-medium">Type</th><th class="pb-3 font-medium">Amount</th><th class="pb-3 font-medium">Date</th></tr></thead><tbody id="admin-dash-table" class="text-sm"></tbody></table>
            </div>
        </div>
    `;
    const tbody = document.getElementById('admin-dash-table');
    DB.donations.slice(0, 4).forEach(d => {
        const cls = d.type === 'Cash' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400';
        tbody.innerHTML += `<tr><td class="py-4 text-slate-400">${d.id}</td><td class="py-4 text-white font-medium">${d.donor}</td><td class="py-4"><span class="px-3 py-1 rounded-full text-xs font-bold ${cls}">${d.type}</span></td><td class="py-4 text-emerald-400 font-bold">${d.amount.toLocaleString()} FRw</td><td class="py-4 text-slate-400">${d.date}</td></tr>`;
    });
    const donationsByDay = [0, 0, 0, 0, 0, 0, 0];
    DB.donations.forEach(d => {
        const day = (new Date(d.date).getDay() + 6) % 7;
        donationsByDay[day] += d.amount;
    });
    drawChart('donationChart', 'line', donationsByDay, 'Donations (FRw)');
}

// ================= STAFF DASHBOARD =================
function renderStaffDashboard(container) {
    const myChildren = DB.children.slice(0, 4);
    const urgentAlerts = (DB.alerts || []).filter(a => a.severity === 'urgent').length;
    container.innerHTML = `
        <div class="fade-in">
            <p class="text-orange-500 text-xs font-bold tracking-widest mb-1">HOPE HAVEN STAFF PORTAL</p>
            <h1 class="text-3xl font-bold text-white mb-1">Welcome back, ${currentUser.name} 👋</h1>
            <p class="text-slate-400 mb-8">Here's your daily overview.</p>

            ${urgentAlerts ? `
                <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <span class="text-2xl">🚨</span>
                    <div class="flex-1"><p class="text-white font-bold">${urgentAlerts} urgent alert${urgentAlerts > 1 ? 's' : ''}</p><p class="text-slate-400 text-sm">Please review alerts for children under your care.</p></div>
                    <button onclick="renderDashboard('alerts')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">View</button>
                </div>
            ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">CHILDREN ASSIGNED</p><p class="text-3xl font-bold text-emerald-400">${myChildren.length}</p><p class="text-emerald-500 text-xs mt-2">under your care</p></div>
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">HEALTH CHECKUPS</p><p class="text-3xl font-bold text-blue-400">${DB.healthRecords.length}</p><p class="text-slate-500 text-xs mt-2">records to review</p></div>
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">MY CASE NOTES</p><p class="text-3xl font-bold text-purple-400">${(DB.caseNotes || []).filter(n => n.author === currentUser.name).length}</p><p class="text-slate-500 text-xs mt-2">notes written</p></div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <h2 class="text-lg font-bold text-white mb-4">My Assigned Children</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${myChildren.map(c => `
                        <div class="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-orange-500/50 transition" onclick="viewChildProfile('${c.id}')">
                            <div class="text-3xl">${c.avatar}</div>
                            <div class="flex-1"><p class="text-white font-bold">${c.name}</p><p class="text-xs text-slate-400">${c.age} years • ${c.educationLevel}</p><p class="text-xs ${c.disability === 'None' ? 'text-emerald-400' : 'text-amber-400'}">${c.disability}</p></div>
                            <span class="badge badge-active">ACTIVE</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 class="text-lg font-bold text-white mb-4">Recent Health Records</h2>
                <table class="w-full text-left"><thead><tr class="text-slate-500 text-xs uppercase border-b border-slate-800"><th class="pb-3 font-medium">Child</th><th class="pb-3 font-medium">Type</th><th class="pb-3 font-medium">Diagnosis</th><th class="pb-3 font-medium">Status</th></tr></thead><tbody id="staff-dash-table" class="text-sm"></tbody></table>
            </div>
        </div>
    `;
    const tbody = document.getElementById('staff-dash-table');
    DB.healthRecords.forEach(h => {
        const child = DB.children.find(c => c.id === h.childId);
        const cls = h.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400';
        tbody.innerHTML += `<tr><td class="py-4 text-white font-medium">${child ? child.name : 'Unknown'}</td><td class="py-4 text-slate-400">${h.type}</td><td class="py-4 text-slate-400">${h.diagnosis}</td><td class="py-4"><span class="px-3 py-1 rounded-full text-xs font-bold ${cls}">${h.status}</span></td></tr>`;
    });
}

// ================= ALERTS PAGE =================
function renderAlertsPage(container) {
    const alerts = DB.alerts || [];
    const urgent = alerts.filter(a => a.severity === 'urgent');
    const soon = alerts.filter(a => a.severity === 'soon');
    const info = alerts.filter(a => a.severity === 'info');

    const renderGroup = (title, icon, list, color) => list.length ? `
        <div class="mb-8">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>${icon}</span> ${title} <span class="text-sm text-slate-500 font-normal">(${list.length})</span></h3>
            <div class="space-y-3">
                ${list.map(a => {
                    const child = DB.children.find(c => c.id === a.childId);
                    return `
                        <div class="bg-slate-900 border border-slate-800 border-l-4 border-l-${color}-500 rounded-xl p-5 flex items-start gap-4">
                            <div class="w-10 h-10 bg-${color}-500/20 text-${color}-400 rounded-lg flex items-center justify-center text-xl flex-shrink-0">${icon}</div>
                            <div class="flex-1">
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <p class="text-white font-bold">${a.title}</p>
                                        <p class="text-sm text-slate-400 mt-1">${a.description}</p>
                                        <div class="flex gap-4 mt-2 text-xs text-slate-500">
                                            <span>👶 ${child ? child.name : 'Unknown'}</span>
                                            <span>📅 Due: ${a.dueDate}</span>
                                            <span>🏷️ ${a.type}</span>
                                        </div>
                                    </div>
                                    ${child ? `<button onclick="viewChildProfile('${child.id}')" class="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap">View Child →</button>` : ''}
                                </div>
                            </div>
                        </div>`;
                }).join('')}
            </div>
        </div>
    ` : '';

    container.innerHTML = `
        <div class="fade-in">
            <div class="flex justify-between items-center mb-2">
                <h1 class="text-3xl font-bold text-white">🔔 Smart Alerts</h1>
                <div class="flex gap-3">
                    <button onclick="document.getElementById('addAlertForm').classList.toggle('hidden')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition">+ Add Alert</button>
                </div>
            </div>
            <p class="text-slate-400 mb-8">${alerts.length} total alerts • ${urgent.length} urgent</p>

            <div id="addAlertForm" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <h2 class="text-xl font-bold text-white mb-4">Create Alert</h2>
                <form onsubmit="handleAddAlert(event)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Child *</label>
                        <select id="alChild" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="">Select child...</option>${DB.children.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
                    </div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Title *</label><input type="text" id="alTitle" required placeholder="e.g. Medication refill due" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Type *</label>
                        <select id="alType" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option>Medical Follow-up</option><option>Medication</option><option>Vaccination</option><option>Birthday</option><option>Education</option><option>Sponsorship</option><option>General</option></select>
                    </div>
                    <div class="md:col-span-2"><label class="block text-sm font-medium mb-2 text-slate-300">Description *</label><input type="text" id="alDescription" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Due Date *</label><input type="date" id="alDue" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Severity *</label>
                        <select id="alSeverity" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="urgent">🔴 Urgent</option><option value="soon">🟡 Soon</option><option value="info">🔵 Info</option></select>
                    </div>
                    <div class="md:col-span-3"><button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium">Add Alert</button></div>
                </form>
            </div>

            ${renderGroup('Urgent — Action Required', '🚨', urgent, 'red')}
            ${renderGroup('Coming Soon', '⏰', soon, 'amber')}
            ${renderGroup('Informational', 'ℹ️', info, 'blue')}

            ${alerts.length === 0 ? '<div class="text-center py-16 text-slate-500">No alerts. Everything is running smoothly! ✨</div>' : ''}
        </div>
    `;
}

function handleAddAlert(e) {
    e.preventDefault();
    DB.alerts = DB.alerts || [];
    DB.alerts.push({
        id: nextId('AL', DB.alerts),
        childId: document.getElementById('alChild').value,
        type: document.getElementById('alType').value,
        severity: document.getElementById('alSeverity').value,
        title: document.getElementById('alTitle').value,
        description: document.getElementById('alDescription').value,
        dueDate: document.getElementById('alDue').value
    });
    saveDB();
    renderDashboard('alerts');
    alert('✅ Alert added!');
}

// ================= CHILD PROFILE (with Timeline + Case Notes) =================
function viewChildProfile(childId) {
    const child = DB.children.find(c => c.id === childId);
    if (!child) return;
    const main = document.getElementById('dashboard-content');
    currentProfileTab = 'overview';

    const renderTabContent = () => {
        const content = document.getElementById('childProfileContent');
        if (!content) return;

        if (currentProfileTab === 'overview') {
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Date of Birth</p><p class="text-white font-bold">${child.dob}</p></div>
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Admission Date</p><p class="text-white font-bold">${child.admissionDate}</p></div>
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Age</p><p class="text-white font-bold">${child.age} years</p></div>
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Gender</p><p class="text-white font-bold">${child.gender}</p></div>
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Disability</p><p class="font-bold ${child.disability === 'None' ? 'text-emerald-400' : 'text-amber-400'}">${child.disability}</p></div>
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Health Status</p><p class="text-white font-bold">${child.healthStatus}</p></div>
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Education Level</p><p class="text-white font-bold">${child.educationLevel}</p></div>
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Sponsor</p><p class="text-white font-bold">${child.sponsor}</p></div>
                    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4"><p class="text-xs text-slate-500 mb-1">Status</p><span class="badge badge-active">${child.status}</span></div>
                </div>
            `;
        } else if (currentProfileTab === 'timeline') {
            const ms = (DB.milestones || []).filter(m => m.childId === childId).sort((a, b) => new Date(b.date) - new Date(a.date));
            content.innerHTML = (ms.length === 0 ? '<p class="text-slate-500 text-center py-8">No milestones yet.</p>' : `
                <div class="relative pl-8">
                    <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-emerald-500/30"></div>
                    <div class="space-y-6">
                        ${ms.map(m => `
                            <div class="relative">
                                <div class="absolute -left-[26px] w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-base border-2 border-slate-900">${m.icon}</div>
                                <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
                                    <p class="text-white font-bold">${m.title}</p>
                                    <p class="text-xs text-emerald-400 mt-1">${m.date} • ${m.type}</p>
                                    <p class="text-sm text-slate-400 mt-2">${m.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `) + `
                <div class="mt-6 bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h4 class="text-white font-bold mb-3">Add a Milestone</h4>
                    <form onsubmit="handleAddMilestone(event, '${childId}')" class="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input type="text" id="msTitle" required placeholder="Title (e.g. Learned to swim)" class="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm md:col-span-2">
                        <input type="text" id="msDescription" required placeholder="Description" class="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm">
                        <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-3 text-sm font-medium">+ Add</button>
                    </form>
                </div>
            `;
        } else if (currentProfileTab === 'health') {
            const hr = DB.healthRecords.filter(h => h.childId === childId);
            content.innerHTML = hr.length === 0 ? '<p class="text-slate-500 text-center py-8">No health records.</p>' : `
                <div class="space-y-3">
                    ${hr.map(h => `
                        <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <div class="flex justify-between items-start mb-2">
                                <p class="text-white font-bold">${h.type}</p>
                                <span class="px-3 py-1 rounded-full text-xs font-bold ${h.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">${h.status}</span>
                            </div>
                            <p class="text-sm text-slate-400">Diagnosis: <span class="text-slate-300">${h.diagnosis}</span></p>
                            <p class="text-sm text-slate-400">Treatment: <span class="text-slate-300">${h.treatment}</span></p>
                            <p class="text-xs text-slate-500 mt-2">${h.date} • ${h.doctor}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (currentProfileTab === 'education') {
            const ed = DB.education.filter(e => e.childId === childId);
            content.innerHTML = ed.length === 0 ? '<p class="text-slate-500 text-center py-8">No education records.</p>' : `
                <div class="space-y-3">
                    ${ed.map(e => `
                        <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <div class="flex justify-between items-start mb-2">
                                <p class="text-white font-bold">${e.school}</p>
                                <span class="text-emerald-400 font-bold">${e.grade || '—'}</span>
                            </div>
                            <p class="text-sm text-slate-400">${e.level} • ${e.term}</p>
                            <p class="text-xs text-slate-500 mt-2">Attendance: ${e.attendance || '—'} • Teacher: ${e.teacher || '—'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (currentProfileTab === 'notes') {
            const cn = (DB.caseNotes || []).filter(n => n.childId === childId).sort((a, b) => new Date(b.date) - new Date(a.date));
            const canSeePrivate = currentUser.role === 'admin';
            const visible = canSeePrivate ? cn : cn.filter(n => n.visibility === 'Public');
            content.innerHTML = `
                <form onsubmit="handleAddCaseNote(event, '${childId}')" class="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
                    <h4 class="text-white font-bold mb-3">Write a Case Note</h4>
                    <textarea id="cnContent" required rows="3" placeholder="What happened today?" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm mb-3"></textarea>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select id="cnType" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"><option>General</option><option>Behavior</option><option>Health</option><option>Education</option><option>Family</option></select>
                        <select id="cnVisibility" class="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"><option value="Public">Public (all staff)</option><option value="Private">Private (admin only)</option></select>
                        <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium">Save Note</button>
                    </div>
                </form>
                <div class="space-y-3">
                    ${visible.length === 0 ? '<p class="text-slate-500 text-center py-8">No case notes yet.</p>' : visible.map(n => `
                        <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <div class="flex justify-between items-start mb-2">
                                <div><p class="text-white font-bold text-sm">${n.author}</p><p class="text-xs text-slate-500">${n.date} at ${n.time}</p></div>
                                <div class="flex gap-2">
                                    <span class="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">${n.type}</span>
                                    ${n.visibility === 'Private' ? '<span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">🔒 Private</span>' : ''}
                                </div>
                            </div>
                            <p class="text-sm text-slate-300">${n.content}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    };

    main.innerHTML = `
        <div class="fade-in">
            <button onclick="renderDashboard('children')" class="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-2">← Back to Children</button>
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 mb-6">
                <div class="flex items-center gap-6">
                    <div class="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">${child.avatar}</div>
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-white mb-2">${child.name}</h1>
                        <div class="flex flex-wrap gap-3 text-sm text-slate-400">
                            <span>🆔 ${child.id}</span>
                            <span>🎂 ${child.age} years old</span>
                            <span>👤 ${child.gender}</span>
                            ${child.sponsor !== 'Unsponsored' ? '<span class="text-emerald-400">💝 Sponsored</span>' : '<span class="text-amber-400">⏳ Awaiting sponsor</span>'}
                        </div>
                    </div>
                    <div class="text-right"><span class="badge badge-active">${child.status}</span></div>
                </div>
            </div>

            <div class="flex gap-2 border-b border-slate-800 mb-6 overflow-x-auto">
                ${['overview', 'timeline', 'health', 'education', 'notes'].map(t => `
                    <button onclick="switchProfileTab('${t}', '${childId}')" id="tab-${t}" class="px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${t === 'overview' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}">${t === 'overview' ? '📋 Overview' : t === 'timeline' ? '🌟 Timeline' : t === 'health' ? '🏥 Health' : t === 'education' ? '📚 Education' : '📝 Case Notes'}</button>
                `).join('')}
            </div>

            <div id="childProfileContent"></div>
        </div>
    `;
    renderTabContent();
}

function switchProfileTab(tab, childId) {
    currentProfileTab = tab;
    ['overview', 'timeline', 'health', 'education', 'notes'].forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (!btn) return;
        btn.className = t === tab ? "px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap border-emerald-500 text-emerald-400" : "px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap border-transparent text-slate-400 hover:text-white";
    });
    viewChildProfile(childId);
}

function handleAddMilestone(e, childId) {
    e.preventDefault();
    DB.milestones = DB.milestones || [];
    DB.milestones.push({
        id: nextId('MS', DB.milestones),
        childId: childId,
        date: new Date().toISOString().split('T')[0],
        type: "Achievement",
        title: document.getElementById('msTitle').value,
        description: document.getElementById('msDescription').value,
        icon: "🌟"
    });
    saveDB();
    currentProfileTab = 'timeline';
    viewChildProfile(childId);
}

function handleAddCaseNote(e, childId) {
    e.preventDefault();
    const now = new Date();
    DB.caseNotes = DB.caseNotes || [];
    DB.caseNotes.push({
        id: nextId('CN', DB.caseNotes),
        childId: childId,
        author: currentUser.name,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        type: document.getElementById('cnType').value,
        visibility: document.getElementById('cnVisibility').value,
        content: document.getElementById('cnContent').value
    });
    saveDB();
    currentProfileTab = 'notes';
    viewChildProfile(childId);
}

// ================= CHILDREN PAGE =================
function renderChildrenPage(container) {
    container.innerHTML = `
        <div class="fade-in">
            <div class="flex justify-between items-center mb-2">
                <h1 class="text-3xl font-bold text-white">Children Management</h1>
                <div class="flex gap-3">
                    <button onclick="exportTable('children')" class="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition">⬇ Export Excel</button>
                    <button onclick="document.getElementById('addChildForm').classList.toggle('hidden')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition">+ Add Child</button>
                </div>
            </div>
            <p class="text-slate-400 mb-8">${DB.children.length} children registered</p>

            <div id="addChildForm" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <h2 class="text-xl font-bold text-white mb-4">Register New Child</h2>
                <form id="childForm" class="grid grid-cols-1 md:grid-cols-3 gap-6" onsubmit="handleAddChild(event)">
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Full Name *</label><input type="text" id="childName" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Date of Birth *</label><input type="date" id="childDob" required max="${new Date().toISOString().split('T')[0]}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Gender *</label><select id="childGender" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="">Select</option><option>Male</option><option>Female</option></select></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Disability Status *</label><select id="childDisability" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="">Select</option><option>None</option><option>Hearing Impairment</option><option>Visual Impairment</option><option>Physical Disability</option><option>Other</option></select></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Sponsor</label><input type="text" id="childSponsor" placeholder="Unsponsored" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div class="md:col-span-3 flex gap-4"><button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium">Register Child</button></div>
                </form>
            </div>

            <div class="flex flex-col md:flex-row gap-4 mb-6">
                <div class="relative flex-1"><input type="text" id="childSearchInput" oninput="filterChildren()" placeholder="Search children..." class="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-4 pr-4 text-white"></div>
                <div class="flex gap-2">
                    <button onclick="setChildFilter('all')" id="ctab-all" class="px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg">All</button>
                    <button onclick="setChildFilter('active')" id="ctab-active" class="px-5 py-2.5 bg-slate-800 text-slate-400 text-sm font-medium rounded-lg">Active</button>
                    <button onclick="setChildFilter('disability')" id="ctab-disability" class="px-5 py-2.5 bg-slate-800 text-slate-400 text-sm font-medium rounded-lg">With Disability</button>
                    <button onclick="setChildFilter('unsponsored')" id="ctab-unsponsored" class="px-5 py-2.5 bg-slate-800 text-slate-400 text-sm font-medium rounded-lg">Unsponsored</button>
                </div>
            </div>
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table class="w-full text-left"><thead><tr class="text-slate-500 text-xs uppercase border-b border-slate-800"><th class="p-4">ID</th><th class="p-4">Child</th><th class="p-4">Age</th><th class="p-4">Gender</th><th class="p-4">Disability</th><th class="p-4">Education</th><th class="p-4">Sponsor</th><th class="p-4">Actions</th></tr></thead><tbody id="childrenTableBody" class="text-sm"></tbody></table>
            </div>
        </div>
    `;
    filterChildren();
}

let childFilter = 'all';
function setChildFilter(type) {
    childFilter = type;
    ['all', 'active', 'disability', 'unsponsored'].forEach(t => {
        const el = document.getElementById(`ctab-${t}`);
        if (el) el.className = t === type ? "px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg" : "px-5 py-2.5 bg-slate-800 text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-700";
    });
    filterChildren();
}

function filterChildren() {
    const term = document.getElementById('childSearchInput')?.value.toLowerCase() || '';
    let filtered = DB.children.filter(c => c.name.toLowerCase().includes(term) || c.id.toLowerCase().includes(term));
    if (childFilter === 'active') filtered = filtered.filter(c => c.status === 'ACTIVE');
    if (childFilter === 'disability') filtered = filtered.filter(c => c.disability !== 'None');
    if (childFilter === 'unsponsored') filtered = filtered.filter(c => c.sponsor === 'Unsponsored');
    const tbody = document.getElementById('childrenTableBody');
    if (!tbody) return;
    tbody.innerHTML = filtered.map(c => `
        <tr class="cursor-pointer hover:bg-slate-800/30 transition" onclick="viewChildProfile('${c.id}')">
            <td class="p-4 text-slate-400">${c.id}</td>
            <td class="p-4"><div class="flex items-center gap-3"><span class="text-2xl">${c.avatar}</span><span class="text-white font-medium">${c.name}</span></div></td>
            <td class="p-4 text-slate-300">${c.age} yrs</td>
            <td class="p-4 text-slate-400">${c.gender}</td>
            <td class="p-4"><span class="text-xs font-bold ${c.disability === 'None' ? 'text-emerald-400' : 'text-amber-400'}">${c.disability}</span></td>
            <td class="p-4 text-slate-400">${c.educationLevel}</td>
            <td class="p-4 text-slate-400">${c.sponsor}</td>
            <td class="p-4" onclick="event.stopPropagation()">
                <button onclick="viewChildProfile('${c.id}')" class="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20 mr-1">View</button>
                <button onclick="deleteChild('${c.id}')" class="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">Delete</button>
            </td>
        </tr>
    `).join('');
}

function handleAddChild(e) {
    e.preventDefault();
    const dob = new Date(document.getElementById('childDob').value);
    const age = new Date().getFullYear() - dob.getFullYear();
    const gender = document.getElementById('childGender').value;
    const newId = nextId('CH', DB.children);
    DB.children.push({
        id: newId, name: document.getElementById('childName').value,
        age, gender, dob: document.getElementById('childDob').value,
        disability: document.getElementById('childDisability').value,
        healthStatus: "Healthy", educationLevel: "Nursery",
        sponsor: document.getElementById('childSponsor').value || "Unsponsored",
        admissionDate: new Date().toISOString().split('T')[0],
        status: "ACTIVE", avatar: gender === 'Male' ? '👦' : '👧', photo: ""
    });
    DB.milestones = DB.milestones || [];
    DB.milestones.push({
        id: nextId('MS', DB.milestones),
        childId: newId,
        date: new Date().toISOString().split('T')[0],
        type: "Admission",
        title: "Joined Hope Haven",
        description: "Welcome to the family!",
        icon: "🏠"
    });
    saveDB();
    filterChildren();
    document.getElementById('childForm').reset();
    document.getElementById('addChildForm').classList.add('hidden');
    alert('✅ Child registered successfully!');
}

function deleteChild(id) {
    if (confirm("Delete this child record?")) {
        DB.children = DB.children.filter(c => c.id !== id);
        DB.milestones = (DB.milestones || []).filter(m => m.childId !== id);
        DB.healthRecords = DB.healthRecords.filter(h => h.childId !== id);
        DB.education = DB.education.filter(e => e.childId !== id);
        DB.caseNotes = (DB.caseNotes || []).filter(n => n.childId !== id);
        DB.alerts = (DB.alerts || []).filter(a => a.childId !== id);
        saveDB(); filterChildren();
    }
}

// ================= STAFF PAGE =================
function renderStaffPage(container) {
    container.innerHTML = `
        <div class="fade-in">
            <div class="flex justify-between items-center mb-2">
                <h1 class="text-3xl font-bold text-white">Staff Management</h1>
                <div class="flex gap-3">
                    <button onclick="exportTable('staff')" class="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition">⬇ Export Excel</button>
                    <button onclick="document.getElementById('addStaffForm').classList.toggle('hidden')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition">+ Add Staff</button>
                </div>
            </div>
            <p class="text-slate-400 mb-8">${DB.staff.length} staff members</p>

            <div id="addStaffForm" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <h2 class="text-xl font-bold text-white mb-4">Add New Staff Member</h2>
                <form onsubmit="handleAddStaff(event)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Full Name *</label><input type="text" id="stName" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Role *</label>
                        <select id="stRole" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="">Select role...</option><option>Social Worker</option><option>Healthcare Provider</option><option>Educator</option><option>Administrator</option><option>Caregiver</option></select>
                    </div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Email *</label><input type="email" id="stEmail" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Phone *</label><input type="tel" id="stPhone" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Children Assigned</label><input type="number" id="stChildren" value="0" min="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Status *</label>
                        <select id="stStatus" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option>ACTIVE</option><option>ON LEAVE</option><option>SUSPENDED</option><option>RESIGNED</option></select>
                    </div>
                    <div class="md:col-span-3 flex gap-4"><button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium">Add Staff</button></div>
                </form>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table class="w-full text-left"><thead><tr class="text-slate-500 text-xs uppercase border-b border-slate-800"><th class="p-4">ID</th><th class="p-4">Name</th><th class="p-4">Role</th><th class="p-4">Email</th><th class="p-4">Phone</th><th class="p-4">Children</th><th class="p-4">Status</th><th class="p-4">Actions</th></tr></thead>
                <tbody class="text-sm">${DB.staff.map(s => {
                    const cls = s.status === 'ACTIVE' ? 'badge-active' : 'badge-hold';
                    return `<tr><td class="p-4 text-slate-400">${s.id}</td><td class="p-4 text-white font-medium">${s.name}</td><td class="p-4 text-slate-400">${s.role}</td><td class="p-4 text-slate-400">${s.email}</td><td class="p-4 text-slate-400">${s.phone}</td><td class="p-4 text-white font-bold">${s.childrenAssigned}</td><td class="p-4"><span class="badge ${cls}">${s.status}</span></td><td class="p-4"><button onclick="deleteStaff('${s.id}')" class="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">Delete</button></td></tr>`;
                }).join('')}</tbody></table>
            </div>
        </div>
    `;
}

function handleAddStaff(e) {
    e.preventDefault();
    DB.staff.push({
        id: nextId('ST', DB.staff), name: document.getElementById('stName').value,
        role: document.getElementById('stRole').value, email: document.getElementById('stEmail').value,
        phone: document.getElementById('stPhone').value, childrenAssigned: parseInt(document.getElementById('stChildren').value) || 0,
        status: document.getElementById('stStatus').value
    });
    saveDB(); renderDashboard('staff');
    alert('✅ Staff added!');
}
function deleteStaff(id) { if (confirm("Delete this staff member?")) { DB.staff = DB.staff.filter(s => s.id !== id); saveDB(); renderDashboard('staff'); } }

// ================= DONATIONS PAGE =================
function renderDonationsPage(container) {
    const total = DB.donations.reduce((s, d) => s + d.amount, 0);
    container.innerHTML = `
        <div class="fade-in">
            <div class="flex justify-between items-center mb-2">
                <div><h1 class="text-3xl font-bold text-white mb-1">Donations</h1><p class="text-slate-400">${DB.donations.length} donations • ${total.toLocaleString()} FRw total</p></div>
                <div class="flex gap-3">
                    <button onclick="exportTable('donations')" class="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition">⬇ Export Excel</button>
                    <button onclick="document.getElementById('addDonationForm').classList.toggle('hidden')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition">+ Add Donation</button>
                </div>
            </div>

            <div id="addDonationForm" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 mt-6">
                <h2 class="text-xl font-bold text-white mb-4">Record New Donation</h2>
                <form onsubmit="handleAddDonation(event)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Donor Name *</label><input type="text" id="dnDonor" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Type *</label>
                        <select id="dnType" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="Cash">Cash</option><option value="Supplies">Supplies</option></select>
                    </div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Amount (FRw) *</label><input type="number" id="dnAmount" required min="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Date *</label><input type="date" id="dnDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Purpose *</label><input type="text" id="dnPurpose" required placeholder="e.g. General Support" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Method *</label>
                        <select id="dnMethod" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option>Bank Transfer</option><option>Mobile Money</option><option>Cheque</option><option>Cash</option><option>In-Kind</option></select>
                    </div>
                    <div class="md:col-span-3"><button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium">Add Donation</button></div>
                </form>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
                <table class="w-full text-left"><thead><tr class="text-slate-500 text-xs uppercase border-b border-slate-800"><th class="p-4">ID</th><th class="p-4">Date</th><th class="p-4">Donor</th><th class="p-4">Type</th><th class="p-4">Amount</th><th class="p-4">Purpose</th><th class="p-4">Method</th><th class="p-4">Actions</th></tr></thead>
                <tbody class="text-sm">${DB.donations.map(d => {
                    const cls = d.type === 'Cash' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400';
                    return `<tr><td class="p-4 text-slate-400">${d.id}</td><td class="p-4 text-slate-400">${d.date}</td><td class="p-4 text-white font-medium">${d.donor}</td><td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-bold ${cls}">${d.type}</span></td><td class="p-4 text-emerald-400 font-bold">${d.amount.toLocaleString()} FRw</td><td class="p-4 text-slate-400">${d.purpose}</td><td class="p-4 text-slate-400">${d.method}</td><td class="p-4"><button onclick="deleteDonation('${d.id}')" class="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">Delete</button></td></tr>`;
                }).join('')}</tbody></table>
            </div>
        </div>
    `;
}

function handleAddDonation(e) {
    e.preventDefault();
    DB.donations.unshift({
        id: nextId('DN', DB.donations), date: document.getElementById('dnDate').value,
        donor: document.getElementById('dnDonor').value, type: document.getElementById('dnType').value,
        amount: parseInt(document.getElementById('dnAmount').value), purpose: document.getElementById('dnPurpose').value,
        method: document.getElementById('dnMethod').value
    });
    saveDB(); renderDashboard('donations');
    alert('✅ Donation recorded!');
}
function deleteDonation(id) { if (confirm("Delete this donation?")) { DB.donations = DB.donations.filter(d => d.id !== id); saveDB(); renderDashboard('donations'); } }

// ================= HEALTH PAGE =================
function renderHealthPage(container) {
    container.innerHTML = `
        <div class="fade-in">
            <div class="flex justify-between items-center mb-2">
                <div><h1 class="text-3xl font-bold text-white mb-1">Health Records</h1><p class="text-slate-400">${DB.healthRecords.length} medical records</p></div>
                <div class="flex gap-3">
                    <button onclick="exportTable('health')" class="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition">⬇ Export Excel</button>
                    <button onclick="document.getElementById('addHealthForm').classList.toggle('hidden')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition">+ Add Record</button>
                </div>
            </div>

            <div id="addHealthForm" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 mt-6">
                <h2 class="text-xl font-bold text-white mb-4">New Health Record</h2>
                <form onsubmit="handleAddHealth(event)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Child *</label>
                        <select id="hrChild" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="">Select child...</option>${DB.children.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
                    </div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Date *</label><input type="date" id="hrDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Type *</label><input type="text" id="hrType" required placeholder="e.g. Routine Checkup" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Diagnosis *</label><input type="text" id="hrDiagnosis" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Treatment</label><input type="text" id="hrTreatment" placeholder="None" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Doctor *</label><input type="text" id="hrDoctor" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Status *</label>
                        <select id="hrStatus" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option>Completed</option><option>Ongoing</option><option>Pending</option></select>
                    </div>
                    <div class="md:col-span-3"><button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium">Add Record</button></div>
                </form>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
                <table class="w-full text-left"><thead><tr class="text-slate-500 text-xs uppercase border-b border-slate-800"><th class="p-4">ID</th><th class="p-4">Child</th><th class="p-4">Date</th><th class="p-4">Type</th><th class="p-4">Diagnosis</th><th class="p-4">Treatment</th><th class="p-4">Doctor</th><th class="p-4">Status</th></tr></thead>
                <tbody class="text-sm">${DB.healthRecords.map(h => {
                    const child = DB.children.find(c => c.id === h.childId);
                    const cls = h.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400';
                    return `<tr><td class="p-4 text-slate-400">${h.id}</td><td class="p-4 text-white font-medium">${child ? child.name : 'Unknown'}</td><td class="p-4 text-slate-400">${h.date}</td><td class="p-4 text-slate-400">${h.type}</td><td class="p-4 text-slate-300">${h.diagnosis}</td><td class="p-4 text-slate-400">${h.treatment}</td><td class="p-4 text-slate-400">${h.doctor}</td><td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-bold ${cls}">${h.status}</span></td></tr>`;
                }).join('')}</tbody></table>
            </div>
        </div>
    `;
}

function handleAddHealth(e) {
    e.preventDefault();
    DB.healthRecords.push({
        id: nextId('HR', DB.healthRecords), childId: document.getElementById('hrChild').value,
        date: document.getElementById('hrDate').value, type: document.getElementById('hrType').value,
        diagnosis: document.getElementById('hrDiagnosis').value, treatment: document.getElementById('hrTreatment').value || "None",
        doctor: document.getElementById('hrDoctor').value, status: document.getElementById('hrStatus').value
    });
    saveDB(); renderDashboard('health');
    alert('✅ Health record added!');
}

// ================= EDUCATION PAGE =================
function renderEducationPage(container) {
    container.innerHTML = `
        <div class="fade-in">
            <div class="flex justify-between items-center mb-2">
                <div><h1 class="text-3xl font-bold text-white mb-1">Education Records</h1><p class="text-slate-400">${DB.education.length} records</p></div>
                <div class="flex gap-3">
                    <button onclick="exportTable('education')" class="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition">⬇ Export Excel</button>
                    <button onclick="document.getElementById('addEducationForm').classList.toggle('hidden')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition">+ Add Record</button>
                </div>
            </div>

            <div id="addEducationForm" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 mt-6">
                <h2 class="text-xl font-bold text-white mb-4">New Education Record</h2>
                <form onsubmit="handleAddEducation(event)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Child *</label>
                        <select id="edChild" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="">Select child...</option>${DB.children.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
                    </div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">School *</label><input type="text" id="edSchool" required placeholder="Hope Primary School" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Level Type *</label>
                        <select id="edLevelType" required onchange="updateLevelNumber()" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="">Select type...</option><option>Nursery</option><option>Primary</option><option>Secondary</option></select>
                    </div>
                    <div id="levelNumberWrap" class="hidden"><label class="block text-sm font-medium mb-2 text-slate-300">Level Number *</label>
                        <select id="edLevelNumber" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></select>
                    </div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Term *</label>
                        <select id="edTerm" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option>Term 1</option><option>Term 2</option><option>Term 3</option></select>
                    </div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Grade (optional)</label>
                        <select id="edGrade" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"><option value="">— No grade yet —</option><option>A+</option><option>A</option><option>A-</option><option>B+</option><option>B</option><option>B-</option><option>C+</option><option>C</option><option>C-</option><option>D</option><option>E</option><option>F</option></select>
                    </div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Attendance</label><input type="text" id="edAttendance" placeholder="e.g. 95%" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Teacher</label><input type="text" id="edTeacher" placeholder="e.g. Ms. Grace" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div class="md:col-span-3"><button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium">Add Record</button></div>
                </form>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
                <table class="w-full text-left"><thead><tr class="text-slate-500 text-xs uppercase border-b border-slate-800"><th class="p-4">Child</th><th class="p-4">School</th><th class="p-4">Level</th><th class="p-4">Term</th><th class="p-4">Grade</th><th class="p-4">Attendance</th><th class="p-4">Teacher</th></tr></thead>
                <tbody class="text-sm">${DB.education.map(e => {
                    const child = DB.children.find(c => c.id === e.childId);
                    const gc = e.grade ? 'text-emerald-400' : 'text-slate-500';
                    return `<tr><td class="p-4 text-white font-medium">${child ? child.name : 'Unknown'}</td><td class="p-4 text-slate-400">${e.school}</td><td class="p-4 text-slate-400">${e.level}</td><td class="p-4 text-slate-400">${e.term}</td><td class="p-4"><span class="${gc} font-bold">${e.grade || '—'}</span></td><td class="p-4 text-slate-300">${e.attendance || '—'}</td><td class="p-4 text-slate-400">${e.teacher || '—'}</td></tr>`;
                }).join('')}</tbody></table>
            </div>
        </div>
    `;
}

function updateLevelNumber() {
    const type = document.getElementById('edLevelType').value;
    const wrap = document.getElementById('levelNumberWrap');
    const select = document.getElementById('edLevelNumber');
    if (!type) { wrap.classList.add('hidden'); return; }
    wrap.classList.remove('hidden');
    let max = type === 'Nursery' ? 3 : 6;
    select.innerHTML = '';
    for (let i = 1; i <= max; i++) select.innerHTML += `<option value="${i}">${type} ${i}</option>`;
}

function handleAddEducation(e) {
    e.preventDefault();
    const type = document.getElementById('edLevelType').value;
    const num = document.getElementById('edLevelNumber').value;
    const level = type === 'Nursery' ? `Nursery ${num}` : `${type} ${num}`;
    DB.education.push({
        id: nextId('ED', DB.education), childId: document.getElementById('edChild').value,
        school: document.getElementById('edSchool').value, level,
        term: document.getElementById('edTerm').value, grade: document.getElementById('edGrade').value || '',
        attendance: document.getElementById('edAttendance').value || '', teacher: document.getElementById('edTeacher').value || ''
    });
    saveDB(); renderDashboard('education');
    alert('✅ Education record added!');
}

// ================= SPONSORS with Matching =================
function renderSponsorsPage(container) {
    const total = DB.sponsors.reduce((s, sp) => s + sp.totalDonated, 0);
    const unsponsored = DB.children.filter(c => c.sponsor === 'Unsponsored');
    container.innerHTML = `
        <div class="fade-in">
            <div class="flex justify-between items-center mb-2">
                <div><h1 class="text-3xl font-bold text-white mb-1">Sponsors</h1><p class="text-slate-400">${DB.sponsors.length} sponsors • ${total.toLocaleString()} FRw donated</p></div>
                <div class="flex gap-3">
                    <button onclick="exportTable('sponsors')" class="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-700 transition">⬇ Export Excel</button>
                    <button onclick="document.getElementById('addSponsorForm').classList.toggle('hidden')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition">+ Add Sponsor</button>
                </div>
            </div>

            ${unsponsored.length ? `
                <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-center gap-4">
                    <span class="text-3xl">💛</span>
                    <div class="flex-1">
                        <p class="text-white font-bold">${unsponsored.length} child${unsponsored.length > 1 ? 'ren' : ''} still need a sponsor</p>
                        <p class="text-slate-400 text-sm">Use the Match button to find the perfect sponsor for each child.</p>
                    </div>
                    <button onclick="openMatchingPanel()" class="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm">🔗 Open Matcher</button>
                </div>
            ` : ''}

            <div id="addSponsorForm" class="hidden bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <h2 class="text-xl font-bold text-white mb-4">Add New Sponsor</h2>
                <form onsubmit="handleAddSponsor(event)" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Name *</label><input type="text" id="spName" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Email</label><input type="email" id="spEmail" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Phone *</label><input type="tel" id="spPhone" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Children Sponsored</label><input type="number" id="spChildren" value="1" min="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Total Donated (FRw)</label><input type="number" id="spDonated" value="0" min="0" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div><label class="block text-sm font-medium mb-2 text-slate-300">Sponsor Since</label><input type="text" id="spSince" value="${new Date().getFullYear()}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    <div class="md:col-span-3"><button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium">Add Sponsor</button></div>
                </form>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${DB.sponsors.map(s => {
                    const sponsored = DB.children.filter(c => c.sponsor === s.name);
                    return `
                    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div><h3 class="text-white font-bold text-lg">${s.name}</h3><p class="text-xs text-slate-500">Sponsor since ${s.since}</p></div>
                            <span class="badge badge-active">${s.status}</span>
                        </div>
                        <div class="grid grid-cols-3 gap-4 text-center mb-4">
                            <div><p class="text-xs text-slate-500 mb-1">Children</p><p class="text-xl font-bold text-emerald-400">${s.childrenSponsored}</p></div>
                            <div><p class="text-xs text-slate-500 mb-1">Donated</p><p class="text-xl font-bold text-blue-400">${(s.totalDonated/1000).toFixed(0)}K</p></div>
                            <div><p class="text-xs text-slate-500 mb-1">Phone</p><p class="text-xs text-slate-400 mt-1">${s.phone}</p></div>
                        </div>
                        ${sponsored.length ? `
                            <div class="mb-4">
                                <p class="text-xs text-slate-500 mb-2">Sponsoring:</p>
                                <div class="flex flex-wrap gap-2">
                                    ${sponsored.map(c => `<span class="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 cursor-pointer" onclick="viewChildProfile('${c.id}')">${c.avatar} ${c.name}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div class="flex gap-2">
                            <button onclick="openMatchingPanel('${s.id}')" class="flex-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">🔗 Match with Child</button>
                            <button onclick="deleteSponsor('${s.id}')" class="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">Delete</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `;
}

function openMatchingPanel(sponsorId = null) {
    const main = document.getElementById('dashboard-content');
    const sponsors = sponsorId ? DB.sponsors.filter(s => s.id === sponsorId) : DB.sponsors;
    const unsponsored = DB.children.filter(c => c.sponsor === 'Unsponsored');

    main.innerHTML = `
        <div class="fade-in">
            <button onclick="renderDashboard('sponsors')" class="text-slate-400 hover:text-white text-sm mb-4">← Back to Sponsors</button>
            <h1 class="text-3xl font-bold text-white mb-2">🔗 Sponsorship Matching</h1>
            <p class="text-slate-400 mb-8">Find the perfect match between sponsors and children in need.</p>

            <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                <h2 class="text-lg font-bold text-white mb-4">💛 Children Awaiting Sponsors (${unsponsored.length})</h2>
                ${unsponsored.length === 0 ? '<p class="text-slate-500 text-center py-8">All children are sponsored! 🎉</p>' : `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${unsponsored.map(c => `
                            <div class="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-4">
                                <div class="text-3xl">${c.avatar}</div>
                                <div class="flex-1"><p class="text-white font-bold">${c.name}</p><p class="text-xs text-slate-400">${c.age} yrs • ${c.gender} • ${c.disability}</p></div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 class="text-lg font-bold text-white mb-4">Suggested Matches</h2>
                <div class="space-y-4">
                    ${sponsors.map(sp => {
                        const matches = unsponsored.filter(c => {
                            const p = sp.preferences || {};
                            if (p.ageMin && c.age < p.ageMin) return false;
                            if (p.ageMax && c.age > p.ageMax) return false;
                            if (p.gender && p.gender !== 'Any' && c.gender !== p.gender) return false;
                            if (p.disabilityFocus && c.disability === 'None') return false;
                            return true;
                        });
                        return `
                            <div class="bg-slate-800 border border-slate-700 rounded-lg p-5">
                                <div class="flex items-center justify-between mb-3">
                                    <div>
                                        <p class="text-white font-bold">${sp.name}</p>
                                        <p class="text-xs text-slate-500">Prefers: Ages ${sp.preferences?.ageMin || '?'}-${sp.preferences?.ageMax || '?'}, ${sp.preferences?.gender || 'Any'}, ${sp.preferences?.disabilityFocus ? 'Disability focus' : 'Any disability'}</p>
                                    </div>
                                    <span class="text-emerald-400 font-bold text-sm">${matches.length} match${matches.length !== 1 ? 'es' : ''}</span>
                                </div>
                                ${matches.length === 0 ? '<p class="text-slate-500 text-sm">No matching children currently.</p>' : `
                                    <div class="space-y-2">
                                        ${matches.map(c => `
                                            <div class="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg p-3">
                                                <div class="flex items-center gap-3">
                                                    <span class="text-2xl">${c.avatar}</span>
                                                    <div><p class="text-white text-sm font-medium">${c.name}</p><p class="text-xs text-slate-400">${c.age} yrs • ${c.gender} • ${c.disability}</p></div>
                                                </div>
                                                <button onclick="confirmMatch('${sp.id}', '${c.id}')" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium">✓ Match</button>
                                            </div>
                                        `).join('')}
                                    </div>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function confirmMatch(sponsorId, childId) {
    const sponsor = DB.sponsors.find(s => s.id === sponsorId);
    const child = DB.children.find(c => c.id === childId);
    if (!sponsor || !child) return;
    if (confirm(`Match ${sponsor.name} with ${child.name}?`)) {
        child.sponsor = sponsor.name;
        sponsor.childrenSponsored = (sponsor.childrenSponsored || 0) + 1;
        DB.milestones = DB.milestones || [];
        DB.milestones.push({
            id: nextId('MS', DB.milestones), childId: childId,
            date: new Date().toISOString().split('T')[0],
            type: "Sponsorship", title: `Sponsored by ${sponsor.name}`,
            description: `${sponsor.name} has committed to supporting ${child.name}'s care and education.`,
            icon: "💝"
        });
        saveDB();
        alert(`✅ ${child.name} is now sponsored by ${sponsor.name}!`);
        openMatchingPanel();
    }
}

function handleAddSponsor(e) {
    e.preventDefault();
    DB.sponsors.push({
        id: nextId('SP', DB.sponsors), name: document.getElementById('spName').value,
        email: document.getElementById('spEmail').value || '—', phone: document.getElementById('spPhone').value,
        childrenSponsored: parseInt(document.getElementById('spChildren').value) || 0,
        totalDonated: parseInt(document.getElementById('spDonated').value) || 0,
        since: document.getElementById('spSince').value, status: "ACTIVE",
        preferences: { ageMin: 5, ageMax: 12, gender: "Any", disabilityFocus: false }
    });
    saveDB(); renderDashboard('sponsors');
    alert('✅ Sponsor added!');
}
function deleteSponsor(id) { if (confirm("Delete this sponsor?")) { DB.sponsors = DB.sponsors.filter(s => s.id !== id); saveDB(); renderDashboard('sponsors'); } }

// ================= REPORTS PAGE =================
function renderReportsPage(container) {
    container.innerHTML = `
        <div class="fade-in">
            <div class="flex justify-between items-center mb-8">
                <div><h1 class="text-3xl font-bold text-white mb-1">Reports & Analytics</h1><p class="text-slate-400">Comprehensive welfare overview</p></div>
                <div class="flex gap-2">
                    <button onclick="updateReport('daily')" id="btn-daily" class="px-4 py-2 bg-slate-800 text-slate-400 text-sm rounded hover:bg-slate-700">Daily</button>
                    <button onclick="updateReport('weekly')" id="btn-weekly" class="px-4 py-2 bg-emerald-500 text-white text-sm rounded">Weekly</button>
                    <button onclick="updateReport('monthly')" id="btn-monthly" class="px-4 py-2 bg-slate-800 text-slate-400 text-sm rounded hover:bg-slate-700">Monthly</button>
                    <button onclick="updateReport('yearly')" id="btn-yearly" class="px-4 py-2 bg-slate-800 text-slate-400 text-sm rounded hover:bg-slate-700">Yearly</button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" id="reportStats"></div>
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <h2 class="text-lg font-bold text-white mb-6">Activity Chart</h2>
                <div class="chart-container"><canvas id="reportChart"></canvas></div>
            </div>
        </div>
    `;
    updateReport('weekly');
}

function updateReport(period) {
    ['daily', 'weekly', 'monthly', 'yearly'].forEach(p => {
        const btn = document.getElementById(`btn-${p}`);
        if (btn) btn.className = p === period ? "px-4 py-2 bg-emerald-500 text-white text-sm rounded" : "px-4 py-2 bg-slate-800 text-slate-400 text-sm rounded hover:bg-slate-700";
    });
    const now = new Date();
    let labels = [], data = [], stats = {};

    if (period === 'daily') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = labels.map((_, i) => DB.donations.filter(d => (new Date(d.date).getDay() + 6) % 7 === i).reduce((s, d) => s + d.amount, 0));
        stats = { newAdmissions: 0, healthCheckups: DB.healthRecords.length, donationsReceived: DB.donations.filter(d => d.date === now.toISOString().split('T')[0]).reduce((s, d) => s + d.amount, 0).toLocaleString() + ' FRw', activeChildren: DB.children.length };
    } else if (period === 'weekly') {
        labels = ['W1', 'W2', 'W3', 'W4'];
        data = [0, 0, 0, 0];
        DB.donations.forEach(d => { const day = new Date(d.date).getDate(); data[Math.min(3, Math.floor((day - 1) / 7))] += d.amount; });
        stats = { newAdmissions: 2, healthCheckups: 12, donationsReceived: '2,900,000 FRw', activeChildren: DB.children.length };
    } else if (period === 'monthly') {
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labels = allMonths.slice(0, now.getMonth() + 1);
        data = labels.map((_, i) => DB.donations.filter(d => new Date(d.date).getMonth() === i).reduce((s, d) => s + d.amount, 0) || Math.round(1500000 + Math.random() * 1000000));
        stats = { newAdmissions: 5, healthCheckups: 48, donationsReceived: '12,400,000 FRw', activeChildren: DB.children.length };
    } else if (period === 'yearly') {
        const y = now.getFullYear();
        labels = [y - 3, y - 2, y - 1, y].map(String);
        data = [18000000, 22000000, 25000000, 20000000];
        stats = { newAdmissions: 24, healthCheckups: 312, donationsReceived: '85,600,000 FRw', activeChildren: DB.children.length };
    }

    document.getElementById('reportStats').innerHTML = `
        <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">NEW ADMISSIONS</p><p class="text-3xl font-bold text-emerald-400">${stats.newAdmissions}</p></div>
        <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">HEALTH CHECKUPS</p><p class="text-3xl font-bold text-blue-400">${stats.healthCheckups}</p></div>
        <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">DONATIONS RECEIVED</p><p class="text-3xl font-bold text-purple-400">${stats.donationsReceived}</p></div>
        <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl"><p class="text-slate-400 text-sm mb-2">ACTIVE CHILDREN</p><p class="text-3xl font-bold text-orange-400">${stats.activeChildren}</p></div>
    `;
    drawChart('reportChart', 'bar', data, 'Activity');
}

// ================= REPORT CENTER =================
function renderReportCenterPage(container) {
    container.innerHTML = `
        <div class="fade-in">
            <h1 class="text-3xl font-bold text-white mb-2">📄 Report Center</h1>
            <p class="text-slate-400 mb-8">Generate professional reports for donors, staff, and stakeholders.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 card-hover cursor-pointer" onclick="generateReport('monthly')">
                    <div class="text-4xl mb-3">📊</div>
                    <h3 class="text-white font-bold text-lg mb-2">Monthly Welfare Report</h3>
                    <p class="text-slate-400 text-sm mb-4">Complete overview of children, health, education, and donations for the current month.</p>
                    <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm">Generate →</button>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 card-hover cursor-pointer" onclick="generateReport('donor')">
                    <div class="text-4xl mb-3">💝</div>
                    <h3 class="text-white font-bold text-lg mb-2">Donor Transparency Report</h3>
                    <p class="text-slate-400 text-sm mb-4">Show donors exactly how their money is being used.</p>
                    <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm">Generate →</button>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 card-hover cursor-pointer" onclick="generateReport('child')">
                    <div class="text-4xl mb-3">👶</div>
                    <h3 class="text-white font-bold text-lg mb-2">Child Progress Report</h3>
                    <p class="text-slate-400 text-sm mb-4">Individual child progress with milestones, health, and education.</p>
                    <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm">Generate →</button>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 card-hover cursor-pointer" onclick="generateReport('health')">
                    <div class="text-4xl mb-3">🏥</div>
                    <h3 class="text-white font-bold text-lg mb-2">Health Summary</h3>
                    <p class="text-slate-400 text-sm mb-4">All checkups, treatments, and health alerts.</p>
                    <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm">Generate →</button>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 card-hover cursor-pointer" onclick="generateReport('education')">
                    <div class="text-4xl mb-3">📚</div>
                    <h3 class="text-white font-bold text-lg mb-2">Education Summary</h3>
                    <p class="text-slate-400 text-sm mb-4">Grades, attendance, and academic progress.</p>
                    <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm">Generate →</button>
                </div>

                <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 card-hover cursor-pointer" onclick="generateReport('sponsor')">
                    <div class="text-4xl mb-3">🤝</div>
                    <h3 class="text-white font-bold text-lg mb-2">Sponsor Impact Report</h3>
                    <p class="text-slate-400 text-sm mb-4">Show each sponsor the impact of their generosity.</p>
                    <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm">Generate →</button>
                </div>
            </div>
        </div>
    `;
}

function generateReport(type) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const reportWindow = window.open('', '_blank');
    let html = `
        <html><head><title>Hope Haven Report</title>
        <style>
            body { font-family: Georgia, serif; color: #333; max-width: 900px; margin: 40px auto; padding: 20px; line-height: 1.6; }
            h1 { color: #047857; border-bottom: 3px solid #047857; padding-bottom: 10px; }
            h2 { color: #065f46; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background: #ecfdf5; color: #065f46; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: bold; color: #047857; }
            .meta { color: #666; font-size: 14px; }
            .footer { text-align: center; margin-top: 60px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style></head><body>
        <div class="header">
            <div class="logo">🏠 Hope Haven</div>
            <p class="meta">Children Welfare Management System</p>
            <p class="meta">KG 7 Ave, Kigali, Rwanda • info@hopehaven.org • +250 780 565 497</p>
        </div>
    `;

    if (type === 'monthly') {
        const totalDonations = DB.donations.reduce((s, d) => s + d.amount, 0);
        html += `<h1>Monthly Welfare Report</h1><p class="meta">Generated on ${dateStr}</p>
            <h2>Overview</h2>
            <table><tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Total Children in Care</td><td><strong>${DB.children.length}</strong></td></tr>
                <tr><td>Active Staff</td><td>${DB.staff.filter(s => s.status === 'ACTIVE').length}</td></tr>
                <tr><td>Total Donations Received</td><td>${totalDonations.toLocaleString()} FRw</td></tr>
                <tr><td>Health Records</td><td>${DB.healthRecords.length}</td></tr>
                <tr><td>Education Records</td><td>${DB.education.length}</td></tr>
                <tr><td>Milestones Captured</td><td>${(DB.milestones || []).length}</td></tr>
            </table>
            <h2>Children Summary</h2>
            <table><tr><th>ID</th><th>Name</th><th>Age</th><th>Disability</th><th>Education</th><th>Sponsor</th></tr>
                ${DB.children.map(c => `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.age}</td><td>${c.disability}</td><td>${c.educationLevel}</td><td>${c.sponsor}</td></tr>`).join('')}
            </table>`;
    } else if (type === 'donor') {
        const total = DB.donations.reduce((s, d) => s + d.amount, 0);
        html += `<h1>Donor Transparency Report</h1><p class="meta">Generated on ${dateStr}</p>
            <h2>Where Your Money Goes</h2>
            <table><tr><th>Category</th><th>Amount (FRw)</th><th>Percentage</th></tr>
                <tr><td>Education</td><td>${Math.round(total * 0.60).toLocaleString()}</td><td>60%</td></tr>
                <tr><td>Healthcare</td><td>${Math.round(total * 0.25).toLocaleString()}</td><td>25%</td></tr>
                <tr><td>Daily Needs</td><td>${Math.round(total * 0.10).toLocaleString()}</td><td>10%</td></tr>
                <tr><td>Administrative</td><td>${Math.round(total * 0.05).toLocaleString()}</td><td>5%</td></tr>
                <tr><th>Total</th><th>${total.toLocaleString()}</th><th>100%</th></tr>
            </table>
            <h2>Donation History</h2>
            <table><tr><th>Date</th><th>Donor</th><th>Type</th><th>Amount</th><th>Purpose</th></tr>
                ${DB.donations.map(d => `<tr><td>${d.date}</td><td>${d.donor}</td><td>${d.type}</td><td>${d.amount.toLocaleString()} FRw</td><td>${d.purpose}</td></tr>`).join('')}
            </table>`;
    } else if (type === 'child') {
        html += `<h1>Child Progress Report</h1><p class="meta">Generated on ${dateStr}</p>`;
        DB.children.forEach(c => {
            const ms = (DB.milestones || []).filter(m => m.childId === c.id);
            const hr = DB.healthRecords.filter(h => h.childId === c.id);
            const ed = DB.education.filter(e => e.childId === c.id);
            html += `<h2>${c.avatar} ${c.name} (${c.id})</h2>
                <p><strong>Age:</strong> ${c.age} years • <strong>Gender:</strong> ${c.gender} • <strong>Disability:</strong> ${c.disability} • <strong>Sponsor:</strong> ${c.sponsor}</p>
                <h3>Milestones (${ms.length})</h3>
                ${ms.length ? `<ul>${ms.map(m => `<li><strong>${m.date}</strong> — ${m.title}: ${m.description}</li>`).join('')}</ul>` : '<p><em>No milestones recorded.</em></p>'}
                <h3>Health Records (${hr.length})</h3>
                ${hr.length ? `<table><tr><th>Date</th><th>Type</th><th>Diagnosis</th><th>Status</th></tr>${hr.map(h => `<tr><td>${h.date}</td><td>${h.type}</td><td>${h.diagnosis}</td><td>${h.status}</td></tr>`).join('')}</table>` : '<p><em>No health records.</em></p>'}
                <h3>Education Records (${ed.length})</h3>
                ${ed.length ? `<table><tr><th>School</th><th>Level</th><th>Term</th><th>Grade</th></tr>${ed.map(e => `<tr><td>${e.school}</td><td>${e.level}</td><td>${e.term}</td><td>${e.grade || '—'}</td></tr>`).join('')}</table>` : '<p><em>No education records.</em></p>'}
                <hr style="margin: 40px 0; border: 1px dashed #ccc;">`;
        });
    } else if (type === 'health') {
        html += `<h1>Health Summary Report</h1><p class="meta">Generated on ${dateStr}</p>
            <table><tr><th>Date</th><th>Child</th><th>Type</th><th>Diagnosis</th><th>Treatment</th><th>Doctor</th><th>Status</th></tr>
                ${DB.healthRecords.map(h => {
                    const child = DB.children.find(c => c.id === h.childId);
                    return `<tr><td>${h.date}</td><td>${child ? child.name : 'Unknown'}</td><td>${h.type}</td><td>${h.diagnosis}</td><td>${h.treatment}</td><td>${h.doctor}</td><td>${h.status}</td></tr>`;
                }).join('')}
            </table>`;
    } else if (type === 'education') {
        html += `<h1>Education Summary Report</h1><p class="meta">Generated on ${dateStr}</p>
            <table><tr><th>Child</th><th>School</th><th>Level</th><th>Term</th><th>Grade</th><th>Attendance</th><th>Teacher</th></tr>
                ${DB.education.map(e => {
                    const child = DB.children.find(c => c.id === e.childId);
                    return `<tr><td>${child ? child.name : 'Unknown'}</td><td>${e.school}</td><td>${e.level}</td><td>${e.term}</td><td>${e.grade || '—'}</td><td>${e.attendance || '—'}</td><td>${e.teacher || '—'}</td></tr>`;
                }).join('')}
            </table>`;
    } else if (type === 'sponsor') {
        html += `<h1>Sponsor Impact Report</h1><p class="meta">Generated on ${dateStr}</p>`;
        DB.sponsors.forEach(sp => {
            const sponsored = DB.children.filter(c => c.sponsor === sp.name);
            html += `<h2>💝 ${sp.name}</h2>
                <p><strong>Sponsor since:</strong> ${sp.since} • <strong>Total donated:</strong> ${sp.totalDonated.toLocaleString()} FRw • <strong>Children sponsored:</strong> ${sp.childrenSponsored}</p>
                ${sponsored.length ? `<h3>Children You Sponsor:</h3><ul>${sponsored.map(c => `<li><strong>${c.name}</strong> (${c.age} yrs, ${c.educationLevel}) — ${c.disability === 'None' ? 'No disability' : c.disability}</li>`).join('')}</ul>` : ''}
                <hr style="margin: 30px 0; border: 1px dashed #ccc;">`;
        });
    }

    html += `<div class="footer">© ${now.getFullYear()} Hope Haven — Children Welfare Management System<br>This report is auto-generated and confidential.</div>
        </body></html>`;

    reportWindow.document.write(html);
    reportWindow.document.close();
}

// ================= PROFILE =================
function renderProfilePage(container) {
    container.innerHTML = `
        <div class="fade-in">
            <h1 class="text-3xl font-bold text-white mb-1">My Profile</h1>
            <p class="text-slate-400 mb-8">Manage your account information.</p>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                    <div class="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">${currentUser.initials}</div>
                    <h2 class="text-xl font-bold text-white">${currentUser.name}</h2>
                    <p class="text-slate-400 text-sm mb-4">${currentUser.role === 'admin' ? 'Administrator' : 'Staff Member'}</p>
                    <span class="badge badge-active">ACTIVE</span>
                </div>
                <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8">
                    <h2 class="text-lg font-bold text-white mb-6">Personal Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div><label class="block text-xs font-bold mb-2 text-slate-400">Full Name</label><input type="text" value="${currentUser.name}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                        <div><label class="block text-xs font-bold mb-2 text-slate-400">Email Address</label><input type="email" value="${currentUser.email}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                        <div><label class="block text-xs font-bold mb-2 text-slate-400">Phone Number</label><input type="text" value="${currentUser.phone || '+250780565497'}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"></div>
                    </div>
                    <button class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition" onclick="alert('Profile saved!')">Save Changes</button>
                </div>
            </div>
        </div>
    `;
}

// ================= EXPORT TO CSV =================
function exportTable(type) {
    let headers = [], rows = [], filename = '';
    if (type === 'children') { headers = ['ID', 'Name', 'Age', 'Gender', 'DOB', 'Disability', 'Education', 'Sponsor', 'Admission', 'Status']; rows = DB.children.map(c => [c.id, c.name, c.age, c.gender, c.dob, c.disability, c.educationLevel, c.sponsor, c.admissionDate, c.status]); filename = 'Children_Report.csv'; }
    else if (type === 'staff') { headers = ['ID', 'Name', 'Role', 'Email', 'Phone', 'Children', 'Status']; rows = DB.staff.map(s => [s.id, s.name, s.role, s.email, s.phone, s.childrenAssigned, s.status]); filename = 'Staff_Report.csv'; }
    else if (type === 'donations') { headers = ['ID', 'Date', 'Donor', 'Type', 'Amount', 'Purpose', 'Method']; rows = DB.donations.map(d => [d.id, d.date, d.donor, d.type, d.amount, d.purpose, d.method]); filename = 'Donations_Report.csv'; }
    else if (type === 'health') { headers = ['ID', 'Child', 'Date', 'Type', 'Diagnosis', 'Treatment', 'Doctor', 'Status']; rows = DB.healthRecords.map(h => { const c = DB.children.find(x => x.id === h.childId); return [h.id, c ? c.name : 'Unknown', h.date, h.type, h.diagnosis, h.treatment, h.doctor, h.status]; }); filename = 'Health_Report.csv'; }
    else if (type === 'education') { headers = ['ID', 'Child', 'School', 'Level', 'Term', 'Grade', 'Attendance', 'Teacher']; rows = DB.education.map(e => { const c = DB.children.find(x => x.id === e.childId); return [e.id, c ? c.name : 'Unknown', e.school, e.level, e.term, e.grade || '—', e.attendance || '—', e.teacher || '—']; }); filename = 'Education_Report.csv'; }
    else if (type === 'sponsors') { headers = ['ID', 'Name', 'Email', 'Phone', 'Children', 'Total Donated', 'Since', 'Status']; rows = DB.sponsors.map(s => [s.id, s.name, s.email, s.phone, s.childrenSponsored, s.totalDonated, s.since, s.status]); filename = 'Sponsors_Report.csv'; }

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// ================= CHART =================
function drawChart(canvasId, type, data, label, period) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    if (currentChartInstance) { currentChartInstance.destroy(); }
    const now = new Date();
    let labels = [];

    // Use explicit period if provided
    if (period === 'daily') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (period === 'weekly') {
        labels = ['W1', 'W2', 'W3', 'W4'];
    } else if (period === 'monthly') {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, data.length);
    } else if (period === 'yearly') {
        const y = now.getFullYear();
        labels = [y - 3, y - 2, y - 1, y].map(String);
    } else {
        // Fallback (for older calls that don't pass period)
        if (data.length === 7) labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        else if (data.length === 4) {
            const y = now.getFullYear();
            labels = data[0] > 1000000 ? [y - 3, y - 2, y - 1, y].map(String) : ['W1', 'W2', 'W3', 'W4'];
        } else labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, data.length);
    }

    currentChartInstance = new Chart(ctx, {
        type, data: { labels, datasets: [{ label, data, borderColor: '#10B981', backgroundColor: type === 'bar' ? '#10B981' : 'rgba(16, 185, 129, 0.1)', borderWidth: 2, fill: type === 'line', tension: 0.4, borderRadius: type === 'bar' ? 6 : 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(51, 65, 85, 0.5)' }, ticks: { color: '#64748B' } }, x: { grid: { display: false }, ticks: { color: '#64748B' } } } }
    });
}