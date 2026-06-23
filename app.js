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
            let alt = distances[smallest] + hospitalGraph[smallest][neighbor].dist;
            if (alt < distances[neighbor]) { distances[neighbor] = alt; prev[neighbor] = smallest; pq.enqueue(neighbor, alt); }
        }
    }
    return { path: path.concat(startNode).reverse(), distance: distances[endNode] };
}

const translations = {
    "am": {
        "title": "🏥 የሆስፒታል አቅጣጫ አመልካች", "current_loc": "📍 አሁን ያሉበት ቦታ:", "destination": "መድረሻ:",
        "get_dir": "አቅጣጫዎችን አግኝ", "emergency_btn": "🚨 አስቸኳይ አደጋ፡ የቅርብ ሆስፒታል ፈልግ",
        "route_title": "ምርጥ አቅጣጫ:", "placeholder": "📍 ያሉበትን ቦታ ይምረጡ...",
        "North": "ወደ ሰሜን", "South": "ወደ ደቡብ", "East": "ወደ ምስራቅ", "West": "ወደ ምዕራብ",
        "North East": "ወደ ሰሜን ምስራቅ", "North West": "ወደ ሰሜን ምዕራብ", "South East": "ወደ ደቡብ ምስራቅ", "South West": "ወደ ደቡብ ምዕራብ",
        "Up": "ወደ ላይ", "Down": "ወደ ታች", "total": "ጠቅላላ ርቀት:",
        // Rooms
        "Underground": "ከርሰ ምድር", "Ground Floor": "ምድር ቤት", "1st Floor": "1ኛ ፎቅ", "2nd Floor": "2ኛ ፎቅ", "3rd Floor": "3ኛ ፎቅ", "4th Floor": "4ኛ ፎቅ", "5th Floor": "5ኛ ፎቅ",
        "Elevator": "ሊፍት", "Main Entrance": "ዋና መግቢያ", "Intensive Care Unit": "ፅኑ ሕሙማን መከታተያ (ICU)"
    }
};

let currentLang = "en";

function translate(text) {
    let clean = text.replace(/_/g, ' ');
    if (currentLang === "am" && translations.am[clean]) return translations.am[clean];
    return clean;
}

function generateDetailedInstructions(path) {
    let html = "<ol style='padding-left: 20px; line-height: 1.8;'>";
    let i = 0;

    while (i < path.length - 1) {
        let current = path[i];
        let next = path[i+1];
        
        // --- 1. SMART ELEVATOR COLLAPSE ---
        if (current.includes("Elevator") && next.includes("Elevator") && current.substring(0,10) === next.substring(0,10)) {
            let elevatorID = current.split("_").slice(0,2).join(" "); // e.g., "Elevator 1"
            let j = i + 1;
            // Scan ahead: find the final destination of this elevator trip
            while (j < path.length - 1 && path[j+1].includes("Elevator") && path[j+1].substring(0,10) === current.substring(0,10)) {
                j++;
            }
            let targetFloor = translate(path[j].split("_").slice(2).join(" "));
            html += (currentLang === "am")
                ? `<li>በ<b>${translate(elevatorID)}</b> በቀጥታ ወደ <b>${targetFloor}</b> ይውጡ</li>`
                : `<li>Take <b>${elevatorID}</b> directly to the <b>${targetFloor}</b></li>`;
            i = j; // Move the index forward to the end of the elevator trip
        } 
        // --- 2. COMPASS NAVIGATION ---
        else {
            let edge = hospitalGraph[current][next];
            let from = translate(current);
            let to = translate(next);
            let direction = translate(edge.dir);
            let distance = edge.dist;

            html += (currentLang === "am")
                ? `<li>ከ${from} ተነስተው <b>${distance}ሜ ${direction}</b> ወደ ${to} ይራመዱ</li>`
                : `<li>From ${from}, walk <b>${distance}m ${direction}</b> to reach the <b>${to}</b></li>`;
            i++;
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
            startSelect.add(new Option(translate(room), room));
            endSelect.add(new Option(translate(room), room));
        });
        startSelect.value = s; endSelect.value = e;
    }

    langSelect.addEventListener("change", (e) => { currentLang = e.target.value; updateUI(); outputCard.classList.add("hidden"); });
    findBtn.addEventListener("click", () => {
        if (!startSelect.value || !endSelect.value) return;
        const res = findShortestPath(startSelect.value, endSelect.value);
        outputCard.classList.remove("hidden");
        document.getElementById("path-result").innerHTML = generateDetailedInstructions(res.path);
        document.getElementById("distance-result").innerText = (currentLang === "am" ? translations.am.total + " " : "Total Distance: ") + formatDistance(res.distance);
    });

    emergencyBtn.addEventListener("click", () => {
        const hospitals = ["Main_Entrance", "North_Hospital", "North_East_Hospital", "East_Hospital", "South_East_Hospital", "South_Hospital", "South_West_Hospital", "West_Hospital", "North_West_Hospital"];
        let min = Infinity, best = null;
        hospitals.forEach(h => {
            if (startSelect.value === h) return;
            let r = findShortestPath(startSelect.value, h);
            if (r.distance < min) { min = r.distance; best = r; }
        });
        if (best) {
            outputCard.classList.remove("hidden");
            document.getElementById("path-result").innerHTML = generateDetailedInstructions(best.path);
            document.getElementById("distance-result").innerText = (currentLang === "am" ? translations.am.total + " " : "Total Distance: ") + formatDistance(min);
        }
    });

    updateUI();
});