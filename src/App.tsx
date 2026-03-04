import React, { useState, useRef } from 'react';
import { 
  Smartphone, Tablet, Laptop, Bike, Tv, Monitor, 
  Camera, Zap, Speaker, Gamepad2, Package, Coins,
  UploadCloud, AlertCircle, Info, ChevronRight, CheckCircle2,
  ShieldCheck, Clock, MapPin, Phone, Calculator, Image as ImageIcon,
  AlertTriangle, MessageCircle, X, FileText, Lock
} from 'lucide-react';

export default function App() {
  // State Management untuk Form
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [condition, setCondition] = useState('');
  const [isFormActive, setIsFormActive] = useState(false);
  
  // State untuk Modal
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  // State untuk File Upload
  const [itemFiles, setItemFiles] = useState<File[]>([]);
  const [boxFiles, setBoxFiles] = useState<File[]>([]);
  const [itemError, setItemError] = useState('');
  const [boxError, setBoxError] = useState('');

  // State untuk Kalkulasi & UI
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{
    hargaBekas: number;
    nilaiGadai: number;
    bunga: number;
    nilaiPengembalian: number;
    nominalDenda: number;
    nominalBungaBerikutnya: number;
    totalTebusTelat: number;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Kategori Barang
  const categories = [
    { id: 'smartphone', label: 'Smartphone', icon: <Smartphone size={24} className="mb-1" /> },
    { id: 'tablet', label: 'Tablet', icon: <Tablet size={24} className="mb-1" /> },
    { id: 'laptop', label: 'Laptop', icon: <Laptop size={24} className="mb-1" /> },
    { id: 'motor', label: 'Motor', icon: <Bike size={24} className="mb-1" /> },
    { id: 'tv', label: 'TV', icon: <Tv size={24} className="mb-1" /> },
    { id: 'komputer', label: 'Komputer', icon: <Monitor size={24} className="mb-1" /> },
    { id: 'kamera', label: 'Kamera', icon: <Camera size={24} className="mb-1" /> },
    { id: 'sepeda_listrik', label: 'E-Bike', icon: <Zap size={24} className="mb-1" /> },
    { id: 'emas', label: 'Emas', icon: <Coins size={24} className="mb-1" /> },
    { id: 'speaker', label: 'Speaker', icon: <Speaker size={24} className="mb-1" /> },
    { id: 'ps', label: 'Console', icon: <Gamepad2 size={24} className="mb-1" /> },
    { id: 'lainnya', label: 'Lainnya', icon: <Package size={24} className="mb-1" /> }
  ];

  // Handler untuk file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'item' | 'box') => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length < 1 || files.length > 5) {
        if (fileType === 'item') setItemError('Pilih 1 - 5 foto.');
        if (fileType === 'box') setBoxError('Pilih 1 - 5 foto.');
        return;
      }
      
      if (fileType === 'item') {
        setItemFiles(files);
        setItemError('');
      } else {
        setBoxFiles(files);
        setBoxError('');
      }
    }
  };

  // Format mata uang Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Simulasi Sistem untuk menaksir harga
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !brand || !type || !purchaseDate || !condition) {
      alert("Mohon lengkapi semua data barang terlebih dahulu.");
      return;
    }
    if (itemFiles.length === 0 || boxFiles.length === 0) {
      alert("Mohon unggah foto barang dan kelengkapannya.");
      return;
    }

    setIsCalculating(true);
    setResult(null);

    // Jeda simulasi proses sistem (2 detik)
    setTimeout(() => {
      let baseHargaBekas = 0;
      switch (category) {
        case 'smartphone': baseHargaBekas = 3500000; break;
        case 'laptop': baseHargaBekas = 6000000; break;
        case 'motor': baseHargaBekas = 12000000; break;
        case 'tablet': baseHargaBekas = 4000000; break;
        case 'kamera': baseHargaBekas = 5500000; break;
        case 'ps': baseHargaBekas = 4500000; break;
        case 'emas': baseHargaBekas = 5000000; break;
        default: baseHargaBekas = 2000000;
      }

      if (condition === 'baru') baseHargaBekas += (baseHargaBekas * 0.15); 
      
      const nilaiGadai = baseHargaBekas - (baseHargaBekas * 0.20);
      const bunga = nilaiGadai * 0.10;
      const nilaiPengembalian = nilaiGadai + bunga;

      const nominalDenda = nilaiGadai * 0.05;
      const nominalBungaBerikutnya = nilaiGadai * 0.10;
      const totalTebusTelat = nilaiPengembalian + nominalDenda + nominalBungaBerikutnya;

      setResult({
        hargaBekas: baseHargaBekas,
        nilaiGadai,
        bunga,
        nilaiPengembalian,
        nominalDenda,
        nominalBungaBerikutnya,
        totalTebusTelat
      });
      setIsCalculating(false);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);

    }, 2000);
  };

  // Generate Link WhatsApp
  const handleWhatsApp = () => {
    const phone = "6282342203922";
    let message = `Halo Admin PT SOLUSI UTAMA GADAI,%0A%0ASaya ingin menggadaikan barang:%0A- Kategori: *${category || '-'}*%0A- Merek: *${brand || '-'}*%0A- Tipe: *${type || '-'}*%0A- Kondisi: *${condition === 'baru' ? 'Baru Beli' : (condition === 'bekas' ? 'Beli Second' : '-')}*%0A`;
    
    if (result) {
      message += `%0AEstimasi Nilai Gadai: *${formatRupiah(result.nilaiGadai)}*%0A`;
    }
    
    message += `%0AMohon info lebih lanjut. Terima kasih.`;
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* REVISI: Ukuran logo diperbesar (h-10 di HP, h-14 di Desktop) */}
          <div className="flex flex-col">
            <img 
              src="https://storage.googleapis.com/ai-studio-bucket-353083286262-us-west1/Pegadaian%20Asset/Logo-SUG" 
              alt="PT SOLUSI UTAMA GADAI" 
              className="h-10 sm:h-14 object-contain transition-transform hover:scale-105 origin-left"
              onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = "https://via.placeholder.com/150x40/e2e8f0/1e293b?text=SUG+Gadai"; 
              }}
            />
          </div>
          <div className="flex items-center gap-2">
             <div className="flex flex-col text-right text-[10px] sm:text-[11px] text-slate-500 mr-1 leading-tight">
                <span className="font-semibold text-slate-700">Terdaftar dan diawasi oleh:</span>
                <span>Otoritas Jasa Keuangan (OJK)</span>
             </div>
            <img 
              src="https://storage.googleapis.com/ai-studio-bucket-353083286262-us-west1/Pegadaian%20Asset/OJK_Logo.png" 
              alt="Diawasi OJK" 
              className="h-8 sm:h-10 object-contain"
            />
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-slate-50 pt-10 sm:pt-16 pb-20 px-4 text-center">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-200/40 blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-cyan-200/30 blur-3xl opacity-60 pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Floating Icons */}
          <div className="absolute -left-4 top-0 animate-float hidden md:block text-blue-500 opacity-80">
            <Coins size={48} />
          </div>
          <div className="absolute -right-4 bottom-20 animate-float hidden md:block text-purple-500 opacity-80" style={{ animationDelay: '2s' }}>
            <Calculator size={48} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <ShieldCheck size={16} /> 100% Aman & Terpercaya
          </span>
          
          {/* REVISI: Copywriting Hero Diubah */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight hover:text-blue-900 transition-colors duration-300 cursor-default">
            Butuh Dana Cepat? <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-all">Gadai Barang Elektronik Aja!</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium text-slate-600 mb-10 px-2 sm:px-10 hover:text-slate-800 transition-colors cursor-default">
            Cair instan, aman, cepat tanpa ribet.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto px-2 mb-12">
            {/* REVISI: Efek Hover Floating (hover:-translate-y-1) */}
            <button 
              onClick={() => document.getElementById('form-gadai')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
            >
              Cek Estimasi Nilai Gadai <ChevronRight size={18} />
            </button>
            <button 
              onClick={handleWhatsApp}
              className="w-full sm:w-auto px-6 py-4 bg-white text-blue-600 border border-blue-200 hover:border-blue-400 rounded-xl font-semibold text-sm sm:text-base shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex items-center justify-center gap-2 relative group"
            >
              <Phone size={18} className="group-hover:text-green-500 transition-colors" /> Hubungi Admin
            </button>
          </div>

          {/* Alur Gadai Section */}
          <div className="mt-12 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/60 shadow-xl">
            <h3 className="text-center text-xl sm:text-2xl font-bold text-slate-800 mb-10">Alur Cara Menggadai:</h3>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-start gap-8 md:gap-4 mb-10">
               {/* Connecting Line (Desktop) */}
               <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

               {/* Step 1 */}
               <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-4 w-full md:w-1/4 relative group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 shrink-0 z-10 group-hover:scale-110 transition-transform ring-4 ring-white">1</div>
                  <div className="text-left md:text-center">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Taksir Mandiri</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Lakukan simulasi harga barang Anda melalui website ini untuk mendapatkan estimasi awal nilai pencairan dana.</p>
                  </div>
               </div>
               
               {/* Step 2 */}
               <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-4 w-full md:w-1/4 relative group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 shrink-0 z-10 group-hover:scale-110 transition-transform ring-4 ring-white">2</div>
                  <div className="text-left md:text-center">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Datang ke Toko</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Kunjungi kantor cabang PT Solusi Utama Gadai terdekat dengan membawa barang jaminan dan KTP asli.</p>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-4 w-full md:w-1/4 relative group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 shrink-0 z-10 group-hover:scale-110 transition-transform ring-4 ring-white">3</div>
                  <div className="text-left md:text-center">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Cek Fisik</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Tim penaksir kami akan memeriksa kondisi fisik dan kelengkapan barang Anda secara transparan dan profesional.</p>
                  </div>
               </div>

               {/* Step 4 */}
               <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-4 w-full md:w-1/4 relative group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 shrink-0 z-10 group-hover:scale-110 transition-transform ring-4 ring-white">4</div>
                  <div className="text-left md:text-center">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Cair Langsung</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Setelah sepakat dengan nilai taksiran, tanda tangani nota gadai dan dana langsung cair tunai atau transfer.</p>
                  </div>
               </div>
            </div>

            {/* Info Operasional & CTA */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200">
              <div className="flex flex-col gap-2 text-sm text-slate-600 w-full md:w-auto">
                 <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-600 shrink-0" />
                    <span className="font-medium">Jam Operasional: 09.00 - 21.00 WITA</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600 shrink-0" />
                    <span className="font-medium">Lokasi: Mataram & Seluruh Cabang NTB</span>
                 </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                 <button 
                   onClick={() => setShowTerms(true)}
                   className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                 >
                   <FileText size={14} /> Pelajari Syarat & Ketentuan
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section id="form-gadai" className="max-w-4xl mx-auto px-4 sm:px-6 py-4 -mt-10 relative z-20">
        <div className={`relative rounded-2xl sm:rounded-3xl transition-all duration-500 ${isFormActive ? 'p-[3px] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:400%_400%] animate-gradient-border' : 'p-0'}`}>
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-full"
            onFocus={() => setIsFormActive(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsFormActive(false);
              }
            }}
          >
            
            <div className="p-5 sm:p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-1">
                <Calculator className="text-blue-600 shrink-0" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-default">Taksir Harga Otomatis</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 pl-9">Lengkapi data barang Anda di bawah ini untuk melihat estimasi pencairan dana.</p>
            </div>

            <form onSubmit={handleCalculate} className="p-5 sm:p-8 space-y-8">
            
            {/* Step 1: Kategori */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                1. Pilih Jenis Barang
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`cursor-pointer border rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                      category === cat.id 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
                    }`}
                  >
                    {cat.icon}
                    <span className="text-[11px] sm:text-xs font-semibold mt-2 leading-tight">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Spesifikasi */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                2. Spesifikasi & Riwayat
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Merek (Brand)</label>
                  <input 
                    type="text" 
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Cth: Samsung, Honda"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Tipe/Model</label>
                  <input 
                    type="text" 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Cth: Galaxy S23, Vario"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Tanggal Pembelian</label>
                  <input 
                    type="date" 
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-700 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Kondisi Pembelian */}
            <div>
               <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-2">Kondisi Saat Membeli</label>
               <div className="grid grid-cols-2 gap-3">
                 <label className={`flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${condition === 'baru' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
                   <input 
                     type="radio" 
                     name="condition" 
                     value="baru"
                     onChange={(e) => setCondition(e.target.value)}
                     className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0 sm:mt-0.5"
                   />
                   <span className="text-xs sm:text-sm font-medium text-slate-700 text-center sm:text-left">Baru Beli (New)</span>
                 </label>
                 <label className={`flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 p-3 sm:p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${condition === 'bekas' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
                   <input 
                     type="radio" 
                     name="condition" 
                     value="bekas"
                     onChange={(e) => setCondition(e.target.value)}
                     className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0 sm:mt-0.5"
                   />
                   <span className="text-xs sm:text-sm font-medium text-slate-700 text-center sm:text-left">Beli Bekas (Second)</span>
                 </label>
               </div>
            </div>

            {/* Step 4: Upload Foto */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                3. Unggah Foto Barang
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Foto Fisik Barang (1 - 5 Foto)</label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 bg-slate-50/50 cursor-pointer group">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'item')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <ImageIcon className="mx-auto h-8 w-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Ketuk untuk unggah foto fisik</p>
                    {itemFiles.length > 0 && (
                      <div className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs text-green-700 font-medium bg-green-100 py-1 px-3 rounded-md">
                        <CheckCircle2 size={14} /> {itemFiles.length} File terpilih
                      </div>
                    )}
                  </div>
                  {itemError && <p className="text-[10px] sm:text-xs text-red-500 mt-1">{itemError}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Foto Dus & Kelengkapan</label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 bg-slate-50/50 cursor-pointer group">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'box')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Package className="mx-auto h-8 w-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Ketuk untuk unggah kelengkapan</p>
                    {boxFiles.length > 0 && (
                      <div className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs text-green-700 font-medium bg-green-100 py-1 px-3 rounded-md">
                        <CheckCircle2 size={14} /> {boxFiles.length} File terpilih
                      </div>
                    )}
                  </div>
                  {boxError && <p className="text-[10px] sm:text-xs text-red-500 mt-1">{boxError}</p>}
                </div>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="pt-2">
              <button 
                type="submit"
                disabled={isCalculating}
                className={`w-full py-4 rounded-xl font-bold text-sm sm:text-base text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isCalculating 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.01]'
                }`}
              >
                {isCalculating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menghitung Taksiran Harga...
                  </>
                ) : (
                  <>Hitung Estimasi Nilai Gadai</>
                )}
              </button>
            </div>

          </form>
          </div>
        </div>
      </section>

      {/* PAIN POINTS & SOLUTION SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-lg relative overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-6">
              Butuh Dana Mendesak, <br/>Tapi Takut Bunga Tinggi?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Proses Berbelit</h4>
                  <p className="text-sm text-slate-600">Banyak syarat dokumen yang merepotkan dan memakan waktu lama.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                  <Coins size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Bunga Mencekik</h4>
                  <p className="text-sm text-slate-600">Khawatir terjebak pinjaman dengan bunga yang tidak masuk akal.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Keamanan Barang?</h4>
                  <p className="text-sm text-slate-600">Takut barang elektronik kesayangan rusak atau hilang saat digadai.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-100 rounded-full opacity-60 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-cyan-100 rounded-full opacity-60 blur-2xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-blue-900">Kenapa Memilih Solusi Utama Gadai?</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="shrink-0 text-blue-600 mt-0.5" size={20} />
                  <span className="text-slate-600 text-sm sm:text-base">Proses super cepat, <strong className="text-slate-900">cair dalam 5 menit</strong> setelah cek fisik.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="shrink-0 text-blue-600 mt-0.5" size={20} />
                  <span className="text-slate-600 text-sm sm:text-base">Bunga kompetitif & transparan, <strong className="text-slate-900">tanpa biaya tersembunyi</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="shrink-0 text-blue-600 mt-0.5" size={20} />
                  <span className="text-slate-600 text-sm sm:text-base">Barang diasuransikan & disimpan di <strong className="text-slate-900">gudang keamanan tinggi</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="shrink-0 text-blue-600 mt-0.5" size={20} />
                  <span className="text-slate-600 text-sm sm:text-base">Resmi & Diawasi <strong className="text-slate-900">OJK</strong>, transaksi 100% aman.</span>
                </li>
              </ul>
              <button 
                onClick={handleWhatsApp}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} /> Hubungi Kami Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULT SECTION */}
      {result && (
        <section ref={resultRef} className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 scroll-mt-24">
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-blue-500 shadow-xl overflow-hidden relative transform transition-all animate-fade-in-up">
            
            <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-bl-xl font-bold text-xs sm:text-sm flex items-center gap-1 shadow-sm z-10">
              <CheckCircle2 size={14} /> Perhitungan Selesai
            </div>

            <div className="p-5 sm:p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-800 mb-5 sm:mb-6 border-b border-slate-100 pb-3 pr-32 sm:pr-0">
                Hasil Estimasi Pencairan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                {/* Kolom Angka */}
                <div className="space-y-4 sm:space-y-5">
                  <div className="bg-blue-50 p-4 sm:p-5 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Maksimal Pencairan Dana</p>
                    <p className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight break-words">
                      {formatRupiah(result.nilaiGadai)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5">
                      *Taksiran harga pasar: {formatRupiah(result.hargaBekas)}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" /> Total Nilai Pengembalian (20 Hari)
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-800">
                      {formatRupiah(result.nilaiPengembalian)}
                    </p>
                    <div className="mt-2 text-[10px] sm:text-xs text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Pokok Pinjaman:</span>
                        <span>{formatRupiah(result.nilaiGadai)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bunga (10%):</span>
                        <span>{formatRupiah(result.bunga)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kolom Informasi & CTA */}
                <div className="flex flex-col justify-between space-y-5">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                     <div className="flex items-start gap-3">
                        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                        <div className="w-full">
                           <p className="text-xs sm:text-sm font-bold text-yellow-800 mb-2">Simulasi Keterlambatan</p>
                           <div className="space-y-1 text-[10px] sm:text-xs text-yellow-700">
                              <div className="flex justify-between">
                                 <span>Nilai Pengembalian (Normal):</span>
                                 <span>{formatRupiah(result.nilaiPengembalian)}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span>Denda Keterlambatan (5%):</span>
                                 <span>{formatRupiah(result.nominalDenda)}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span>Bunga Bulan Berikutnya (10%):</span>
                                 <span>{formatRupiah(result.nominalBungaBerikutnya)}</span>
                              </div>
                              <div className="border-t border-yellow-300 pt-1 mt-1 flex justify-between font-bold text-yellow-900">
                                 <span>Total Tebus Telat:</span>
                                 <span>{formatRupiah(result.totalTebusTelat)}</span>
                              </div>
                           </div>
                           <p className="mt-2 text-[9px] sm:text-[10px] text-yellow-600 italic leading-tight">
                             *Keterlambatan dihitung jika melewati masa tenor 20 hari.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={handleWhatsApp}
                      className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={20} /> Ajukan Gadai Sekarang (WA)
                    </button>
                    <p className="text-[10px] text-center text-slate-400">
                      *Nilai taksiran bersifat estimasi. Harga final ditentukan setelah cek fisik barang.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 sm:py-14 mt-12 sm:mt-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
            {/* Logo Section */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <img 
                src="https://storage.googleapis.com/ai-studio-bucket-353083286262-us-west1/Pegadaian%20Asset/Logo-SUG" 
                alt="PT SOLUSI UTAMA GADAI" 
                className="h-12 brightness-0 invert opacity-90"
                onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = "https://via.placeholder.com/150x40/e2e8f0/1e293b?text=SUG+Gadai"; 
                }}
              />
              <p className="text-sm text-slate-500 max-w-xs text-center md:text-left">
                Tempat Gadai Teraman di NTB. Solusi dana cepat, aman, dan resmi diawasi OJK.
              </p>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-green-500">
                  <Phone size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">WhatsApp Admin</p>
                  <a href="https://wa.me/6282342203922" target="_blank" rel="noreferrer" className="text-lg font-bold hover:text-white transition-colors">
                    +62 823-4220-3922
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400">Terdaftar dan diawasi oleh:</span>
                <img 
                  src="https://storage.googleapis.com/ai-studio-bucket-353083286262-us-west1/Pegadaian%20Asset/OJK_Logo.png" 
                  alt="OJK" 
                  className="h-6 brightness-0 invert opacity-80"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} PT Solusi Utama Gadai. All rights reserved.</p>
            <div className="flex gap-6">
              <button onClick={() => setShowTerms(true)} className="hover:text-white transition-colors">Syarat & Ketentuan</button>
              <button onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors">Kebijakan Privasi</button>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showTerms && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTerms(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative z-10 animate-fade-in-up">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" /> Syarat & Ketentuan
              </h3>
              <button onClick={() => setShowTerms(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 text-sm text-slate-600 space-y-4 leading-relaxed">
              <p>Selamat datang di PT Solusi Utama Gadai. Dengan menggunakan layanan kami, Anda menyetujui syarat dan ketentuan berikut:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Persyaratan Umum:</strong> Nasabah wajib membawa KTP asli dan barang jaminan beserta kelengkapannya.</li>
                <li><strong>Barang Jaminan:</strong> Barang harus milik sendiri, bukan barang curian atau sengketa. Kami menerima elektronik (HP, Laptop, TV, Kamera, dll) dan kendaraan bermotor.</li>
                <li><strong>Penaksiran:</strong> Nilai taksiran ditentukan berdasarkan kondisi fisik dan harga pasar yang berlaku. Keputusan penaksir bersifat mutlak.</li>
                <li><strong>Masa Gadai:</strong> Jangka waktu gadai adalah 20 hari dan dapat diperpanjang dengan membayar bunga berjalan.</li>
                <li><strong>Keterlambatan:</strong> Keterlambatan pembayaran akan dikenakan denda sesuai ketentuan yang berlaku. Barang yang tidak ditebus atau diperpanjang setelah jatuh tempo akan dilelang.</li>
                <li><strong>Keamanan:</strong> Barang jaminan diasuransikan dan disimpan di gudang yang aman. Kerusakan akibat bencana alam ditanggung asuransi.</li>
              </ol>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button onClick={() => setShowTerms(false)} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPrivacy(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative z-10 animate-fade-in-up">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Lock size={20} className="text-blue-600" /> Kebijakan Privasi
              </h3>
              <button onClick={() => setShowPrivacy(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 text-sm text-slate-600 space-y-4 leading-relaxed">
              <p>PT Solusi Utama Gadai menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengelola data pribadi Anda:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Pengumpulan Data:</strong> Kami mengumpulkan data seperti nama, NIK, nomor telepon, dan foto barang untuk keperluan administrasi gadai.</li>
                <li><strong>Penggunaan Data:</strong> Data digunakan untuk verifikasi identitas, pemrosesan transaksi, dan komunikasi terkait status gadai Anda.</li>
                <li><strong>Perlindungan Data:</strong> Kami menerapkan standar keamanan tinggi untuk melindungi data Anda dari akses tidak sah. Data tidak akan dijual atau dibagikan ke pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan hukum.</li>
                <li><strong>Hak Pengguna:</strong> Anda berhak meminta informasi mengenai data Anda yang kami simpan atau meminta pembaruan data.</li>
              </ul>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button onClick={() => setShowPrivacy(false)} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
