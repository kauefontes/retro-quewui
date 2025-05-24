// Test conversion function

// Original json converter
const convertToSnakeCase_Original = (obj) => {
  const result = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = typeof obj[key] === 'object' && obj[key] !== null
      ? convertToSnakeCase_Original(obj[key])
      : obj[key];
  });
  return result;
};

// Fixed json converter
const convertToSnakeCase_Fixed = (obj) => {
  // Handle arrays separately to preserve them
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return convertToSnakeCase_Fixed(item);
      }
      return item;
    });
  }
  
  // Handle objects
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    Object.keys(obj).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = convertToSnakeCase_Fixed(obj[key]);
    });
    return result;
  }
  
  // Return primitives as is
  return obj;
};

// Test object with arrays
const testProject = {
  id: "project-2",
  title: "Developer Terminal Website",
  description: "Interactive terminal-style website with vim-like navigation",
  technologies: ["React", "Vite", "Zustand", "Tailwind CSS"],
  githubUrl: "https://github.com/kauefontes/retro-quewui-backend",
  liveUrl: "https://quewui.com",
  imageUrl: "https://user-images.githubusercontent.com/2405099/67417164-ce9e6300-f5d0-11e9-83e9-0e3e6714cfff.png",
  year: 2025,
  highlights: ["Terminal UI with NEON-inspired aesthetics", "Vim-like keyboard navigation", "Responsive design for all device sizes", "Animated terminal boot sequence"]
};

console.log("Original function result:");
const originalResult = convertToSnakeCase_Original(testProject);
console.log(JSON.stringify(originalResult, null, 2));

console.log("\nOriginal technologies type:", Array.isArray(originalResult.technologies) ? "Array" : "Object");
console.log("Original highlights type:", Array.isArray(originalResult.highlights) ? "Array" : "Object");

console.log("\n\nFixed function result:");
const fixedResult = convertToSnakeCase_Fixed(testProject);
console.log(JSON.stringify(fixedResult, null, 2));

console.log("\nFixed technologies type:", Array.isArray(fixedResult.technologies) ? "Array" : "Object");
console.log("Fixed highlights type:", Array.isArray(fixedResult.highlights) ? "Array" : "Object");
