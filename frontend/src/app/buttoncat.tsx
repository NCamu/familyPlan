export default function ButtonCat() {
  const cat = [
    { name: "TAF", color: "blue" },
    { name: "FILS", color: "gold" },
    { name: "CLEAN", color: "green" },
    { name: "RANGE", color: "purple" },
    { name: "COOK", color: "red" },
    { name: "LINGE", color: "cyan" },
    { name: "COURSES", color: "purple" },
    { name: "VEISSELLE", color: "Orange" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <button className={`bg-${cat[0].color}-500 hover:bg-${cat[0].color}-700 text-black font-bold py-2 px-4 rounded`}>
        {cat[0].name}
      </button>
    </div>
  );
}
