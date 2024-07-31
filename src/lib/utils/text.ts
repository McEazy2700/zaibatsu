export function ellipseAddress(address = ``, width = 6): string {
  return address
    ? `${address.slice(0, width)}...${address.slice(-width)}`
    : address;
}

export const ellipseText = (text = "", length = 20): string => {
  if (text.length > length) {
    return `${text.slice(0, length + 1)}...`;
  }
  return text;
};

export function formatId(id: number, length: number) {
  return "#" + String(id).padStart(length, "0");
}
