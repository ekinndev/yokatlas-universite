**

# Yökatlas Üniversite - Bölüm Listesi Bot

**
![NodeJs Puppeteer](https://i.ibb.co/5h61R7P/logo.png)
![enter image description here](https://i.ibb.co/L6TrMf8/veri.png)

**

## Nasıl Çalıştırılır ?
Botu kullanabilmek için öncelikle bilgisayarınızda nodejs yüklü olması lazım. NodeJS'i indirmek için [Tıklayınız](https://nodejs.org/).

Daha sonra dosyaların bulduğu klasöre komut satırıyla ulaşıp sırayla aşağıdaki komutları girin.

    npm install
    (Gerekli ek paketleri kuracaktır.)
    npm start


## Veri Yapısı

Json dosyasının veri yapısı aşağıdaki gibidir.
unikodu Yökatlasın sitesindeki üniversitelerin kodudur.
Örneğin Ege Üniversitesi'nin linki 
[https://yokatlas.yok.gov.tr/lisans-univ.php?u=1034](https://yokatlas.yok.gov.tr/lisans-univ.php?u=1034)
Bu durumda Ege Üniversitesi'nin unikodu 1034 oluyor.

**

    {
    unikodu:Array,
    unikodu:Array,
    unikodu:Array,
    }

