// --- Part 1: Priority Queue ---
// Helps Dijkstra always pick the closest next room
class PriorityQueue {
    constructor() { this.values = []; }
    enqueue(node, priority) {
        this.values.push({ node, priority });
        this.values.sort((a, b) => a.priority - b.priority);
    }
    dequeue() { return this.values.shift(); }
    isEmpty() { return this.values.length === 0; }
}

// --- Part 2: Dijkstra's Algorithm ---
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

// Helper to format distance nicely
function formatDistance(meters) {
    if (meters >= 1000) {
        return (meters / 1000).toFixed(1) + " km";
    }
    return meters + " meters";
}

// --- Part 3: UI Logic (The Website Interaction) ---
document.addEventListener("DOMContentLoaded", () => {
    const startSelect = document.getElementById("startNode");
    const endSelect = document.getElementById("endNode");
    const findBtn = document.getElementById("findBtn");
    const emergencyBtn = document.getElementById("emergencyBtn");
    const outputCard = document.getElementById("output-card");
    const pathResult = document.getElementById("path-result");
    const distanceResult = document.getElementById("distance-result");

    // Populate dropdowns from your Graph data
    const rooms = Object.keys(hospitalGraph).sort();
    
    // Add professional placeholder
    startSelect.add(new Option("📍 Select your current location...", ""));
    
    rooms.forEach(room => {
        let name = room.replace(/_/g, ' '); 
        startSelect.add(new Option(name, room));
        endSelect.add(new Option(name, room));
    });

    // BUTTON 1: Standard Directions
    findBtn.addEventListener("click", () => {
        const start = startSelect.value;
        const end = endSelect.value;

        if (!start || !end) {
            alert("Please select both a start and destination!");
            return;
        }

        const result = findShortestPath(start, end);
        outputCard.classList.remove("hidden");
        pathResult.innerHTML = `<b>Best Route:</b><br>` + result.path.join(" ➔ ").replace(/_/g, ' ');
        distanceResult.innerText = "Total Distance: " + formatDistance(result.distance);
    });

    // BUTTON 2: Smart Emergency Logic
    const allHospitals = [
        "Main_Entrance", "North_Hospital", "NE_Hospital", "East_Hospital", "SE_Hospital", 
        "South_Hospital", "SW_Hospital", "West_Hospital", "NW_Hospital"
    ];

    emergencyBtn.addEventListener("click", () => {
        const start = startSelect.value;
        if (!start) {
            alert("Please select your current location first!");
            return;
        }

        let minDistance = Infinity;
        let closestHospital = "";
        let finalPath = [];

        // Scan all hospitals to find the closest one to the user
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
                `<span style="color: #e74c3c; font-weight: bold;">🚨 EMERGENCY DETECTED!</span><br>` +
                `Nearest Hospital: <b>${closestHospital.replace(/_/g, ' ')}</b><br><br>` +
                `<b>Route:</b> ` + finalPath.join(" ➔ ").replace(/_/g, ' ');
            
            distanceResult.innerText = "Total Distance: " + formatDistance(minDistance);
        }
    });
});