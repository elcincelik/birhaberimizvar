export const invitation = {
  // Kapı şablonunun teması: 'sakayik', 'zeytin' veya 'lale'
  theme: 'sakayik',

  // 'text' = sadece zarif yazı, 'photo' = yazı + fotoğraf alanı (zarf şablonu için)
  style: 'text',

  eyebrow: 'DAVETLİSİNİZ',
  // Tek isim de olabilir (ör. doğum günü: ['Defne']) — o zaman "&" gösterilmez
  names: ['Elçin', 'Talha'],
  monogram: 'E & T', // tek harf de olabilir (ör. 'D'); boşsa isimlerin baş harflerinden üretilir
  photo: '/couple.jpg',

  message:
    'Hayatımızın en güzel gününde sizleri de aramızda görmekten mutluluk duyarız.',

  events: [
    {
      label: 'NİKAH',
      date: '22 Ağustos 2027',
      time: '17:30',
      place: 'Kuğu Gölü Davet',
      hall: 'Salon Lotus',
      city: 'İstanbul · Maltepe',
      start: '2027-08-22T17:30:00+03:00',
      maps: 'Maltepe Belediyesi Cumhuriyet Kültür Merkezi'
    },
    {
      label: 'DÜĞÜN',
      date: '29 Ağustos 2027',
      time: '20:00',
      place: 'Flamingo Event Hall',
      city: 'Manisa · Salihli',
      start: '2027-08-29T20:00:00+03:00',
      maps: 'Flamingo Event Hall Salihli Manisa'
    }
  ],

  // Etkinlik saati geçince geri sayım yerine gösterilen mesajlar (events sırasıyla)
  finished: [
    {
      title: 'Resmi kısım bitti.',
      text: 'Şimdi parti zamanı!',
      note: "29 Ağustos'ta Manisa'da görüşmek üzere."
    },
    {
      title: 'Birlikte çok güzeldi!',
      text: 'Bu hikayenin bir parçası olduğunuz için çok mutluyuz.',
      note: 'Sevgiyle,<br>Elçin & Talha'
    }
  ],

  reminder: {
    title: 'Hatırlatma ve Notlar',
    text: '10 Ağustos tarihine kadar<br>katılım durumunuzu belirtmenizi rica ederiz.'
  },

  // Telefon numaraları ülke koduyla, boşluksuz
  contacts: [
    { name: 'Elçin', phone: '905458494585' },
    { name: 'Talha', phone: '905526754507' }
  ],

  songSuccess: 'Manisa’da bu şarkıyı çalmak için sabırsızlanıyoruz. ♫',

  // Kapı şablonundaki sabit metinler. Silinen/yazılmayan her metin için varsayılan kullanılır.
  labels: {
    tapSeal: 'MÜHÜRE DOKUNUN',
    loading: 'Davetiyeniz hazırlanıyor...',
    locationTitle: 'Lokasyon',
    directions: 'Yol Tarifi Al',
    days: 'GÜN',
    hours: 'SAAT',
    minutes: 'DK',
    seconds: 'SN',
    today: 'Bugün o gün!',
    contactTitle: 'İLETİŞİM',
    contactPerson: 'İLETİŞİM KİŞİSİ',
    guestbook: 'Anı Defteri',
    guestbookHint: 'Güzel dileklerini bırak',
    songRequest: 'Şarkı İsteği',
    songRequestHint: 'Bizim için bir şarkı iste',
    madeWith: 'ile hazırlandı',
    rsvpEyebrow: 'LCV',
    rsvpTitle: 'Katılım durumunuz?',
    rsvpYes: 'Asla kaçırmam!',
    rsvpNo: 'Gelemiyorum ama kalbim sizinle ♥',
    rsvpThanksYes: 'Harika, {name}!',
    rsvpThanksYesText: 'Sizi aramızda görmek için sabırsızlanıyoruz.',
    rsvpThanksNo: 'Teşekkürler, {name}.',
    rsvpThanksNoText: 'Sizi özleyeceğiz, kalbimiz sizinle.'
  }
};