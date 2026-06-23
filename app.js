class PriorityQueue {
    constructor() { this.values = []; }
    enqueue(node, priority) { this.values.push({ node, priority }); this.values.sort((a, b) => a.priority - b.priority); }
    dequeue() { return this.values.shift(); }
    isEmpty() { return this.values.length === 0; }
}

function findShortestPath(startNode, endNode) {
    const distances = {}; const prev = {}; const pq = new PriorityQueue(); let path = [];
    for (let node in hospitalGraph) {
        distances[node] = (node === startNode) ? 0 : Infinity;
        prev[node] = null;
        if (node === startNode) pq.enqueue(node, 0);
    }
    while (!pq.isEmpty()) {
        let smallest = pq.dequeue().node;
        if (smallest === endNode) { while (prev[smallest]) { path.push(smallest); smallest = prev[smallest]; } break; }
        for (let neighbor in hospitalGraph[smallest]) {
            let alt = distances[smallest] + hospitalGraph[smallest][neighbor];
            if (alt < distances[neighbor]) { distances[neighbor] = alt; prev[neighbor] = smallest; pq.enqueue(neighbor, alt); }
        }
    }
    return { path: path.concat(startNode).reverse(), distance: distances[endNode] };
}

// --- TRANSLATION MAP ---
const translations = {
    "am": {
        "title": "🏥 የሆስፒታል አቅጣጫ አመልካች",
        "current_loc": "📍 አሁን ያሉበት ቦታ:",
        "destination": "መድረሻ:",
        "get_dir": "አቅጣጫዎችን አግኝ",
        "emergency_btn": "🚨 አስቸኳይ አደጋ፡ የቅርብ ሆስፒታል ፈልግ",
        "route_title": "ምርጥ አቅጣጫ:",
        "placeholder": "📍 ያሉበትን ቦታ ይምረጡ...",
        "total": "ጠቅላላ ርቀት:",
        "meters": "ሜትር",
        "km": "ኪሎ ሜትር",
        // Instructions
        "walk": "ከ{from} ተነስተው <b>{dist}ሜ</b> ወደ <b>{to}</b> ይራመዱ",
        "elevator": "በ<b>{elev}</b> ወደ <b>{floor}</b> ይውጡ",
        "emerg_head": "🚨 አስቸኳይ አደጋ፡ ወደ {hosp} በመሄድ ላይ",
        // Room Mappings
        "Main Entrance": "ዋና መግቢያ",
        "Main Reception Desk": "ዋና መቀበያ ጠረጴዛ",
        "Pharmacy": "መድኃኒት ቤት",
        "Cafeteria": "ካፌቴሪያ",
        "Emergency Room Triage": "አስቸኳይ አደጋ ምርመራ",
        "Laboratory Waiting Area": "የላብራቶሪ መጠበቂያ ቦታ",
        "Radiology Department": "የራጅ/ራዲዮሎጂ ክፍል",
        "Cardiology Wing": "የልብ ህክምና ክፍል",
        "Intensive Care Unit": "ፅኑ ህሙማን መከታተያ (ICU)",
        "Ground Floor": "ምድር ቤት",
        "Underground": "ከርሰ ምድር",
        "1st Floor": "1ኛ ፎቅ",
        "2nd Floor": "2ኛ ፎቅ",
        "3rd Floor": "3ኛ ፎቅ",
        "4th Floor": "4ኛ ፎቅ",
        "5th Floor": "5ኛ ፎቅ",
        "North Hospital": "ሰሜን ሆስፒታል",
        "Downtown Area": "መሀል ከተማ"
    }
};

let currentLang = "en";

function translate(name) {
    let clean = name.replace(/_/g, ' ');
    if (currentLang === "am" && translations.am[clean]) return translations.am[clean];
    return clean;
}

function generateDetailedInstructions(path) {
    let html = "<ol style='padding-left: 20px;'>";
    for (let i = 0; i < path.length - 1; i++) {
        let current = path[i], next = path[i+1], dist = hospitalGraph[current][next];
        let from = translate(current), to = translate(next);

        if (current.includes("Elevator") && next.includes("Elevator")) {
            let floor = translate(next.split("_").slice(2).join("_"));
            let elev = translate(current.split("_").slice(0,2).join("_"));
            html += (currentLang === "am") 
                ? `<li>በ<b>${elev}</b> ወደ <b>${floor}</b> ይሂዱ</li>`
                : `<li>Take <b>${elev}</b> to <b>${floor}</b></li>`;
        } else {
            html += (currentLang === "am")
                ? `<li>ከ${from} ተነስተው <b>${dist}ሜ</b> ወደ <b>${to}</b> ይራመዱ</li>`
                : `<li>From ${from}, walk <b>${dist}m</b> to <b>${to}</b></li>`;
        }
    }
    return html + "</ol>";
}

function formatDistance(m) {
    if (m >= 1000) return (m/1000).toFixed(1) + (currentLang === "am" ? " ኪ.ሜ" : " km");
    return m + (currentLang === "am" ? " ሜትር" : " meters");
}

document.addEventListener("DOMContentLoaded", () => {
    const startSelect = document.getElementById("startNode");
    const endSelect = document.getElementById("endNode");
    const langSelect = document.getElementById("languageSelect");
    const findBtn = document.getElementById("findBtn");
    const emergencyBtn = document.getElementById("emergencyBtn");
    const outputCard = document.getElementById("output-card");

    function updateUI() {
        // Labels & Titles
        document.getElementById("mainTitle").innerText = currentLang === "am" ? translations.am.title : "🏥 Hospital Pathfinder";
        document.getElementById("startLabel").innerText = currentLang === "am" ? translations.am.current_loc : "📍 My Current Location:";
        document.getElementById("endLabel").innerText = currentLang === "am" ? translations.am.destination : "Destination:";
        document.getElementById("routeTitle").innerText = currentLang === "am" ? translations.am.route_title : "Best Route:";
        findBtn.innerText = currentLang === "am" ? translations.am.get_dir : "Get Directions";
        emergencyBtn.innerText = currentLang === "am" ? translations.am.emergency_btn : "🚨 EMERGENCY: Find Nearest Hospital";

        // Dropdowns
        let s = startSelect.value, e = endSelect.value;
        startSelect.innerHTML = ""; endSelect.innerHTML = "";
        startSelect.add(new Option(currentLang === "am" ? translations.am.placeholder : "📍 Select location...", ""));
        Object.keys(hospitalGraph).sort().forEach(room => {
            startSelect.add(new Option(translate(room), room));
            endSelect.add(new Option(translate(room), room));
        });
        startSelect.value = s; endSelect.value = e;
    }

    langSelect.addEventListener("change", (e) => { currentLang = e.target.value; updateUI(); outputCard.classList.add("hidden"); });

    findBtn.addEventListener("click", () => {
        if (!startSelect.value || !endSelect.value) return alert("Select locations!");
        const res = findShortestPath(startSelect.value, endSelect.value);
        outputCard.classList.remove("hidden");
        document.getElementById("path-result").innerHTML = generateDetailedInstructions(res.path);
        document.getElementById("distance-result").innerText = (currentLang === "am" ? "ጠቅላላ ርቀት: " : "Total Distance: ") + formatDistance(res.distance);
    });

    emergencyBtn.addEventListener("click", () => {
        const hosp = ["Main_Entrance", "North_Hospital", "North_East_Hospital", "East_Hospital", "South_East_Hospital", "South_Hospital", "South_West_Hospital", "West_Hospital", "North_West_Hospital"];
        let min = Infinity, best = null, name = "";
        hosp.forEach(h => {
            if (startSelect.value === h) return;
            let r = findShortestPath(startSelect.value, h);
            if (r.distance < min) { min = r.distance; best = r; name = h; }
        });
        outputCard.classList.remove("hidden");
        document.getElementById("path-result").innerHTML = (currentLang === "am" ? `<b style='color:#e74c3c'>🚨 አስቸኳይ አደጋ፡ ወደ ${translate(name)} በመሄድ ላይ</b><br>` : "") + generateDetailedInstructions(best.path);
        document.getElementById("distance-result").innerText = (currentLang === "am" ? "ጠቅላላ ርቀት: " : "Total Distance: ") + formatDistance(min);
    });

    updateUI();
});