const fs = require("fs");
const path = require("path");

const filePath = path.join(
  process.cwd(),
  "src/data/umkm.json"
);

const data = JSON.parse(
  fs.readFileSync(filePath, "utf8")
);

const updatedData = data.map((item) => {
  const randomDays = Math.floor(Math.random() * 180);

  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - randomDays);

  return {
    ...item,
    createdAt: item.createdAt ?? createdAt.toISOString(),
    updatedAt: item.updatedAt ?? createdAt.toISOString(),
  };
});

fs.writeFileSync(
  filePath,
  JSON.stringify(updatedData, null, 2)
);

console.log(`Updated ${updatedData.length} UMKM`);