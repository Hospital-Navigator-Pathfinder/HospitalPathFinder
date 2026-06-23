class PriorityQueue {
    constructor() { this.values = []; }
    enqueue(node, priority) {
        this.values.push({ node, priority });
        this.values.sort((a, b) => a.priority - b.priority);
    }
    dequeue() { return this.values.shift(); }
    isEmpty() { return this.values.length === 0; }
}

function findShortestPath(startNode, endNode) {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueue();
    let path = [];

    for (let node in hospitalGraph) {
        distances[node] = (node === startNode) ? 0 : Infinity;
        prev[node] = null;
        if (node === startNode) pq.enqueue(node, 0);
    }

    while (!pq.isEmpty()) {
        let smallest = pq.dequeue().node;
        if (smallest === endNode) {
            while (prev[smallest]) {
                path.push(smallest);
                smallest = prev[smallest];
            }
            break;
        }
        for (let neighbor in hospitalGraph[smallest]) {
            let alt = distances[smallest] + hospitalGraph[smallest][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = smallest;
                pq.enqueue(neighbor, alt);
            }
        }
    }
    return { path: path.concat(startNode).reverse(), distance: distances[endNode] };
}

function generateDetailedInstructions(path) {
    let html = "<ol style='padding-left: 20px; line-height: 1.8;'>";
    
    for (let i = 0; i < path.length - 1; i++) {
        let current = path[i];
        let next = path[i+1];
        let dist = hospitalGraph[current][next];
        
        let cleanCurrent = current.replace(/_/g, ' ');
        let cleanNext = next.replace(/_/g, ' ');

        // Logic for Elevator Travel (Now looks for the word "Elevator")
        if (current.includes("Elevator") && next.includes("Elevator") && current.substring(0,10) === next.substring(0,10)) {
            let destFloor = cleanNext.split(" ").slice(2).join(" ");
            html += `<li>Take <b>${cleanCurrent.split(" ")[0]} ${cleanCurrent.split(" ")[1]}</b> up to the <b>${destFloor}</b></li>`;
        } else {
            html += `<li>From ${cleanCurrent}, walk <b>${dist}m</b> to reach the <b>${cleanNext}</b></li>`;
        }
    }
    
    html += "</ol>";
    return html;
}

function formatDistance(meters) {
    if (meters >= 1000) return (meters / 1000).toFixed(1) + " km";
    return meters + " meters";
}

document.addEventListener("DOMContentLoaded", () => {
    const startSelect = document.getElementById("startNode");
    const endSelect = document.getElementById("endNode");
    const findBtn = document.getElementById("findBtn");
    const emergencyBtn = document.getElementById("emergencyBtn");
    const outputCard = document.getElementById("output-card");
    const pathResult = document.getElementById("path-result");
    const distanceResult = document.getElementById("distance-result");

    const rooms = Object.keys(hospitalGraph).sort();
    startSelect.add(new Option("📍 Select your current location...", ""));
    
    rooms.forEach(room => {
        let name = room.replace(/_/g, ' '); 
        startSelect.add(new Option(name, room));
        endSelect.add(new Option(name, room));
    });

    findBtn.addEventListener("click", () => {
        const start = startSelect.value;
        const end = endSelect.value;
        if (!start || !end) return alert("Please select both locations!");

        const result = findShortestPath(start, end);
        outputCard.classList.remove("hidden");
        
        pathResult.innerHTML = `<b>Navigation Steps:</b><br>` + generateDetailedInstructions(result.path);
        distanceResult.innerHTML = `<hr><b>Total Trip:</b> ${formatDistance(result.distance)}`;
    });

    // Updated with non-abbreviated names
    const allHospitals = [
        "Main_Entrance", "North_Hospital", "North_East_Hospital", "East_Hospital", "South_East_Hospital", 
        "South_Hospital", "South_West_Hospital", "West_Hospital", "North_West_Hospital"
    ];

    emergencyBtn.addEventListener("click", () => {
        const start = startSelect.value;
        if (!start) return alert("Please select your location first!");

        let minDistance = Infinity;
        let closestHospital = "";
        let finalPath = [];

        allHospitals.forEach(hosp => {
            if (start === hosp) return;
            const result = findShortestPath(start, hosp);
            if (result.distance < minDistance) {
                minDistance = result.distance;
                closestHospital = hosp;
                finalPath = result.path;
            }
        });

        if (closestHospital) {
            outputCard.classList.remove("hidden");
            pathResult.innerHTML = 
                `<span style="color: #e74c3c; font-weight: bold;">🚨 EMERGENCY: PROCEED TO ${closestHospital.replace(/_/g, ' ')}</span><br><br>` +
                `<b>Driving/Walking Steps:</b><br>` + generateDetailedInstructions(finalPath);
            
            distanceResult.innerHTML = `<hr><b>Total Distance to Help:</b> ${formatDistance(minDistance)}`;
        }
    });
});