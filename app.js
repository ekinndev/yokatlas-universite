const puppeteer = require('puppeteer');
const fs = require('fs');

const tablolariCek = async (url, sayfaSayisi) => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 150 });
  let page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('#mydata_next');
  let bolumlerGenel = [];
  for (let index = 1; index <= sayfaSayisi; index++) {
    let okullar = await page.$$eval('#mydata > tbody > [role="row"]', (uniler) => {
      return uniler.map((okul) => {
        let uni = {};
        uni.bolumkodu = okul.querySelector('a').innerText.trim();
        const fontVeriler = okul.querySelectorAll('font');
        const strongVeriler = okul.querySelectorAll('strong');
        for (let index = 0; index < strongVeriler.length; index++) {
          if (index == 0) {
            uni.uniadi = strongVeriler[index].innerText.trim();
          } else if (index == 1) {
            uni.bolumadi = strongVeriler[index].innerText.trim();
          }
        }
        for (let index = 0; index < fontVeriler.length; index++) {
          if (index == 1) {
            uni.bolumadi += ' ' + fontVeriler[index].innerText.trim();
          } else if (index == 10) {
            uni.siralama2019 = fontVeriler[index].innerText.trim();
          } else if (index == 14) {
            uni.puan2019 = fontVeriler[index].innerText.trim();
          }
        }

        return uni;
      });
    });
    okullar.forEach((okul) => {
      bolumlerGenel.push(okul);
    });
    await page.click('#mydata_next');
  }

  browser.close();
  return bolumlerGenel;
};

const uniKodlariCek = async () => {
  const Browser = await puppeteer.launch({ headless: false });
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
        kod: okulKod.trim(),
        uniadi: okulIsim.trim(),
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
    for (const saybolum of sayTablo) {
      if (saybolum.uniadi === unikod.uniadi) {
        const kod = unikod.kod;
        if (!genelUni[kod]) {
          genelUni[kod] = [{ ...saybolum }];
        } else {
          genelUni[kod].push({ ...saybolum });
        }
      }
    }
    for (const eabolum of eaTablo) {
      if (eabolum.uniadi === unikod.uniadi) {
        const kod = unikod.kod;
        if (!genelUni[kod]) {
          genelUni[kod] = [{ ...eabolum }];
        } else {
          genelUni[kod].push({ ...eabolum });
        }
      }
    }
    for (const sozbolum of sozTablo) {
      if (sozbolum.uniadi === unikod.uniadi) {
        const kod = unikod.kod;
        if (!genelUni[kod]) {
          genelUni[kod] = [{ ...sozbolum }];
        } else {
          genelUni[kod].push({ ...sozbolum });
        }
      }
    }
    for (const dilbolum of dilTablo) {
      if (dilbolum.uniadi === unikod.uniadi) {
        const kod = unikod.kod;
        if (!genelUni[kod]) {
          genelUni[kod] = [{ ...dilbolum }];
        } else {
          genelUni[kod].push({ ...dilbolum });
        }
      }
    }
  }
 

  fs.writeFileSync(`./uniler.json`, JSON.stringify(genelUni), 'utf-8');
};
async function run() {
  const dilTablo = await tablolariCek(
    'https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=dil',
    14
  );
  const eaTablo = await tablolariCek(
    'https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=ea',
    76
  );
  const sozTablo = await tablolariCek(
    'https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=söz',
    42
  );
  const sayTablo = await tablolariCek(
    'https://yokatlas.yok.gov.tr/tercih-sihirbazi-t4-tablo.php?p=say',
    99
  );

  const uniKodlari = await uniKodlariCek();
  verileriBirlestir(dilTablo, sayTablo, eaTablo, sozTablo, uniKodlari);
}
run();
