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

// --- FULL DICTIONARY ---
const translations = {
    "am": {
        "title": "🏥 የሆስፒታል አቅጣጫ አመልካች", "current_loc": "📍 አሁን ያሉበት ቦታ:", "destination": "መድረሻ:",
        "get_dir": "አቅጣጫዎችን አግኝ", "emergency_btn": "🚨 አስቸኳይ አደጋ፡ የቅርብ ሆስፒታል ፈልግ",
        "route_title": "ምርጥ አቅጣጫ:", "placeholder": "📍 ያሉበትን ቦታ ይምረጡ...",
        "North": "ወደ ሰሜን", "South": "ወደ ደቡብ", "East": "ወደ ምስራቅ", "West": "ወደ ምዕራብ",
        "North East": "ወደ ሰሜን ምስራቅ", "North West": "ወደ ሰሜን ምዕራብ", "South East": "ወደ ደቡብ ምስራቅ", "South West": "ወደ ደቡብ ምዕራብ",
        "total": "ጠቅላላ ርቀት:", "meters": "ሜትር", "km": "ኪ.ሜ",
        // Floors
        "Underground": "ከርሰ ምድር", "Ground Floor": "ምድር ቤት", "1st Floor": "1ኛ ፎቅ", "2nd Floor": "2ኛ ፎቅ", "3rd Floor": "3ኛ ፎቅ", "4th Floor": "4ኛ ፎቅ", "5th Floor": "5ኛ ፎቅ",
        // Locations
        "Main Entrance": "ዋና መግቢያ", "Main Reception Desk": "ዋና መቀበያ ጠረጴዛ", "Emergency Room Triage": "የአደጋ ጊዜ ታካሚዎች መለያ ክፍል", "Emergency Entrance": "የአደጋ ጊዜ መግቢያ", "Pharmacy": "መድኃኒት ቤት", "Cafeteria": "ካፌቴሪያ", "Gift Shop": "የጥቅማጥቅም መሸጫ ሱቅ",
        "Laboratory Waiting Area": "የላብራቶሪ መጠበቂያ ቦታ", "Radiology Department": "የራጅ ክፍል", "Pathology Laboratory": "የፓቶሎጂ ላብራቶሪ", "Blood Bank": "የደም ባንክ", "Dialysis Center": "የዲያሊሲስ ማዕከል",
        "Doctors Lobby": "የሐኪሞች መቀበያ", "Cardiology Wing": "የልብ ሕክምና ክፍል", "Neurology Wing": "የነርቭ ሕክምና ክፍል", "Oncology Department": "የካንሰር ሕክምና ክፍል", "Orthopedics Clinic": "የአጥንት ሕክምና ክሊኒክ",
        "Sterile Hallway": "ንፁህ ኮሪደር", "Operating Theater 1": "የቀዶ ጥገና ክፍል 1", "Operating Theater 2": "የቀዶ ጥገና ክፍል 2", "Recovery Ward": "የማገገሚያ ክፍል", "Pre Surgery Preparation Room": "ከቀዶ ጥገና በፊት ዝግጅት ክፍል",
        "Central Nursing Station": "ማዕከላዊ የነርሶች ጣቢያ", "Pediatric Ward": "የሕፃናት ሕክምና ክፍል", "Maternity Ward": "የወሊድ ክፍል", "General Ward A": "አጠቃላይ የሕሙማን ክፍል ሀ", "General Ward B": "አጠቃላይ የሕሙማን ክፍል ለ",
        "Security Hub": "የጥበቃ ማዕከል", "Intensive Care Unit": "ፅኑ ሕሙማን መከታተያ (ICU)", "Neonatal Intensive Care Unit": "የጨቅላ ሕፃናት ፅኑ ሕሙማን መከታተያ (NICU)", "Private VIP Suite": "ልዩ የቪአይፒ ክፍል", "Administration Boardroom": "የአስተዳደር የመሰብሰቢያ አዳራሽ",
        "Parking Central Hub": "ማዕከላዊ የመኪና ማቆሚያ", "Ambulance Bay": "የአምቡላንስ ማቆሚያ", "Parking East Zone": "ምስራቅ የመኪና ማቆሚያ ዞን", "Parking South Zone": "ደቡብ የመኪና ማቆሚያ ዞን", "Parking West Zone": "ምዕራብ የመኪና ማቆሚያ ዞን",
        "Car Entrance South East": "ደቡብ ምስራቅ የመኪና መግቢያ", "Car Entrance South West": "ደቡብ ምዕራብ የመኪና መግቢያ", "Maintenance Workshop": "የጥገና አውደ ጥናት", "Generator Room": "የጄኔሬተር ክፍል",
        "Downtown Area": "መሀል ከተማ", "Uptown District": "አፕታውን ዲስትሪክት", "Industrial Park": "የኢንዱስትሪ ፓርክ", "Residential Area": "የመኖሪያ አካባቢ",
        "North Hospital": "ሰሜን ሆስፒታል", "South Hospital": "ደቡብ ሆስፒታል", "East Hospital": "ምስራቅ ሆስፒታል", "West Hospital": "ምዕራብ ሆስፒታል", "North East Hospital": "ሰሜን ምስራቅ ሆስፒታል", "South East Hospital": "ደቡብ ምስራቅ ሆስፒታል", "South West Hospital": "ደቡብ ምዕራብ ሆስፒታል", "North West Hospital": "ሰሜን ምዕራብ ሆስፒታል"
    }
};

let currentLang = "en";

function translate(text) {
    if (!text) return "";
    let clean = text.replace(/_/g, ' ').trim();
    if (currentLang === "am") {
        if (clean.includes("Elevator")) {
            let p = clean.split(" "); let f = p.slice(2).join(" ");
            return `ሊፍት ${p[1]} (${translations.am[f] || f})`;
        }
        return translations.am[clean] || clean;
    }
    return clean;
}

function generateDetailedInstructions(path) {
    let html = "<ol style='padding-left: 20px;'>";
    let i = 0;
    while (i < path.length - 1) {
        let current = path[i], next = path[i+1];
        let curC = current.replace(/_/g, ' '), nxtC = next.replace(/_/g, ' ');

        if (curC.startsWith("Elevator") && nxtC.startsWith("Elevator") && curC.split(" ")[1] === nxtC.split(" ")[1]) {
            let elevID = curC.split(" ")[0] + "_" + curC.split(" ")[1];
            let j = i;
            while (j < path.length - 1 && path[j+1].startsWith(elevID)) { j++; }
            let floor = translate(path[j].split("_").slice(2).join(" "));
            html += (currentLang === "am") ? `<li>በ<b>${translate(elevID)}</b> በቀጥታ ወደ <b>${floor}</b> ይሂዱ</li>` : `<li>Take <b>${elevID.replace(/_/g, ' ')}</b> directly to the <b>${path[j].split("_").slice(2).join(" ")}</b></li>`;
            i = j;
        } else {
            let edge = hospitalGraph[current][next];
            html += (currentLang === "am") ? `<li>ከ<b>${translate(current)}</b> ተነስተው ${edge.dist}ሜ <b>${translate(edge.dir)}</b> ወደ <b>${translate(next)}</b> ይራመዱ</li>` : `<li>From <b>${translate(current)}</b>, walk <b>${edge.dist}m ${edge.dir}</b> to reach the <b>${translate(next)}</b></li>`;
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
    const startSelect = document.getElementById("startNode"), endSelect = document.getElementById("endNode"), langSelect = document.getElementById("languageSelect");
    const findBtn = document.getElementById("findBtn"), emBtn = document.getElementById("emergencyBtn"), output = document.getElementById("output-card");

    function updateUI() {
        document.getElementById("mainTitle").innerText = currentLang === "am" ? translations.am.title : "🏥 Hospital Pathfinder";
        document.getElementById("startLabel").innerText = currentLang === "am" ? translations.am.current_loc : "📍 My Current Location:";
        document.getElementById("endLabel").innerText = currentLang === "am" ? translations.am.destination : "Destination:";
        document.getElementById("routeTitle").innerText = currentLang === "am" ? translations.am.route_title : "Best Route:";
        findBtn.innerText = currentLang === "am" ? translations.am.get_dir : "Get Directions";
        emBtn.innerText = currentLang === "am" ? translations.am.emergency_btn : "🚨 EMERGENCY: Find Nearest Hospital";

        let s = startSelect.value, e = endSelect.value;
        startSelect.innerHTML = ""; endSelect.innerHTML = "";
        startSelect.add(new Option(currentLang === "am" ? translations.am.placeholder : "📍 Select location...", ""));
        Object.keys(hospitalGraph).sort().forEach(room => {
            startSelect.add(new Option(translate(room), room));
            endSelect.add(new Option(translate(room), room));
        });
        startSelect.value = s; endSelect.value = e;
    }

    langSelect.addEventListener("change", (e) => { currentLang = e.target.value; updateUI(); output.classList.add("hidden"); });
    
    findBtn.addEventListener("click", () => {
        if (!startSelect.value || !endSelect.value) return;
        const res = findShortestPath(startSelect.value, endSelect.value);
        output.classList.remove("hidden");
        document.getElementById("path-result").innerHTML = generateDetailedInstructions(res.path);
        document.getElementById("distance-result").innerText = (currentLang === "am" ? translations.am.total + " " : "Total Distance: ") + formatDistance(res.distance);
    });

    emBtn.addEventListener("click", () => {
        const h = ["Main_Entrance", "North_Hospital", "North_East_Hospital", "East_Hospital", "South_East_Hospital", "South_Hospital", "South_West_Hospital", "West_Hospital", "North_West_Hospital"];
        let min = Infinity, best = null, bestName = "";
        h.forEach(x => { if (startSelect.value === x) return; let r = findShortestPath(startSelect.value, x); if (r.distance < min) { min = r.distance; best = r; bestName = x; } });
        if (best) {
            output.classList.remove("hidden");
            document.getElementById("path-result").innerHTML = (currentLang === "am" ? `<b style='color:#e74c3c'>🚨 አስቸኳይ አደጋ፡ ወደ ${translate(bestName)} በመሄድ ላይ</b><br>` : "") + generateDetailedInstructions(best.path);
            document.getElementById("distance-result").innerText = (currentLang === "am" ? translations.am.total + " " : "Total Distance: ") + formatDistance(min);
        }
    });
    updateUI();
});