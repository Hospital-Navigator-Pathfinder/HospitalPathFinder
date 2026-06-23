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
            // New logic: access .dist inside the neighbor object
            let alt = distances[smallest] + hospitalGraph[smallest][neighbor].dist;
            if (alt < distances[neighbor]) { distances[neighbor] = alt; prev[neighbor] = smallest; pq.enqueue(neighbor, alt); }
        }
    }
    return { path: path.concat(startNode).reverse(), distance: distances[endNode] };
}

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
        // Directions
        "North": "ወደ ሰሜን", "South": "ወደ ደቡብ", "East": "ወደ ምስራቅ", "West": "ወደ ምዕራብ",
        "North East": "ወደ ሰሜን ምስራቅ", "North West": "ወደ ሰሜን ምዕራብ",
        "South East": "ወደ ደቡብ ምስራቅ", "South West": "ወደ ደቡብ ምዕራብ",
        "Up": "ወደ ላይ", "Down": "ወደ ታች",
        // Instructions
        "walk_dir": "ከ{from} ተነስተው {dist}ሜትር <b>{dir}</b> ወደ {to} ይራመዱ",
        "elev_dir": "በ<b>{elev}</b> {dir} ወደ <b>{floor}</b> ይሂዱ",
        // Rooms
        "Main Entrance": "ዋና መግቢያ", "Main Reception Desk": "ዋና መቀበያ ጠረጴዛ",
        "Pharmacy": "መድኃኒት ቤት", "Cafeteria": "ካፌቴሪያ", "Underground": "ከርሰ ምድር", "Ground Floor": "ምድር ቤት"
    }
};

let currentLang = "en";

function translate(text) {
    if (currentLang === "am" && translations.am[text]) return translations.am[text];
    return text;
}

function generateDetailedInstructions(path) {
    let html = "<ol style='padding-left: 20px; line-height: 1.8;'>";
    for (let i = 0; i < path.length - 1; i++) {
        let current = path[i], next = path[i+1];
        let edge = hospitalGraph[current][next];
        let from = translate(current.replace(/_/g, ' ')), to = translate(next.replace(/_/g, ' '));
        let dir = translate(edge.dir);

        if (edge.dir === "Up" || edge.dir === "Down") {
            let floorName = translate(next.split("_").slice(2).join(" "));
            let elevName = translate(current.split("_").slice(0,2).join(" "));
            html += (currentLang === "am") 
                ? `<li>በ<b>${elevName}</b> ${dir} ወደ <b>${floorName}</b> ይሂዱ</li>`
                : `<li>Take <b>${elevName}</b> ${edge.dir.toLowerCase()} to the <b>${floorName}</b></li>`;
        } else {
            html += (currentLang === "am")
                ? `<li>ከ${from} ተነስተው <b>${edge.dist}ሜ</b> <b>${dir}</b> ወደ <b>${to}</b> ይራመዱ</li>`
                : `<li>From ${from}, walk <b>${edge.dist}m ${edge.dir}</b> to reach the <b>${to}</b></li>`;
        }
    }
    return html + "</ol>";
}

function formatDistance(m) {
    if (m >= 1000) return (m/1000).toFixed(1) + (currentLang === "am" ? " ኪ.ሜ" : " km");
    return m + (currentLang === "am" ? " ሜትር" : " meters");
}

document.addEventListener("DOMContentLoaded", () => {
    const startSelect = document.getElementById("startNode"), endSelect = document.getElementById("endNode");
    const langSelect = document.getElementById("languageSelect"), findBtn = document.getElementById("findBtn");
    const emergencyBtn = document.getElementById("emergencyBtn"), outputCard = document.getElementById("output-card");

    function updateUI() {
        document.getElementById("mainTitle").innerText = currentLang === "am" ? translations.am.title : "🏥 Hospital Pathfinder";
        document.getElementById("startLabel").innerText = currentLang === "am" ? translations.am.current_loc : "📍 My Current Location:";
        document.getElementById("endLabel").innerText = currentLang === "am" ? translations.am.destination : "Destination:";
        document.getElementById("routeTitle").innerText = currentLang === "am" ? translations.am.route_title : "Best Route:";
        findBtn.innerText = currentLang === "am" ? translations.am.get_dir : "Get Directions";
        emergencyBtn.innerText = currentLang === "am" ? translations.am.emergency_btn : "🚨 EMERGENCY: Find Nearest Hospital";

        let s = startSelect.value, e = endSelect.value;
        startSelect.innerHTML = ""; endSelect.innerHTML = "";
        startSelect.add(new Option(currentLang === "am" ? translations.am.placeholder : "📍 Select location...", ""));
        Object.keys(hospitalGraph).sort().forEach(room => {
            let clean = room.replace(/_/g, ' ');
            let displayName = (currentLang === "am" && translations.am[clean]) ? translations.am[clean] : clean;
            startSelect.add(new Option(displayName, room));
            endSelect.add(new Option(displayName, room));
        });
        startSelect.value = s; endSelect.value = e;
    }

    langSelect.addEventListener("change", (e) => { currentLang = e.target.value; updateUI(); outputCard.classList.add("hidden"); });
    findBtn.addEventListener("click", () => {
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
        document.getElementById("path-result").innerHTML = (currentLang === "am" ? `<b style='color:#e74c3c'>🚨 አስቸኳይ አደጋ፡ ወደ ${name} በመሄድ ላይ</b><br>` : "") + generateDetailedInstructions(best.path);
    });

    updateUI();
});