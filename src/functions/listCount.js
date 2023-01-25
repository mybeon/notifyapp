export default function (data, local = true) {
  if (!data) {
    return 0;
  }
  const count = data.filter(item => !item.shared).length;
  if (!local) {
    return data.length - count;
  }
  return count;
}
