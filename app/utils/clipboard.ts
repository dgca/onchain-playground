export function copyTextToClipboard(
  text: string,
  container: HTMLElement = document.body,
): void {
  const copyWithTextarea = () => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    container.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    container.removeChild(textarea);
  };

  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text).catch(copyWithTextarea);
    return;
  }

  copyWithTextarea();
}
