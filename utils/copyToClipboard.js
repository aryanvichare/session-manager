export default function copyToClipboard(data) {
  const copyEvent = (e) => {
    e.clipboardData.setData("text/plain", data);
    e.preventDefault();
  };
  
  document.addEventListener("copy", copyEvent);
  document.execCommand("copy");
  document.removeEventListener("copy", copyEvent);
}
