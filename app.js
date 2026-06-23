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
        // Rooms - Full Dictionary
        "Main Entrance": "ዋና መግቢያ", "Main Reception Desk": "ዋና መቀበያ ጠረጴዛ", "Emergency Room Triage": "የአደጋ ጊዜ ታካሚዎች መለያ ክፍል", "Emergency Entrance": "የአደጋ ጊዜ መግቢያ", "Pharmacy": "መድኃኒት ቤት", "Cafeteria": "ካፌቴሪያ", "Gift Shop": "የጥቅማጥቅም መሸጫ ሱቅ",
        "Laboratory Waiting Area": "የላብራቶሪ መጠበቂያ ቦታ", "Radiology Department": "የራጅ/ራዲዮሎጂ ክፍል", "Pathology Laboratory": "የፓቶሎጂ ላብራቶሪ", "Blood Bank": "የደም ባንክ", "Dialysis Center": "የዲያሊሲስ ማዕከል",
        "Doctors Lobby": "የሐኪሞች መቀበያ", "Cardiology Wing": "የልብ ሕክምና ክፍል", "Neurology Wing": "የነርቭ ሕክምና ክፍል",
        "Sterile Hallway": "ንፁህ ኮሪደር", "Operating Theater 1": "የቀዶ ጥገና ክፍል 1", "Operating Theater 2": "የቀዶ ጥገና ክፍል 2", "Recovery Ward": "የማገገሚያ ክፍል",
        "Central Nursing Station": "ማዕከላዊ የነርሶች ጣቢያ", "Pediatric Ward": "የሕፃናት ሕክምና ክፍል", "Maternity Ward": "የወሊድ ክፍል",
        "Security Hub": "የጥበቃ ማዕከል", "Intensive Care Unit": "ፅኑ ሕሙማን መከታተያ (ICU)",
        // Floors
        "Underground": "ከርሰ ምድር", "Ground Floor": "ምድር ቤት", "1st Floor": "1ኛ ፎቅ", "2nd Floor": "2ኛ ፎቅ", "3rd Floor": "3ኛ ፎቅ", "4th Floor": "4ኛ ፎቅ", "5th Floor": "5ኛ ፎቅ",
        "Elevator 1": "ሊፍት 1", "Elevator 2": "ሊፍት 2", "Elevator 3": "ሊፍት 3", "Elevator 4": "ሊፍት 4",
        "Parking Central Hub": "ማዕከላዊ የመኪና ማቆሚያ", "Ambulance Bay": "የአምቡላንስ ማቆሚያ", "Downtown Area": "መሀል ከተማ"
    }
};

let currentLang = "en";

function translate(text) {
    let clean = text.replace(/_/g, ' ');
    if (currentLang === "am" && translations.am[clean]) return translations.am[clean];
    return clean;
}

function generateDetailedInstructions(path) {
    let html = "<ol style='padding-left: 20px;'>";
    let i = 0;
    while (i < path.length - 1) {
        let current = path[i], next = path[i+1];
        
        // Identify Elevator shaft
        let curSplit = current.split("_"), nxtSplit = next.split("_");
        let isElevator = (curSplit[0] === "Elevator" && nxtSplit[0] === "Elevator" && curSplit[1] === nxtSplit[1]);

        if (isElevator) {
            let elevID = curSplit[0] + " " + curSplit[1];
            let j = i;
            while (j < path.length - 1 && path[j+1].startsWith(curSplit[0] + "_" + curSplit[1])) { j++; }
            let finalFloor = translate(path[j].split("_").slice(2).join(" "));
            html += (currentLang === "am") 
                ? `<li>በ<b>${translate(elevID)}</b> በቀጥታ ወደ <b>${finalFloor}</b> ይሂዱ</li>`
                : `<li>Take <b>${elevID}</b> directly to the <b>${finalFloor}</b></li>`;
            i = j;
        } else {
            let edge = hospitalGraph[current][next];
            html += (currentLang === "am")
                ? `<li>ከ<b>${translate(current)}</b> ተነስተው ${edge.dist}ሜ <b>${translate(edge.dir)}</b> ወደ <b>${translate(next)}</b> ይራመዱ</li>`
                : `<li>From <b>${translate(current)}</b>, walk <b>${edge.dist}m ${edge.dir}</b> to reach the <b>${translate(next)}</b></li>`;
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
        const hosp = ["Main_Entrance", "North_Hospital", "North_East_Hospital", "East_Hospital", "South_East_Hospital", "South_Hospital", "South_West_Hospital", "West_Hospital", "North_West_Hospital"];
        let min = Infinity, best = null, bestName = "";
        hosp.forEach(h => {
            if (startSelect.value === h) return;
            let r = findShortestPath(startSelect.value, h);
            if (r.distance < min) { min = r.distance; best = r; bestName = h; }
        });
        if (best) {
            outputCard.classList.remove("hidden");
            document.getElementById("path-result").innerHTML = (currentLang === "am" ? `<b style='color:#e74c3c'>🚨 አስቸኳይ አደጋ፡ ወደ ${translate(bestName)} በመሄድ ላይ</b><br>` : "") + generateDetailedInstructions(best.path);
            document.getElementById("distance-result").innerText = (currentLang === "am" ? translations.am.total + " " : "Total Distance: ") + formatDistance(min);
        }
    });
    updateUI();
});