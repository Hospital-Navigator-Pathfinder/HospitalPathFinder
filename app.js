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

// --- UI Logic: Connects the HTML to the Code ---
document.addEventListener("DOMContentLoaded", () => {
    const startSelect = document.getElementById("startNode");
    const endSelect = document.getElementById("endNode");
    const findBtn = document.getElementById("findBtn");
    const outputCard = document.getElementById("output-card");

    // Populate dropdowns from your Graph data
    const rooms = Object.keys(hospitalGraph).sort();
    rooms.forEach(room => {
        let name = room.replace(/_/g, ' '); // Makes "Main_ICU" look like "Main ICU"
        startSelect.add(new Option(name, room));
        endSelect.add(new Option(name, room));
    });

    findBtn.addEventListener("click", () => {
        const start = startSelect.value;
        const end = endSelect.value;
        const result = findShortestPath(start, end);

        outputCard.classList.remove("hidden");
        document.getElementById("path-result").innerText = result.path.join(" ➔ ").replace(/_/g, ' ');
        document.getElementById("distance-result").innerText = "Total Distance: " + result.distance + " meters";
    });
});