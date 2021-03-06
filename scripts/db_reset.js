const fs = require("fs");

const db = {
  "stage-races": [
    {
      id: 1,
      name: "2019 Tour of California",
      stages: [
        {
          id: "klqo1gnh",
          name: "Sacramento to Sacramento",
          date: "2019-05-12",
        },
        {
          id: "klqo1hac",
          name: "Rancho Cordova to South Lake Tahoe",
          date: "2019-05-13",
        },
        {
          id: "klqo1i4z",
          name: "Stockton to Morgan Hill",
          date: "2019-05-14",
        },
        {
          id: "klqo1jb5",
          name: "WeatherTech Raceway Laguna Seca to Morro Bay",
          date: "2019-05-15",
        },
        {
          id: "klqo1l3i",
          name: "Pismo Beach to Ventura",
          date: "2019-05-16",
        },
        {
          id: "klqo1m1w",
          name: "Ontario to Mount Baldy",
          date: "2019-05-17",
        },
        {
          id: "klqo1mz1",
          name: "Santa Clarita to Pasadena",
          date: "2019-05-18",
        },
      ],
    },
  ],
};

try {
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2), "utf8");
  console.log("Database reset successfully.");
} catch (err) {
  console.err("Error resetting database.");
}
