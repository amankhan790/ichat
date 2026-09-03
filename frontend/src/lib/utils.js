export function formatMessageTime(date) {
  return new date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
