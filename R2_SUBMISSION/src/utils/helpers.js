export const groupBy = (x, f) =>
  x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});

export const download = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "");
  link.click();
};

export function readFile(file) {
  return readBlob(file.blob());
}

export function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsArrayBuffer(blob);
  });
}

export function parseAsJsonObject(blob) {
  return JSON.parse(JSON.stringify(blob));
}

// format : silence5, silence10
export function asSilenceFloatOr0(value) {
  //   alert(value);
  return parseFloat(value.toString().substring(7)) || 0;
}
