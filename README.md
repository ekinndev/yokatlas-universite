**

# Yökatlas Üniversite - Bölüm Listesi Bot

**
![NodeJs Puppeteer](https://i.ibb.co/5h61R7P/logo.png)
![enter image description here](https://i.ibb.co/bK6CGVG/bot.png)

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
    unikodu:{
	sehir:String,
	uniAd:String,
	uniTur:String
	söz:Array(),
	say:Array(),
	ea:Array()
    }

## Versiyon 1.0.1 Güncellemesi
Üsteki resimde görüldüğü üzere bölümler puan türüne göre gruplandı.
İsimlendirmede Camel Case kullanıldı.
Küçük Bug Fixler.
Tarayıcı gizlendi.
Script'in hangi  aşamada olduğuna dair küçük çıktılar eklendi.

## Bilinen Hatalar
Eğer çekilen veride bir tutarsızlık(aynı bölümün 2-3 kere array'e eklenmesi) gibi durumlar söz konusu olursa.
5. satırda bulunan slowMo:  150 değerini daha yüksek bir değer giriniz fakat bu durumda da bölümleri daha yavaş çekecektir.