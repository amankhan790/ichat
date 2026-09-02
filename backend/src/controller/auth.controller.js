export async function checkAuth(req, res) {
  res.status(200).json({ message: "User is authenticated" });
}
