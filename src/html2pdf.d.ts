declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number; useCORS?: boolean };
    jsPDF?: { unit: string; format: string; orientation: string };
  }

  interface Html2Pdf {
    set(opt: Html2PdfOptions): this;
    from(element: HTMLElement | string): this;
    save(): void;
    toPdf(): this;
    getPdf(callback: (pdf: any) => void): void;
  }

  const html2pdf: () => Html2Pdf;
  export = html2pdf;
}
