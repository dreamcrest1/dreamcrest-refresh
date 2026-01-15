export type CsvRow = Record<string, string>;

/**
 * Minimal CSV parser that supports:
 * - quoted fields ("")
 * - commas and newlines inside quoted fields
 * - CRLF / LF
 */
export function parseCsv(text: string): { headers: string[]; rows: CsvRow[] } {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const s = text.replace(/^\uFEFF/, ""); // strip BOM

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const next = s[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = false;
        continue;
      }
      field += ch;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (ch === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      continue;
    }

    if (ch === "\r") {
      // ignore, handle \r\n by letting \n finalize
      continue;
    }

    field += ch;
  }

  // flush
  row.push(field);
  rows.push(row);

  const headers = (rows.shift() ?? []).map((h) => h.trim());

  const out: CsvRow[] = [];
  for (const r of rows) {
    // Skip empty trailing rows
    if (r.length === 1 && r[0].trim() === "") continue;

    const obj: CsvRow = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = (r[i] ?? "").trim();
    }
    out.push(obj);
  }

  return { headers, rows: out };
}
