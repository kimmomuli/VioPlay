import { db } from "@/db";
import { categories } from "@/db/schema";


const garegoryNames = [
    "Cars and Vehicles",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film and Animation",
    "How-to and style",
    "Music",
    "News and Politics",
    "Pepole and Blogs",
    "Pets and Animals",
    "Science and Technology",
    "Sports",
    "Travel and Events"  
];

const main = async () => {
    console.log("Seeding categories");

    try {
        const values = garegoryNames.map((name) => ({
            name,
            description: `All ${name} related videos`
        }));

        await db.insert(categories).values(values);

        console.log("Categories seeded successfully");
    } catch (error) {
        console.error("Error seeding gategories", error);
        process.exit(1);
    }
};

main();