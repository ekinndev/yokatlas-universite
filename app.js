const puppeteer = require('puppeteer');
const fs = require('fs');

const tablolariCek = async (url, sayfaSayisi) => {
  try {
    const browser = await puppeteer.launch({ slowMo: 200 });
    let page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('#mydata_next');
    let bolumlerGenel = [];
    for (let index = 1; index <= sayfaSayisi; index++) {
      let okullar = await page.$$eval(
        '#mydata > tbody > [role="row"]',
        (uniler) => {
          return uniler.map((okul) => {
            let uni = {};
            uni.bolumKodu = okul.querySelector('a').innerText.trim();
            const fontVeriler = okul.querySelectorAll('font');
            const strongVeriler = okul.querySelectorAll('strong');
            const tdVeriler = okul.querySelectorAll('td');
            for (let index = 0; index < tdVeriler.length; index++) {
              if (index == 4) {
                uni.sehir = tdVeriler[index].innerText.trim(); //
              }
              if (index == 5) {
                uni.uniTur = tdVeriler[index].innerText.trim(); //
              }
              if (index == 6) {
                uni.burs = tdVeriler[index].innerText.trim();
              }
            }
            for (let index = 0; index < strongVeriler.length; index++) {
              if (index == 0) {
                uni.uniAdi = strongVeriler[index].innerText.trim(); //
              } else if (index == 1) {
                uni.bolumAdi = strongVeriler[index].innerText.trim();
              }
            }
            for (let index = 0; index < fontVeriler.length; index++) {
              if (index == 2) {
                uni.bolumAdi += ' ' + fontVeriler[index].innerText.trim();
              } else if (index == 11) {
                uni.siralama = fontVeriler[index].innerText.trim();
              } else if (index == 15) {
                uni.puan = fontVeriler[index].innerText.trim();
              }
            }

            return uni;
          });
        }
      );

      okullar.forEach((okul) => {
        bolumlerGenel.push(okul);
      });
      await page.click('#mydata_next');
    }

    browser.close();

    return bolumlerGenel;
  } catch (err) {
    console.log(err);
  }
};

const uniKodlariCek = async () => {
  const Browser = await puppeteer.launch();
  let page = await Browser.newPage();
  await page.goto('https://yokatlas.yok.gov.tr/lisans-anasayfa.php');
  await page.waitForSelector(
    '#flip1 > div > div.face.back > div > form > div > div > div'
  );

  await page.click(
    '#flip1 > div > div.face.front.flipControl > div > div > img'
  );
  let okullar = await page.evaluate(() => {
    let liste = document.getElementById('univ2');
    let okullar = [];

    for (let i = 0; i < liste.length; i++) {
      let okulKod = liste[i].value;
      let okulIsim = liste[i].text;
      let url = `https://yokatlas.yok.gov.tr/lisans-univ.php?u=${okulKod}`;
      let okul = {
        bolumKodu: okulKod.trim(),
        uniAdi: okulIsim.trim(),
        url,
      };
      if (liste[i].value) okullar.push(okul);
    }

    return okullar;
  });
  Browser.close();
  return okullar;
};

const verileriBirlestir = (
  dilTablo,
  sayTablo,
  eaTablo,
  sozTablo,
  uniKodlari
) => {
  const genelUni = {};
  for (const unikod of uniKodlari) {
    for (const dilbolum of dilTablo) {
      if (dilbolum.uniAdi === unikod.uniAdi) {
        const kod = unikod.bolumKodu;
        if (!genelUni[kod]) {
          genelUni[kod] = {
            sehir: dilbolum.sehir,
            uniAdi: dilbolum.uniAdi,
            uniTur: dilbolum.uniTur,
          };
          genelUni[kod]['dil'] = [
            {
              puan: dilbolum.puan,
              siralama: dilbolum.siralama,
              bolumAdi: dilbolum.bolumAdi,
              burs: dilbolum.burs,
              bolumKodu: dilbolum.bolumKodu,
            },
          ];
        } else {
          genelUni[kod]['dil'].push({
            puan: dilbolum.puan,
            siralama: dilbolum.siralama,
            bolumAdi: dilbolum.bolumAdi,
            burs: dilbolum.burs,
            bolumKodu: dilbolum.bolumKodu,
          });
        }
      }
    }
    for (const sozbolum of sozTablo) {
      if (sozbolum.uniAdi === unikod.uniAdi) {
        const kod = unikod.bolumKodu;

        if (!genelUni[kod]) {
          genelUni[kod] = {
            sehir: sozbolum.sehir,
            uniAdi: sozbolum.uniAdi,
            uniTur: sozbolum.uniTur,
          };
          genelUni[kod]['söz'] = [
            {
              puan: sozbolum.puan,
              siralama: sozbolum.siralama,
              bolumAdi: sozbolum.bolumAdi,
              burs: sozbolum.burs,
              bolumKodu: sozbolum.bolumKodu,
            },
          ];
        } else {
          if (!genelUni[kod]['söz']) {
            genelUni[kod]['söz'] = [
              {
                puan: sozbolum.puan,
                siralama: sozbolum.siralama,
                bolumAdi: sozbolum.bolumAdi,
                burs: sozbolum.burs,
                bolumKodu: sozbolum.bolumKodu,
              },
            ];
          } else {
            genelUni[kod]['söz'].push({
              puan: sozbolum.puan,
              siralama: sozbolum.siralama,
              bolumAdi: sozbolum.bolumAdi,
              burs: sozbolum.burs,
              bolumKodu: sozbolum.bolumKodu,
            });
          }
        }
      }
    }
    for (const eabolum of eaTablo) {
      if (eabolum.uniAdi === unikod.uniAdi) {
        const kod = unikod.bolumKodu;
        if (!genelUni[kod]) {
          genelUni[kod] = {
            sehir: eabolum.sehir,
            uniAdi: eabolum.uniAdi,
            uniTur: eabolum.uniTur,
          };
          genelUni[kod]['ea'] = [
            {
              puan: eabolum.puan,
              siralama: eabolum.siralama,
              bolumAdi: eabolum.bolumAdi,
              burs: eabolum.burs,
              bolumKodu: eabolum.bolumKodu,
            },
          ];
        } else {
          if (!genelUni[kod]['ea']) {
            genelUni[kod]['ea'] = [
              {
                puan: eabolum.puan,
                siralama: eabolum.siralama,
                bolumAdi: eabolum.bolumAdi,
                burs: eabolum.burs,
                bolumKodu: eabolum.bolumKodu,
              },
            ];
          } else {
            genelUni[kod]['ea'].push({
              puan: eabolum.puan,
              siralama: eabolum.siralama,
              bolumAdi: eabolum.bolumAdi,
              burs: eabolum.burs,
              bolumKodu: eabolum.bolumKodu,
            });
          }
        }
      }
    }

    for (const saybolum of sayTablo) {
      if (saybolum.uniAdi === unikod.uniAdi) {
        const kod = unikod.bolumKodu;
        if (!genelUni[kod]) {
          genelUni[kod] = {
            sehir: saybolum.sehir,
            uniAdi: saybolum.uniAdi,
            uniTur: saybolum.uniTur,
          };
          genelUni[kod]['say'] = [
            {
              puan: saybolum.puan,
              siralama: saybolum.siralama,
              bolumAdi: saybolum.bolumAdi,
              burs: saybolum.burs,
              bolumKodu: saybolum.bolumKodu,
            },
          ];
        } else {
          if (!genelUni[kod]['say']) {
            genelUni[kod]['say'] = [
              {
                puan: saybolum.puan,
                siralama: saybolum.siralama,
                bolumAdi: saybolum.bolumAdi,
                burs: saybolum.burs,
                bolumKodu: saybolum.bolumKodu,
              },
            ];
          } else {
            genelUni[kod]['say'].push({
              puan: saybolum.puan,
              siralama: saybolum.siralama,
              bolumAdi: saybolum.bolumAdi,
              burs: saybolum.burs,
              bolumKodu: saybolum.bolumKodu,
            });
          }
        }
      }
    }
  }

  fs.writeFileSync(`./unileryeni.json`, JSON.stringify(genelUni), 'utf-8');
};
async function run() {
  console.log('Sayısal Bölümler Çekiliyor.');
  const sayTablo = await tablolariCek(
    'https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=say',
    99
  );
  console.log('Eşit Ağırlık Bölümler Çekiliyor.');
  const eaTablo = await tablolariCek(
    'https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=ea',
    76
  );
  console.log('Sözel Bölümler Çekiliyor.');
  const sozTablo = await tablolariCek(
    'https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=söz',
    42
  );
  console.log('Dil Bölümleri Çekiliyor.');
  const dilTablo = await tablolariCek(
    'https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=dil',
    14
  );
  console.log('Üniversiteler Çekiliyor.');

  const uniKodlari = await uniKodlariCek();
  verileriBirlestir(dilTablo, sayTablo, eaTablo, sozTablo, uniKodlari);
  console.log('Bitti.');
}
run();
