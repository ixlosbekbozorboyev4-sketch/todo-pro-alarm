# ⏰ Todo Pro - Professional Vazifalar Boshqaruvi va Budilnik Tizimi

Zamonaviy, qulay va to'liq avtonom vazifalar boshqaruv tizimi (Todo App) hamda integratsiya qilingan **Budilnik (Alarm Clock)** funksiyasi.

Ushbu loyiha sof **HTML5**, **Vanilla CSS3** va **Modern JavaScript (ES6+)** yordamida yaratilgan.

---

## ✨ Asosiy Imkoniyatlar

### ⏰ 1. Haqiqiy Budilnik (Alarm Clock) Tizimi
- **Vaqt va Sana Tanlash**: Vazifa qo'shish vaqtida uning aniq sanasi hamda soat va daqiqasini belgilash imkoniyati.
- **Tezkor Tugmalar (Presets)**: 
  - `+1 daqiqa` (tezda sinab ko'rish uchun)
  - `+5 daqiqa`, `+15 daqiqa`, `+30 daqiqa`, `+1 soat`
  - `Tozalash`
- **Uzluksiz Budilnik Ovozi**: Belgilangan vaqt yetib kelganda kompyuter yoki telefonda haqiqiy elektron budilnik singari ritmik jiringlaydi (Web Audio API orqali hech qanday tashqi audio fayllarsiz ishlaydi).
- **Telefonda Titrash (Vibration API)**: Mobil qurilmalarda budilnik bilan birga titrash effekti ishga tushadi.
- **Ekranda Budilnik Oynasi (Modal Dialog)**:
  - Titrovchi ⏰ animatsiyasi va to'lqin effektlari
  - Vazifa nomi, kategoriyasi va belgilangan vaqti
  - ✅ **Bajarildi**: Budilnikni o'chiradi va vazifani yakunlangan deb belgilab konfetti otadi
  - ⏱️ **+5 daqiqa (Kechiktirish / Snooze)**: Budilnikni 5 daqiqadan so'ng qayta jiringlaydigan qilib suradi
  - 🛑 **To'xtatish**: Budilnik ovozini to'xtatadi
- **Brauzer Bildirishnomalari (Push Notifications)**: Boshqa ilovada bo'lsangiz ham tizim xabarnomasi chiqadi.

---

### 📋 2. Vazifalar Boshqaruvi
- Vazifalarni qo'shish, tahrirlash (inline edit), o'chirish va bajarilgan deb belgilash.
- **Kategoriyalar**: O'qish 📚, Ish 💼, Shaxsiy 👤, Sport 🏃‍♂️, Moliya 💰.
- **Muhimlik Darajasi (Priority)**: Past 🟢, O'rta 🟡, Yuqori 🔴.
- **Qidiruv va Filtrlash**: Nom bo'yicha tezkor qidiruv, holat (Barchasi, Faol, Bajarilgan) va toifalar bo'yicha filtrlash.
- **Statistika**: Bajarilgan foiz va motivatsion progress bar.
- **LocalStorage**: Barcha vazifalar va budilnik sozlamalari brauzer xotirasida saqlanadi.

---

### 🎨 3. Dizayn va UX
- **Mavzular**: Tungi va Kunduzgi rejim (Dark / Light Mode).
- **Ovoz Effektlari**: Tugmalar va amallar uchun yoqimli audio effektlar (yoqish/o'chirish imkoniyati bilan).
- **Konfetti**: Barcha vazifalar bajarilganda ekranda bayramona animatsiya.

---

## 📁 Fayllar Strukturasi

```text
├── index.html        # Asosiy Todo Pro va Budilnik ilovasi interfeysi
├── style.css         # Zamonaviy dizayn, mavzular va animatsiyalar
├── script.js         # Budilnik algoritmi, Web Audio, Notifications va Todo mantiqi
├── uyga vazifa.html  # 11-dars amaliy topshirig'i
├── uyga vazifa.css   # Topshiriq stillari
├── uyga vazifa.js    # Topshiriq skripti
└── README.md         # Loyiha haqida to'liq ma'lumot
```

---

## 🚀 Ishga Tushirish

Hech qanday qo'shimcha kutubxona yoki server talab etilmaydi.
1. Loyiha fayllarini yuklab oling yoki klon qiling:
   ```bash
   git clone https://github.com/ixlosbekbozorboyev4-sketch/todo-pro-alarm.git
   ```
2. `index.html` faylini istalgan brauzerda (Chrome, Edge, Firefox, Safari) oching.
3. Yangi vazifa kiriting, vaqtini belgilang va budilnikdan bahramand bo'ling!

---
Yaratuvchi: **Ixlosbek Bozorboyev**
