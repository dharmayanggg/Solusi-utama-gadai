import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TaksiranResult {
  isMatch: boolean;
  detectedDevice: string;
  mismatchReason?: string;
  hargaBekas: number;
  nilaiGadai: number;
  bunga: number;
  nilaiPengembalian: number;
  nominalDenda: number;
  nominalBungaBerikutnya: number;
  totalTebusTelat: number;
  explanation: string;
}

export const analyzeGadai = async (
  category: string,
  brand: string,
  type: string,
  purchaseDate: string,
  condition: string,
  images: string[] // base64 strings
): Promise<TaksiranResult> => {
  const model = "gemini-3-flash-preview";

  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const prompt = `
    Anda adalah ahli penaksir harga barang elektronik bekas untuk perusahaan gadai di Indonesia (PT Solusi Utama Gadai).
    
    DATA INPUT USER:
    - Tanggal Hari Ini: ${currentDate}
    - Kategori: ${category}
    - Merek: ${brand}
    - Tipe/Model: ${type}
    - Tanggal Pembelian: ${purchaseDate}
    - Kondisi Saat Beli: ${condition === 'baru' ? 'Baru (New)' : 'Bekas (Second)'}
    
    TUGAS ANDA:
    1. Verifikasi Gambar: Periksa apakah gambar yang diunggah sesuai dengan Merek dan Tipe yang diinput user. 
       Contoh: Jika user input "iPhone 13" tapi gambar menunjukkan HP "Oppo", maka isMatch = false.
    2. Estimasi Harga Bekas (Market Price):
       - Cari harga pasar saat ini untuk model tersebut di Indonesia.
       - Terapkan depresiasi nilai:
         * Kurangi nilai sebesar 5-10% untuk setiap 3 bulan usia barang sejak tanggal pembelian.
         * Jika kondisi beli adalah 'bekas', kurangi nilai tambahan sebesar 15-20% dari harga pasar normal.
    3. Hitung Nilai Gadai:
       - Nilai Gadai (Pinjaman) = 80% dari Harga Bekas.
       - Bunga (20 hari) = 10% dari Nilai Gadai.
       - Nilai Pengembalian = Nilai Gadai + Bunga.
       - Denda Keterlambatan = 5% dari Nilai Gadai.
       - Bunga Bulan Berikutnya = 10% dari Nilai Gadai.
       - Total Tebus Telat = Nilai Pengembalian + Denda + Bunga Berikutnya.

    KEMBALIKAN DALAM FORMAT JSON. Pastikan field 'explanation' menggunakan bahasa yang mudah dimengerti orang awam dan menyebut diri sebagai 'Sistem Kami' (bukan AI).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          ...images.map(img => ({
            inlineData: {
              mimeType: "image/jpeg",
              data: img.split(',')[1] || img
            }
          }))
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isMatch: { type: Type.BOOLEAN },
          detectedDevice: { type: Type.STRING },
          mismatchReason: { type: Type.STRING },
          hargaBekas: { type: Type.NUMBER },
          nilaiGadai: { type: Type.NUMBER },
          bunga: { type: Type.NUMBER },
          nilaiPengembalian: { type: Type.NUMBER },
          nominalDenda: { type: Type.NUMBER },
          nominalBungaBerikutnya: { type: Type.NUMBER },
          totalTebusTelat: { type: Type.NUMBER },
          explanation: { type: Type.STRING }
        },
        required: ["isMatch", "detectedDevice", "hargaBekas", "nilaiGadai", "bunga", "nilaiPengembalian", "nominalDenda", "nominalBungaBerikutnya", "totalTebusTelat", "explanation"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
