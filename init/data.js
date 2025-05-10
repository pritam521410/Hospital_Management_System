const mongoose = require("mongoose");
const Listing = require("../models/listing");

const sampleListings = [
    new Listing({
        name: "City Care Hospital",
        description: "A multi-specialty hospital.",
        image: {
            filename: "listingImage",
            url: "https://media.istockphoto.com/id/1364971557/photo/hospital-recovery-room-with-beds-and-chairs-3d-rendering.jpg?s=612x612&w=0&k=20&c=qpLCCYKBxWiVpV74zLbsV69Trb0ga8plCIsx7h7CLAw="
        },
        location: "Sector 45",
        city: "Noida",
        state: "UP",
        country: "India",
        contactNumber: "+91-9876543210",
        email: "care@cityhospital.com",
        roomTypes: [
            {
                type: "ICU",
                pricePerDay: 4500,
                isAvailable: true,
                facilities: ["Oxygen", "Ventilator", "24x7 Monitoring"],
                bedCount: 2
            },
            {
                type: "Private",
                pricePerDay: 3000,
                isAvailable: true,
                facilities: ["AC", "TV", "Attached Bathroom"],
                bedCount: 1
            }
        ],
        owner: "6807bb6ae1ad5018bff8b635"
    }),

    new Listing({
        name: "Green Valley Hospital",
        description: "Known for excellent patient care.",
        image: {
            filename: "listingImage",
            url: "https://media.istockphoto.com/id/1298375809/photo/empty-luxury-modern-hospital-room.jpg?s=612x612&w=0&k=20&c=COJYNIiGvKfgiNITdE2IZmHo31tzUewK64jwuv8glgA="
        },
        location: "Phase 2",
        city: "Gurgaon",
        state: "Haryana",
        country: "India",
        contactNumber: "+91-9988776655",
        email: "info@greenvalley.com",
        roomTypes: [
            {
                type: "ICU",
                pricePerDay: 5000,
                isAvailable: false,
                facilities: ["Oxygen", "Ventilator", "Monitoring"],
                bedCount: 4
            },
            {
                type: "General",
                pricePerDay: 1500,
                isAvailable: true,
                facilities: ["Fan", "Shared Bathroom"],
                bedCount: 10
            }
        ],
        owner: "6807bb6ae1ad5018bff8b635"
    }),

    new Listing({
        name: "Sunrise Hospital",
        description: "24x7 emergency services available.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1613377512409-59c33c10c821?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        location: "Main Road",
        city: "Lucknow",
        state: "UP",
        country: "India",
        contactNumber: "+91-9123456780",
        email: "sunrise@hospital.com",
        roomTypes: [
            {
                type: "ICU",
                pricePerDay: 4800,
                isAvailable: true,
                facilities: ["Oxygen", "Defibrillator", "Nurses"],
                bedCount: 3
            },
            {
                type: "Deluxe",
                pricePerDay: 4000,
                isAvailable: true,
                facilities: ["AC", "TV", "Refrigerator"],
                bedCount: 1
            }
        ],
        owner: "6807bb6ae1ad5018bff8b635"
    }),

    new Listing({
        name: "Rainbow Children Hospital",
        description: "Best for pediatric services.",
        image: {
            filename: "listingImage",
            url: "https://images.unsplash.com/photo-1710074213374-e68503a1b795?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvc3BpdGFsJTIwYmVkfGVufDB8fDB8fHww"
        },
        location: "Sector 62",
        city: "Noida",
        state: "UP",
        country: "India",
        contactNumber: "+91-9090909090",
        email: "contact@rainbowkids.com",
        roomTypes: [
            {
                type: "NICU",
                pricePerDay: 6000,
                isAvailable: true,
                facilities: ["Incubator", "Oxygen", "Monitoring"],
                bedCount: 2
            },
            {
                type: "Private",
                pricePerDay: 3500,
                isAvailable: true,
                facilities: ["Attached Bathroom", "TV"],
                bedCount: 1
            }
        ],
        owner: "6807bb6ae1ad5018bff8b635"
    }),

    new Listing({
        name: "Apollo Multispeciality",
        description: "Renowned hospital chain.",
        image: {
            filename: "listingImage",
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOWH0bhrwtW7dSMApjw1NSx0eluGMVm04Vjg&s"
        },
        location: "Salt Lake",
        city: "Kolkata",
        state: "West Bengal",
        country: "India",
        contactNumber: "+91-9333933333",
        email: "support@apollo.com",
        roomTypes: [
            {
                type: "ICU",
                pricePerDay: 6200,
                isAvailable: true,
                facilities: ["Ventilator", "24x7 Nurse", "Monitoring"],
                bedCount: 5
            },
            {
                type: "Suite",
                pricePerDay: 8000,
                isAvailable: false,
                facilities: ["Luxury Bed", "AC", "TV"],
                bedCount: 1
            }
        ],
        owner: "6807bb6ae1ad5018bff8b635"
    }),

    new Listing({
        name: "Medanta SuperSpeciality",
        description: "Top-tier multi-speciality hospital known for advanced treatments and patient care.",
        image: {
            filename: "listingImage",
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRozZ5-YQOUSdcWhRCPbqyImsuqeZ1OR5e9-Q&s"
        },
        location: "Sector 38",
        city: "Gurugram",
        state: "Haryana",
        country: "India",
        contactNumber: "+91-9010101010",
        email: "care@medanta.org",
        roomTypes: [
            {
                type: "General Ward",
                pricePerDay: 1500,
                isAvailable: true,
                facilities: ["Shared Beds", "Fan", "Nurse Call Bell"],
                bedCount: 10
            },
            {
                type: "Private Room",
                pricePerDay: 3500,
                isAvailable: true,
                facilities: ["AC", "TV", "Attached Bathroom"],
                bedCount: 3
            }
        ],
        owner: "6807bb6ae1ad5018bff8b635"
    })
];

module.exports = { data: sampleListings };
