export async function getPoints() {
  try {
    const response = await fetch("http://localhost:3000/points");
    if (!response.ok) {
      throw new Error("Failed to fetch points");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching points:", error);
    return [];
  }
}
