export default function trimText(text, num) {
  return text.length > num ? text.substring(0, num) + '...' : text;
}
