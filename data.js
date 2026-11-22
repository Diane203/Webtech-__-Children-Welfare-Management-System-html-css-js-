// ============================================
// HOPE HAVEN - DUMMY DATABASE (with new collections)
// ============================================

const DEFAULT_DB = {
    users: [
        { id: 1, name: "Admin Hope", email: "admin@hopehaven.rw", password: "admin123", role: "admin", initials: "AH" },
        { id: 2, name: "Diane Igiraneza", email: "diane@hopehaven.rw", password: "staff123", role: "staff", initials: "DI", phone: "+250780565497", childrenManaged: 12, memberSince: "Jan 2024" }
    ],

    children: [
        { id: "CH-001", name: "Aline Mukamana", age: 8, gender: "Female", dob: "2017-03-12", disability: "None", healthStatus: "Healthy", educationLevel: "Primary 2", sponsor: "The Smith Family", admissionDate: "2023-06-15", status: "ACTIVE", avatar: "👧", photo: "" },
        { id: "CH-002", name: "Eric Niyonzima", age: 6, gender: "Male", dob: "2019-07-22", disability: "Hearing Impairment", healthStatus: "Under Treatment", educationLevel: "Primary 1", sponsor: "Grace Church", admissionDate: "2024-01-10", status: "ACTIVE", avatar: "👦", photo: "" },
        { id: "CH-003", name: "Claudine Uwase", age: 10, gender: "Female", dob: "2015-11-05", disability: "None", healthStatus: "Healthy", educationLevel: "Primary 4", sponsor: "Unsponsored", admissionDate: "2022-09-01", status: "ACTIVE", avatar: "👧", photo: "" },
        { id: "CH-004", name: "Patrick Habimana", age: 12, gender: "Male", dob: "2013-02-18", disability: "Physical Disability", healthStatus: "Stable", educationLevel: "Primary 6", sponsor: "Rotary Club", admissionDate: "2021-05-20", status: "ACTIVE", avatar: "👦", photo: "" },
        { id: "CH-005", name: "Marie Claire", age: 7, gender: "Female", dob: "2018-08-30", disability: "None", healthStatus: "Healthy", educationLevel: "Primary 1", sponsor: "The Johnsons", admissionDate: "2024-03-05", status: "ACTIVE", avatar: "👧", photo: "" },
        { id: "CH-006", name: "Emmanuel Nshuti", age: 9, gender: "Male", dob: "2016-12-14", disability: "Visual Impairment", healthStatus: "Under Treatment", educationLevel: "Primary 3", sponsor: "Unsponsored", admissionDate: "2023-02-28", status: "ACTIVE", avatar: "👦", photo: "" },
        { id: "CH-007", name: "Diane Ingabire", age: 5, gender: "Female", dob: "2020-04-09", disability: "None", healthStatus: "Healthy", educationLevel: "Nursery", sponsor: "Hope Foundation", admissionDate: "2024-06-12", status: "ACTIVE", avatar: "👧", photo: "" },
        { id: "CH-008", name: "Jean Pierre", age: 11, gender: "Male", dob: "2014-09-25", disability: "None", healthStatus: "Healthy", educationLevel: "Primary 5", sponsor: "The Browns", admissionDate: "2022-11-18", status: "ACTIVE", avatar: "👦", photo: "" }
    ],

    staff: [
        { id: "ST-001", name: "Diane Igiraneza", role: "Social Worker", email: "diane@hopehaven.rw", phone: "+250780565497", childrenAssigned: 12, status: "ACTIVE" },
        { id: "ST-002", name: "Dr. Alice Uwimana", role: "Healthcare Provider", email: "alice@hopehaven.rw", phone: "+250788123456", childrenAssigned: 24, status: "ACTIVE" },
        { id: "ST-003", name: "Mr. Robert Nzeyimana", role: "Educator", email: "robert@hopehaven.rw", phone: "+250722345678", childrenAssigned: 18, status: "ACTIVE" },
        { id: "ST-004", name: "Ms. Grace Mukamana", role: "Administrator", email: "grace@hopehaven.rw", phone: "+250733456789", childrenAssigned: 0, status: "ACTIVE" },
        { id: "ST-005", name: "Mr. Samuel Habimana", role: "Caregiver", email: "samuel@hopehaven.rw", phone: "+250788567890", childrenAssigned: 8, status: "ON LEAVE" }
    ],

    donations: [
        { id: "DN-001", date: "2026-09-21", donor: "The Smith Family", type: "Cash", amount: 500000, purpose: "General Support", method: "Bank Transfer" },
        { id: "DN-002", date: "2026-09-20", donor: "Grace Church", type: "Supplies", amount: 250000, purpose: "School Materials", method: "In-Kind" },
        { id: "DN-003", date: "2026-09-18", donor: "Rotary Club", type: "Cash", amount: 1200000, purpose: "Medical Fund", method: "Cheque" },
        { id: "DN-004", date: "2026-09-15", donor: "Hope Foundation", type: "Cash", amount: 800000, purpose: "Education Sponsorship", method: "Mobile Money" },
        { id: "DN-005", date: "2026-09-12", donor: "The Johnsons", type: "Supplies", amount: 150000, purpose: "Clothing & Bedding", method: "In-Kind" }
    ],

    healthRecords: [
        { id: "HR-001", childId: "CH-001", date: "2026-09-10", type: "Routine Checkup", diagnosis: "Healthy", treatment: "None", doctor: "Dr. Alice Uwimana", status: "Completed" },
        { id: "HR-002", childId: "CH-002", date: "2026-09-08", type: "Specialist Visit", diagnosis: "Hearing Impairment", treatment: "Hearing Aid Fitting", doctor: "Dr. Kagame", status: "Ongoing" },
        { id: "HR-003", childId: "CH-004", date: "2026-09-05", type: "Physiotherapy", diagnosis: "Physical Disability", treatment: "Physiotherapy Session", doctor: "Dr. Alice Uwimana", status: "Ongoing" },
        { id: "HR-004", childId: "CH-006", date: "2026-09-01", type: "Eye Clinic", diagnosis: "Visual Impairment", treatment: "Glasses Prescription", doctor: "Dr. Mukamana", status: "Completed" }
    ],

    education: [
        { id: "ED-001", childId: "CH-001", school: "Hope Primary School", level: "Primary 2", term: "Term 3", grade: "A", attendance: "95%", teacher: "Ms. Grace" },
        { id: "ED-002", childId: "CH-003", school: "Hope Primary School", level: "Primary 4", term: "Term 3", grade: "B+", attendance: "92%", teacher: "Mr. Robert" },
        { id: "ED-003", childId: "CH-004", school: "Hope Primary School", level: "Primary 6", term: "Term 3", grade: "B", attendance: "88%", teacher: "Mr. Robert" },
        { id: "ED-004", childId: "CH-008", school: "Hope Primary School", level: "Primary 5", term: "Term 3", grade: "A-", attendance: "94%", teacher: "Ms. Grace" }
    ],

    sponsors: [
        { id: "SP-001", name: "The Smith Family", email: "smith@email.com", phone: "+250788111222", childrenSponsored: 1, totalDonated: 2500000, since: "2023", status: "ACTIVE", preferences: { ageMin: 5, ageMax: 10, gender: "Any", disabilityFocus: false } },
        { id: "SP-002", name: "Grace Church", email: "grace@church.rw", phone: "+250722333444", childrenSponsored: 1, totalDonated: 1800000, since: "2024", status: "ACTIVE", preferences: { ageMin: 4, ageMax: 12, gender: "Any", disabilityFocus: true } },
        { id: "SP-003", name: "Rotary Club", email: "rotary@club.rw", phone: "+250733555666", childrenSponsored: 1, totalDonated: 4500000, since: "2021", status: "ACTIVE", preferences: { ageMin: 6, ageMax: 15, gender: "Any", disabilityFocus: true } },
        { id: "SP-004", name: "The Johnsons", email: "johnson@email.com", phone: "+250788777888", childrenSponsored: 1, totalDonated: 1200000, since: "2024", status: "ACTIVE", preferences: { ageMin: 5, ageMax: 10, gender: "Female", disabilityFocus: false } }
    ],

    // 🆕 FEATURE 1: Child Progress Timeline
    milestones: [
        { id: "MS-001", childId: "CH-001", date: "2023-06-15", type: "Admission", title: "Joined Hope Haven", description: "Admitted to our care after losing both parents.", icon: "🏠" },
        { id: "MS-002", childId: "CH-001", date: "2023-09-01", type: "Education", title: "Enrolled in Primary 1", description: "Started school at Hope Primary School.", icon: "📚" },
        { id: "MS-003", childId: "CH-001", date: "2024-06-12", type: "Achievement", title: "Best Student Award", description: "Won best student in her class for Term 3.", icon: "🏆" },
        { id: "MS-004", childId: "CH-001", date: "2024-10-20", type: "Health", title: "Full Vaccination Complete", description: "Completed all required vaccinations.", icon: "💉" },
        { id: "MS-005", childId: "CH-002", date: "2024-01-10", type: "Admission", title: "Joined Hope Haven", description: "Referred by local social services.", icon: "🏠" },
        { id: "MS-006", childId: "CH-002", date: "2024-03-15", type: "Health", title: "Received Hearing Aid", description: "Fitted with a hearing aid, hearing improved significantly.", icon: "🦻" },
        { id: "MS-007", childId: "CH-002", date: "2025-02-20", type: "Personal", title: "First Words Spoken", description: "Said his first words after hearing aid fitting!", icon: "🌟" },
        { id: "MS-008", childId: "CH-003", date: "2022-09-01", type: "Admission", title: "Joined Hope Haven", description: "Admitted with younger sibling.", icon: "🏠" },
        { id: "MS-009", childId: "CH-004", date: "2021-05-20", type: "Admission", title: "Joined Hope Haven", description: "Admitted with physical disability support needs.", icon: "🏠" },
        { id: "MS-010", childId: "CH-004", date: "2024-08-10", type: "Achievement", title: "Won Sports Competition", description: "Won gold in wheelchair racing at regional games.", icon: "🥇" }
    ],

    // 🆕 FEATURE 2: Smart Alerts
    alerts: [
        { id: "AL-001", childId: "CH-002", type: "Medical Follow-up", severity: "urgent", title: "Hearing aid check due", description: "Eric's hearing aid follow-up was due 3 days ago.", dueDate: "2026-10-02" },
        { id: "AL-002", childId: "CH-006", type: "Medication", severity: "soon", title: "Eye drops refill", description: "Emmanuel needs eye drop refill in 2 days.", dueDate: "2026-10-07" },
        { id: "AL-003", childId: "CH-005", type: "Birthday", severity: "info", title: "Birthday in 3 days", description: "Marie Claire turns 8 in 3 days!", dueDate: "2026-10-08" },
        { id: "AL-004", childId: "CH-004", type: "Vaccination", severity: "soon", title: "Tetanus booster due", description: "Patrick is due for tetanus booster this month.", dueDate: "2026-10-31" },
        { id: "AL-005", childId: "CH-003", type: "Education", severity: "info", title: "Term 3 report pending", description: "Claudine's Term 3 report card not yet uploaded.", dueDate: "2026-10-15" },
        { id: "AL-006", childId: "CH-006", type: "Sponsorship", severity: "urgent", title: "Still unsponsored", description: "Emmanuel has been waiting for a sponsor for 8 months.", dueDate: "2026-10-01" }
    ],

    // 🆕 FEATURE 4: Case Notes
    caseNotes: [
        { id: "CN-001", childId: "CH-001", author: "Diane Igiraneza", date: "2026-10-01", time: "14:30", type: "Behavior", visibility: "Public", content: "Aline was very cheerful today. She helped the younger children with their homework and showed great leadership." },
        { id: "CN-002", childId: "CH-002", author: "Dr. Alice Uwimana", date: "2026-09-28", time: "10:15", type: "Health", visibility: "Private", content: "Eric's hearing is improving steadily with the aid. Continue current routine." },
        { id: "CN-003", childId: "CH-004", author: "Mr. Robert Nzeyimana", date: "2026-09-25", time: "16:00", type: "Education", visibility: "Public", content: "Patrick showed great improvement in mathematics this term. He's very engaged in class." },
        { id: "CN-004", childId: "CH-001", author: "Diane Igiraneza", date: "2026-09-20", time: "09:00", type: "General", visibility: "Public", content: "Aline asked about her sponsor today. I explained how the Smith Family supports her education." }
    ],

    reports: {
        daily: { title: "Today's Overview", newAdmissions: 0, healthCheckups: 3, donationsReceived: "500,000 FRw", activeChildren: 8, chart: [2, 4, 3, 5, 6, 4, 3] },
        weekly: { title: "This Week", newAdmissions: 2, healthCheckups: 12, donationsReceived: "2,900,000 FRw", activeChildren: 8, chart: [450000, 800000, 650000, 1000000] },
        monthly: { title: "This Month", newAdmissions: 5, healthCheckups: 48, donationsReceived: "12,400,000 FRw", activeChildren: 8, chart: [1500000, 1800000, 2200000, 1900000, 2500000, 2800000, 2100000] },
        yearly: { title: "This Year", newAdmissions: 24, healthCheckups: 312, donationsReceived: "85,600,000 FRw", activeChildren: 8, chart: [18000000, 22000000, 25000000, 20000000] }
    }
};

// ================= LOAD FROM LOCALSTORAGE =================
const DB = (function loadDB() {
    const saved = localStorage.getItem('hopeHavenDB');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Ensure new collections exist (for users upgrading from old version)
            parsed.milestones = parsed.milestones || JSON.parse(JSON.stringify(DEFAULT_DB.milestones));
            parsed.alerts = parsed.alerts || JSON.parse(JSON.stringify(DEFAULT_DB.alerts));
            parsed.caseNotes = parsed.caseNotes || JSON.parse(JSON.stringify(DEFAULT_DB.caseNotes));
            parsed.sponsors = parsed.sponsors.map(s => ({
                ...s,
                preferences: s.preferences || { ageMin: 5, ageMax: 12, gender: "Any", disabilityFocus: false }
            }));
            return parsed;
        } catch (e) { console.warn("Corrupt DB, using defaults"); }
    }
    localStorage.setItem('hopeHavenDB', JSON.stringify(DEFAULT_DB));
    return JSON.parse(JSON.stringify(DEFAULT_DB));
})();

// Save any DB change
function saveDB() {
    localStorage.setItem('hopeHavenDB', JSON.stringify(DB));
}

// Generate auto-increment ID
function nextId(prefix, collection, pad = 3) {
    const nums = collection.map(item => parseInt((item.id || "").split('-')[1]) || 0);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `${prefix}-${String(next).padStart(pad, '0')}`;
}