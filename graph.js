const hospitalGraph = {
    // --- CITY LEVEL ---
    "Main_Entrance": { "Main_Reception_Desk": { dist: 15, dir: "North" }, "North_Hospital": { dist: 2500, dir: "North" }, "South_Hospital": { dist: 1800, dir: "South" }, "East_Hospital": { dist: 3100, dir: "East" }, "West_Hospital": { dist: 2200, dir: "West" }, "North_East_Hospital": { dist: 4200, dir: "North East" }, "South_East_Hospital": { dist: 5500, dir: "South East" }, "South_West_Hospital": { dist: 3600, dir: "South West" }, "North_West_Hospital": { dist: 4800, dir: "North West" }, "Downtown_Area": { dist: 500, dir: "South" } },
    "North_Hospital": { "Main_Entrance": { dist: 2500, dir: "South" }, "Uptown_District": { dist: 1000, dir: "North" } },
    "South_Hospital": { "Main_Entrance": { dist: 1800, dir: "North" } },
    "East_Hospital": { "Main_Entrance": { dist: 3100, dir: "West" }, "Residential_Area": { dist: 800, dir: "East" } },
    "West_Hospital": { "Main_Entrance": { dist: 2200, dir: "East" }, "Industrial_Park": { dist: 1200, dir: "West" } },
    "Downtown_Area": { "Main_Entrance": { dist: 500, dir: "North" } },
    "Uptown_District": { "North_Hospital": { dist: 1000, dir: "South" } },
    "Industrial_Park": { "West_Hospital": { dist: 1200, dir: "East" } },
    "Residential_Area": { "East_Hospital": { dist: 800, dir: "West" } },

    // --- UNDERGROUND ---
    "Parking_Central_Hub": { "Ambulance_Bay": { dist: 20, dir: "North" }, "Parking_East_Zone": { dist: 20, dir: "East" }, "Parking_South_Zone": { dist: 20, dir: "South" }, "Parking_West_Zone": { dist: 20, dir: "West" } },
    "Ambulance_Bay": { "Parking_Central_Hub": { dist: 20, dir: "South" }, "Elevator_1_Underground": { dist: 5, dir: "North" }, "Generator_Room": { dist: 10, dir: "East" }, "Maintenance_Workshop": { dist: 10, dir: "West" } },
    "Parking_South_Zone": { "Parking_Central_Hub": { dist: 20, dir: "North" }, "Elevator_2_Underground": { dist: 5, dir: "South" }, "Car_Entrance_South_East": { dist: 10, dir: "East" }, "Car_Entrance_South_West": { dist: 10, dir: "West" } },
    "Parking_East_Zone": { "Parking_Central_Hub": { dist: 20, dir: "West" }, "Elevator_3_Underground": { dist: 5, dir: "East" } },
    "Parking_West_Zone": { "Parking_Central_Hub": { dist: 20, dir: "East" }, "Elevator_4_Underground": { dist: 5, dir: "West" } },
    "Generator_Room": { "Ambulance_Bay": { dist: 10, dir: "West" } },
    "Maintenance_Workshop": { "Ambulance_Bay": { dist: 10, dir: "East" } },
    "Elevator_1_Underground": { "Ambulance_Bay": { dist: 5, dir: "South" }, "Elevator_1_Ground_Floor": { dist: 5, dir: "Up" } },
    "Elevator_2_Underground": { "Parking_South_Zone": { dist: 5, dir: "North" }, "Elevator_2_Ground_Floor": { dist: 5, dir: "Up" } },
    "Elevator_3_Underground": { "Parking_East_Zone": { dist: 5, dir: "West" }, "Elevator_3_Ground_Floor": { dist: 5, dir: "Up" } },
    "Elevator_4_Underground": { "Parking_West_Zone": { dist: 5, dir: "East" }, "Elevator_4_Ground_Floor": { dist: 5, dir: "Up" } },

    // --- GROUND FLOOR ---
    "Main_Reception_Desk": { "Main_Entrance": { dist: 15, dir: "South" }, "Emergency_Room_Triage": { dist: 15, dir: "North West" }, "Pharmacy": { dist: 15, dir: "North East" }, "Cafeteria": { dist: 15, dir: "East" }, "Gift_Shop": { dist: 15, dir: "West" }, "Elevator_1_Ground_Floor": { dist: 20, dir: "North" }, "Elevator_2_Ground_Floor": { dist: 20, dir: "South" } },
    "Emergency_Room_Triage": { "Main_Reception_Desk": { dist: 15, dir: "South East" }, "Emergency_Entrance": { dist: 10, dir: "North" } },
    "Emergency_Entrance": { "Emergency_Room_Triage": { dist: 10, dir: "South" }, "Elevator_1_Ground_Floor": { dist: 5, dir: "East" } },
    "Pharmacy": { "Main_Reception_Desk": { dist: 15, dir: "South West" } },
    "Cafeteria": { "Main_Reception_Desk": { dist: 15, dir: "West" } },
    "Gift_Shop": { "Main_Reception_Desk": { dist: 15, dir: "East" } },
    "Elevator_1_Ground_Floor": { "Elevator_1_Underground": { dist: 5, dir: "Down" }, "Elevator_1_1st_Floor": { dist: 5, dir: "Up" }, "Main_Reception_Desk": { dist: 20, dir: "South" } },
    "Elevator_2_Ground_Floor": { "Elevator_2_Underground": { dist: 5, dir: "Down" }, "Elevator_2_1st_Floor": { dist: 5, dir: "Up" }, "Main_Reception_Desk": { dist: 20, dir: "North" } },

    // --- 1st FLOOR ---
    "Laboratory_Waiting_Area": { "Radiology_Department": { dist: 15, dir: "North East" }, "Pathology_Laboratory": { dist: 15, dir: "North West" }, "Blood_Bank": { dist: 15, dir: "South East" }, "Dialysis_Center": { dist: 15, dir: "South West" }, "Elevator_1_1st_Floor": { dist: 20, dir: "North" } },
    "Radiology_Department": { "Laboratory_Waiting_Area": { dist: 15, dir: "South West" } },
    "Pathology_Laboratory": { "Laboratory_Waiting_Area": { dist: 15, dir: "South East" } },
    "Blood_Bank": { "Laboratory_Waiting_Area": { dist: 15, dir: "North West" } },
    "Dialysis_Center": { "Laboratory_Waiting_Area": { dist: 15, dir: "North East" } },
    "Elevator_1_1st_Floor": { "Laboratory_Waiting_Area": { dist: 20, dir: "South" }, "Elevator_1_Ground_Floor": { dist: 5, dir: "Down" }, "Elevator_1_2nd_Floor": { dist: 5, dir: "Up" } },

    // --- 2nd FLOOR ---
    "Doctors_Lobby": { "Cardiology_Wing": { dist: 15, dir: "North East" }, "Neurology_Wing": { dist: 15, dir: "North West" }, "Oncology_Department": { dist: 15, dir: "South East" }, "Orthopedics_Clinic": { dist: 15, dir: "South West" }, "Elevator_1_2nd_Floor": { dist: 20, dir: "North" } },
    "Cardiology_Wing": { "Doctors_Lobby": { dist: 15, dir: "South West" } },
    "Neurology_Wing": { "Doctors_Lobby": { dist: 15, dir: "South East" } },
    "Oncology_Department": { "Doctors_Lobby": { dist: 15, dir: "North West" } },
    "Orthopedics_Clinic": { "Doctors_Lobby": { dist: 15, dir: "North East" } },
    "Elevator_1_2nd_Floor": { "Doctors_Lobby": { dist: 20, dir: "South" }, "Elevator_1_1st_Floor": { dist: 5, dir: "Down" }, "Elevator_1_3rd_Floor": { dist: 5, dir: "Up" } },

    // --- 3rd FLOOR ---
    "Sterile_Hallway": { "Operating_Theater_1": { dist: 10, dir: "North" }, "Operating_Theater_2": { dist: 10, dir: "South" }, "Recovery_Ward": { dist: 15, dir: "East" }, "Pre_Surgery_Preparation_Room": { dist: 15, dir: "West" }, "Elevator_1_3rd_Floor": { dist: 20, dir: "North" } },
    "Operating_Theater_1": { "Sterile_Hallway": { dist: 10, dir: "South" } },
    "Operating_Theater_2": { "Sterile_Hallway": { dist: 10, dir: "North" } },
    "Recovery_Ward": { "Sterile_Hallway": { dist: 15, dir: "West" } },
    "Pre_Surgery_Preparation_Room": { "Sterile_Hallway": { dist: 15, dir: "East" } },
    "Elevator_1_3rd_Floor": { "Sterile_Hallway": { dist: 20, dir: "South" }, "Elevator_1_2nd_Floor": { dist: 5, dir: "Down" }, "Elevator_1_4th_Floor": { dist: 5, dir: "Up" } },

    // --- 4th FLOOR ---
    "Central_Nursing_Station": { "Pediatric_Ward": { dist: 15, dir: "North East" }, "Maternity_Ward": { dist: 15, dir: "North West" }, "General_Ward_A": { dist: 15, dir: "South East" }, "General_Ward_B": { dist: 15, dir: "South West" }, "Elevator_1_4th_Floor": { dist: 20, dir: "North" } },
    "Pediatric_Ward": { "Central_Nursing_Station": { dist: 15, dir: "South West" } },
    "Maternity_Ward": { "Central_Nursing_Station": { dist: 15, dir: "South East" } },
    "General_Ward_A": { "Central_Nursing_Station": { dist: 15, dir: "North West" } },
    "General_Ward_B": { "Central_Nursing_Station": { dist: 15, dir: "North East" } },
    "Elevator_1_4th_Floor": { "Central_Nursing_Station": { dist: 20, dir: "South" }, "Elevator_1_3rd_Floor": { dist: 5, dir: "Down" }, "Elevator_1_5th_Floor": { dist: 5, dir: "Up" } },

    // --- 5th FLOOR ---
    "Security_Hub": { "Intensive_Care_Unit": { dist: 10, dir: "North" }, "Neonatal_Intensive_Care_Unit": { dist: 15, dir: "North West" }, "Private_VIP_Suite": { dist: 15, dir: "South" }, "Administration_Boardroom": { dist: 20, dir: "South East" }, "Elevator_1_5th_Floor": { dist: 20, dir: "North" } },
    "Intensive_Care_Unit": { "Security_Hub": { dist: 10, dir: "South" } },
    "Neonatal_Intensive_Care_Unit": { "Security_Hub": { dist: 15, dir: "South East" } },
    "Private_VIP_Suite": { "Security_Hub": { dist: 15, dir: "North" } },
    "Administration_Boardroom": { "Security_Hub": { dist: 20, dir: "North West" } },
    "Elevator_1_5th_Floor": { "Security_Hub": { dist: 20, dir: "South" }, "Elevator_1_4th_Floor": { dist: 5, dir: "Down" } }
};