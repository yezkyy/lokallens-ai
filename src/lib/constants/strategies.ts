export const GENERAL_STRATEGIES = [
  {
    timeSlot: "06:00",
    timeReasoning: "Waktu berangkat kerja/sekolah. Orang cenderung mengecek ponsel saat dalam perjalanan atau sebelum memulai aktivitas.",
    platforms: ["Instagram", "WhatsApp"],
    strategy: "Gunakan visual yang cerah dan caption yang membangkitkan semangat. Fokus pada kemudahan dan kecepatan layanan.",
    contentHooks: [
      "Awali harimu dengan yang spesial dari kami!",
      "Butuh mood booster pagi ini? Cek yuk!",
      "Sarapan praktis atau persiapan hari ini? Kami siap bantu."
    ],
    hashtags: ["#SemangatPagi", "#UMKMSamarinda", "#AktivitasPagi", "#LokalLensAI"]
  },
  {
    timeSlot: "12:00",
    timeReasoning: "Waktu istirahat makan siang. Trafik media sosial mencapai puncaknya karena orang mencari hiburan saat bersantai.",
    platforms: ["TikTok", "Instagram", "Facebook"],
    strategy: "Fokus pada detail produk (close-up). Gunakan video pendek atau foto katalog yang menggugah selera/minat.",
    contentHooks: [
      "Lagi istirahat? Istirahat makin asik bareng produk kami.",
      "Self-reward di jam makan siang, kenapa enggak?",
      "Promo spesial jam makan siang! Jangan sampai kelewatan."
    ],
    hashtags: ["#MakanSiang", "#RestTime", "#SamarindaUpdate", "#UMKMLokal"]
  },
  {
    timeSlot: "18:00",
    timeReasoning: "Waktu pulang kerja dan bersantai di rumah. Orang memiliki lebih banyak waktu untuk membaca caption panjang atau melihat carousel.",
    platforms: ["Instagram", "TikTok", "WhatsApp"],
    strategy: "Gunakan pendekatan emosional atau storytelling. Visual yang hangat dan pencahayaan soft/golden hour sangat efektif.",
    contentHooks: [
      "Setelah lelah seharian, manjakan dirimu sekarang.",
      "Momen santai sore jadi lebih lengkap.",
      "Rangkuman produk favorit minggu ini. Mana pilihanmu?"
    ],
    hashtags: ["#SantaiSore", "#GoldenHour", "#SamarindaMalam", "#UMKMSukses"]
  }
];

export const getGeneralStrategy = (currentTitle: string = "") => {
  // Deterministic selection based on title length or random but stable for the session
  // Or simply based on the hours of the day
  const hours = [6, 12, 18];
  const hour = hours[Math.floor(Math.random() * hours.length)];
  const timeStr = `${hour.toString().padStart(2, '0')}:00`;
  
  return GENERAL_STRATEGIES.find(s => s.timeSlot === timeStr) || GENERAL_STRATEGIES[1];
};
