def dataGenerator(cls):
    import random
    from datetime import datetime, timedelta
    
    # Sample data for realistic wind turbine generation
    manufacturers = [
        {"name": "Vestas", "country": "Denmark"},
        {"name": "General Electric", "country": "United States"},
        {"name": "Siemens Gamesa", "country": "Spain"},
        {"name": "Goldwind", "country": "China"},
        {"name": "Enercon", "country": "Germany"},
        {"name": "Nordex", "country": "Germany"},
        {"name": "Senvion", "country": "Germany"},
        {"name": "Ming Yang", "country": "China"}
    ]
    
    # Generate realistic coordinates (focus on windy regions)
    locations = [
        {"lat": 41.8781, "lng": -87.6298, "region": "Chicago_IL", "country": "United States"},
        {"lat": 39.7392, "lng": -104.9903, "region": "Denver_CO", "country": "United States"},
        {"lat": 32.7767, "lng": -96.7970, "region": "Dallas_TX", "country": "United States"},
        {"lat": 44.9778, "lng": -93.2650, "region": "Minneapolis_MN", "country": "United States"},
        {"lat": 47.0379, "lng": -122.9007, "region": "Olympia_WA", "country": "United States"},
        {"lat": 40.2732, "lng": -76.8839, "region": "Harrisburg_PA", "country": "United States"},
        {"lat": 41.5868, "lng": -93.6250, "region": "Des_Moines_IA", "country": "United States"},
        {"lat": 39.1612, "lng": -75.5264, "region": "Dover_DE", "country": "United States"}
    ]
    
    # Generate 50 wind turbines
    turbines_to_create = []
    
    for i in range(1, 51):
        manufacturer = random.choice(manufacturers)
        location = random.choice(locations)
        
        # Generate realistic dates
        build_date = datetime.now() - timedelta(days=random.randint(365*2, 365*10))  # 2-10 years ago
        install_date = build_date + timedelta(days=random.randint(30, 180))  # 1-6 months after build
        
        # Create turbine data
        turbine_data = {
            "id": f"WT-{i:03d}",
            "powerData": random.randint(800, 3500),  # kW output
            "latitude": location["lat"] + random.uniform(-0.5, 0.5),  # Add some variance
            "longitude": location["lng"] + random.uniform(-0.5, 0.5),
            "manufacturer": manufacturer["name"],
            "country": location["country"],
            "buildDate": build_date,
            "installationDate": install_date,
            "active": random.choice([True, True, True, False]),  # 75% active
            "windSpeed": round(random.uniform(5.5, 18.5), 1),  # Average wind speed in m/s
            "temperature": round(random.uniform(-10, 35), 1),  # Average temperature in Celsius
            "efficiency": round(random.uniform(75, 95), 1),  # Efficiency percentage
        }
        
        # Generate work orders for this turbine
        work_orders = []
        if random.random() < 0.6:  # 60% chance of having work orders
            num_orders = random.randint(1, 3)
            for j in range(num_orders):
                work_order_data = {
                    "workOrderId": f"WO-{turbine_data['id']}-{j+1:02d}",
                    "turbineId": turbine_data["id"],
                    "title": random.choice([
                        "Blade Inspection",
                        "Gearbox Maintenance", 
                        "Generator Repair",
                        "Tower Inspection",
                        "Control System Update",
                        "Brake System Check"
                    ]),
                    "description": random.choice([
                        "Routine maintenance inspection required",
                        "Unusual vibration detected, needs investigation",
                        "Performance optimization required",
                        "Safety inspection due",
                        "Component replacement needed"
                    ]),
                    "status": random.choice(["Open", "In Progress", "Resolved", "Closed"]),
                    "creationDate": datetime.now() - timedelta(days=random.randint(1, 30)),
                    "assignedTo": random.choice(["John Smith", "Jane Doe", "Mike Johnson", "Sarah Wilson"]),
                    "priority": random.choice(["Low", "Medium", "High", "Critical"])
                }
                
                # Set due date
                work_order_data["dueDate"] = work_order_data["creationDate"] + timedelta(days=random.randint(7, 30))
                
                work_orders.append(work_order_data)
        
        # Add work orders to turbine data
        turbine_data["workOrders"] = work_orders
        turbines_to_create.append(turbine_data)
    
    # Create turbines in batch
    try:
        created_turbines = []
        total_work_orders_created = 0
        
        for turbine_data in turbines_to_create:

            print(f"Creating turbine:", turbine_data)

            # Extract work orders from turbine data before creating turbine
            work_orders = turbine_data.pop("workOrders", [])

            # Create the turbine (now without work orders in the data)
            turbine = c3.WindTurbine.make(turbine_data).create()
            created_turbines.append(turbine)
            
            # Create work orders for this turbine separately
            for work_order_data in work_orders:
                try:
                    c3.WorkOrder.make(work_order_data).create()
                    total_work_orders_created += 1
                except Exception as wo_error:
                    print(f"Warning: Failed to create work order {work_order_data['workOrderId']}: {str(wo_error)}")
            
            print(f"Created turbine {turbine_data['id']} with {len(work_orders)} work orders")
        
        return f"Successfully created {len(created_turbines)} wind turbines and {total_work_orders_created} work orders with realistic data"
        
    except Exception as e:
        return f"Error generating data: {str(e)}"
    