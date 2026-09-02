# Metehan Güney Portfolio

Statik, responsive kişisel portfolio sitesi. Build adımı gerekmez.

## Dosyalar

- `index.html`
- `styles.css`
- `script.js`

## Lokal önizleme

Klasörde basit bir HTTP sunucusu aç:

```bash
python3 -m http.server 8080
```

Sonra tarayıcıda `http://localhost:8080` aç.

## Cloudflare Pages dağıtımı

En kolay yol:

1. Dosyaları bir GitHub reposuna yükle.
2. Cloudflare Dashboard > Workers & Pages > Create > Pages > Connect to Git.
3. Repo'yu seç.
4. Framework preset: `None`.
5. Build command: boş.
6. Build output directory: `/` (veya Cloudflare'ın root seçeneği).
7. Deploy et.
8. Custom domains bölümünden `metehanguney.com.tr` ekle.

## Kişiselleştirilecek alanlar

- `index.html` içindeki iletişim e-postası
- İstersen GitHub / LinkedIn butonları
- CV hazır olduğunda `cv.pdf` ekleyip buton bağlanabilir
- Proje açıklamaları ve teknoloji etiketleri

Not: Şirket içi domain, IP, sunucu adı veya gizli operasyon detaylarını kişisel sitede yayınlama.
