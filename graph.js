const hospitalGraph = {
    // ==========================================
    // LEVEL -1: UNDERGROUND (Parking & Logistics)
    // ==========================================
    "Parking_Central": { "Ambulance_Bay": 20, "Parking_East": 20, "Parking_South": 20, "Parking_West": 20 },
    "Ambulance_Bay": { "Parking_Central": 20, "E1_L-1": 5, "Generator_Room": 10, "Maintenance_Workshop": 10 },
    "Generator_Room": { "Ambulance_Bay": 10 },
    "Maintenance_Workshop": { "Ambulance_Bay": 10 },
    "Parking_South": { "Parking_Central": 20, "E2_L-1": 5, "Car_Entrance_SE": 10, "Car_Entrance_SW": 10 },
    "Car_Entrance_SE": { "Parking_South": 10 },
    "Car_Entrance_SW": { "Parking_South": 10 },
    "Parking_East": { "Parking_Central": 20, "E3_L-1": 5 },
    "Parking_West": { "Parking_Central": 20, "E4_L-1": 5 },
    
    // Elevators Level -1
    "E1_L-1": { "Ambulance_Bay": 5, "E1_L0": 5 },
    "E2_L-1": { "Parking_South": 5, "E2_L0": 5 },
    "E3_L-1": { "Parking_East": 5, "E3_L0": 5 },
    "E4_L-1": { "Parking_West": 5, "E4_L0": 5 },

    // ==========================================
    // LEVEL 0: GROUND FLOOR (Reception & ER)
    // ==========================================
    "Main_Reception_Desk": { "ER_Triage": 15, "Pharmacy": 15, "Cafeteria": 15, "Main_Entrance": 15, "Gift_Shop": 15, "E1_L0": 20, "E2_L0": 20, "E3_L0": 20, "E4_L0": 20 },
    "ER_Triage": { "Main_Reception_Desk": 15, "Emergency_Entrance": 10 },
    "Emergency_Entrance": { "ER_Triage": 10, "E1_L0": 5 },
    "Pharmacy": { "Main_Reception_Desk": 15 },
    "Cafeteria": { "Main_Reception_Desk": 15 },
    "Main_Entrance": { "Main_Reception_Desk": 15 },
    "Gift_Shop": { "Main_Reception_Desk": 15 },

    // Elevators Level 0
    "E1_L0": { "Emergency_Entrance": 5, "E1_L-1": 5, "E1_L1": 5, "Main_Reception_Desk": 20 },
    "E2_L0": { "E2_L-1": 5, "E2_L1": 5, "Main_Reception_Desk": 20 },
    "E3_L0": { "E3_L-1": 5, "E3_L1": 5, "Main_Reception_Desk": 20 },
    "E4_L0": { "E4_L-1": 5, "E4_L1": 5, "Main_Reception_Desk": 20 },

    // ==========================================
    // LEVEL 1: DIAGNOSTICS (Labs)
    // ==========================================
    "Lab_Waiting_Area": { "Radiology": 15, "Pathology_Lab": 15, "Blood_Bank": 15, "Dialysis_Center": 15, "E1_L1": 20, "E2_L1": 20, "E3_L1": 20, "E4_L1": 20 },
    "Radiology": { "Lab_Waiting_Area": 15 },
    "Pathology_Lab": { "Lab_Waiting_Area": 15 },
    "Blood_Bank": { "Lab_Waiting_Area": 15 },
    "Dialysis_Center": { "Lab_Waiting_Area": 15 },

    // Elevators Level 1
    "E1_L1": { "E1_L0": 5, "E1_L2": 5, "Lab_Waiting_Area": 20 },
    "E2_L1": { "E2_L0": 5, "E2_L2": 5, "Lab_Waiting_Area": 20 },
    "E3_L1": { "E3_L0": 5, "E3_L2": 5, "Lab_Waiting_Area": 20 },
    "E4_L1": { "E4_L0": 5, "E4_L2": 5, "Lab_Waiting_Area": 20 },

    // ==========================================
    // LEVEL 2: SPECIALIZED CLINICS
    // ==========================================
    "Doctors_Lobby": { "Cardiology_Wing": 15, "Neurology_Wing": 15, "Oncology_Dept": 15, "Orthopedics": 15, "E1_L2": 20, "E2_L2": 20, "E3_L2": 20, "E4_L2": 20 },
    "Cardiology_Wing": { "Doctors_Lobby": 15 },
    "Neurology_Wing": { "Doctors_Lobby": 15 },
    "Oncology_Dept": { "Doctors_Lobby": 15 },
    "Orthopedics": { "Doctors_Lobby": 15 },

    // Elevators Level 2
    "E1_L2": { "E1_L1": 5, "E1_L3": 5, "Doctors_Lobby": 20 },
    "E2_L2": { "E2_L1": 5, "E2_L3": 5, "Doctors_Lobby": 20 },
    "E3_L2": { "E3_L1": 5, "E3_L3": 5, "Doctors_Lobby": 20 },
    "E4_L2": { "E4_L1": 5, "E4_L3": 5, "Doctors_Lobby": 20 },

    // ==========================================
    // LEVEL 3: SURGICAL SUITE
    // ==========================================
    "Sterile_Hallway": { "OT1": 10, "OT2": 10, "Recovery_Ward": 15, "Pre_Surgery_Prep": 15, "E1_L3": 20, "E2_L3": 20, "E3_L3": 20, "E4_L3": 20 },
    "OT1": { "Sterile_Hallway": 10, "E1_L3": 5 },
    "OT2": { "Sterile_Hallway": 10, "E2_L3": 5 },
    "Recovery_Ward": { "Sterile_Hallway": 15 },
    "Pre_Surgery_Prep": { "Sterile_Hallway": 15 },

    // Elevators Level 3
    "E1_L3": { "E1_L2": 5, "E1_L4": 5, "OT1": 5, "Sterile_Hallway": 20 },
    "E2_L3": { "E2_L2": 5, "E2_L4": 5, "OT2": 5, "Sterile_Hallway": 20 },
    "E3_L3": { "E3_L2": 5, "E3_L4": 5, "Sterile_Hallway": 20 },
    "E4_L3": { "E4_L2": 5, "E4_L4": 5, "Sterile_Hallway": 20 },

    // ==========================================
    // LEVEL 4: WARDS (Patients)
    // ==========================================
    "Central_Nursing_Station": { "Pediatric_Ward": 15, "Maternity_Ward": 15, "General_Ward_A": 15, "General_Ward_B": 15, "E1_L4": 20, "E2_L4": 20, "E3_L4": 20, "E4_L4": 20 },
    "Pediatric_Ward": { "Central_Nursing_Station": 15 },
    "Maternity_Ward": { "Central_Nursing_Station": 15 },
    "General_Ward_A": { "Central_Nursing_Station": 15 },
    "General_Ward_B": { "Central_Nursing_Station": 15 },

    // Elevators Level 4
    "E1_L4": { "E1_L3": 5, "E1_L5": 5, "Central_Nursing_Station": 20 },
    "E2_L4": { "E2_L3": 5, "E2_L5": 5, "Central_Nursing_Station": 20 },
    "E3_L4": { "E3_L3": 5, "E3_L5": 5, "Central_Nursing_Station": 20 },
    "E4_L4": { "E4_L3": 5, "E4_L5": 5, "Central_Nursing_Station": 20 },

    // ==========================================
    // LEVEL 5: ICU & ADMINISTRATION
    // ==========================================
    "Security_Hub": { "Main_ICU": 10, "NICU": 15, "VIP_Suite": 15, "Admin_Boardroom": 20, "E1_L5": 20, "E2_L5": 20, "E3_L5": 20, "E4_L5": 20 },
    "Main_ICU": { "Security_Hub": 10, "E1_L5": 5 },
    "NICU": { "Security_Hub": 15 },
    "VIP_Suite": { "Security_Hub": 15, "E2_L5": 5 },
    "Admin_Boardroom": { "Security_Hub": 20 },

    // Elevators Level 5
    "E1_L5": { "E1_L4": 5, "Main_ICU": 5, "Security_Hub": 20 },
    "E2_L5": { "E2_L4": 5, "VIP_Suite": 5, "Security_Hub": 20 },
    "E3_L5": { "E3_L4": 5, "Security_Hub": 20 },
    "E4_L5": { "E4_L4": 5, "Security_Hub": 20 }
};