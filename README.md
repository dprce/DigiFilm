# Programsko inženjerstvo
# Opis projekta
Ovaj projekt je rezultat timskog rada u sklopu projektnog zadatka kolegija Programsko inženjerstvo na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu, akademske godine 2024./2025. Motivacija za razvoj aplikacije je problem digitalizacije arhivskih filmskih materijala koja je u današnje vrijeme neophodna zbog zastarjelosti nekadašnjeg načina pohrane zapisa na filmske trake. Aplikacija omogućuje unos, potvrdu te izmjenu već postojećih podataka o filmskim zapisima kao i nadziranje samog procesa digitalizacije. Nadziranje uključuje precizno vođenje evidencije o sudionicima u samom procesu, njihovim koracima i ograničenjima s obzirom na njihove uloge. Cilj je optimizirati proces digitalizacije arhivskih materijala. 
# Funkcijski zahtjevi
   - 	učitavanje bar koda
   - 	učitavanje podataka iz baze podataka na temelju koda
   - 	u slučaju da nije moguće spajanje na bazu podataka, učitavanje podataka iz xml datoteke
   - 	ručna izmjena i nadopuna podataka
   - 	verifikacija formata zapisa
   - 	spremanje zapisa
   - 	grupiranje filmova uz maksimalnu iskoristivost
   - 	generiranje evidencije o iznošenju i vraćanju materijala
   - 	prikaz statistike o aktivnostima korisnika
   - 	implementirane različite korisničke uloge
   - 	autentifikacija

## Korisnici
   - 	djelatnik
   - 	voditelj postupka digitalizacije
   - 	administrator informatičkog sustava

## Korisničke uloge
   - 	djelatnik koji unosi podatke
   - 	djelatnik koji samo pregledava podatke
   - 	voditelj postupka digitalizacije (može mijenjati sve podatke nakon unosa djelatnika)
   - 	administrator informatičkog sustava

# Nefunkcijski zahtjevi
   - 	ukupna duljina digitalizacije manja ili jednaka 45 minuta
   - 	pdf dokumenti za premještanje materijala
   - 	istovremeni unos podataka do 25 djelatnika
   - 	izvoz podataka u pdf, xml, xlsx formatima
   - 	izvoz podataka statistike u pdf/xlsx formatu
   - 	prilagođenost upotrebi na raznim uređajima
   - 	responzivni dizajn
   - 	osigurati zaštitu podataka i autentifikaciju korisnika
   - 	sposobnost prilagođavanju rastućem broju korisnika

# Članovi tima
> Nika Jelić - voditelj/backend
> Luka Kolačević - backend
> Antonia Lubina - dokumentacija
> Lovre Mastelić - frontend
> Lovro Mišak - frontend
> Dominik Prce - full stack
> Anamaria Vitas - dizajn

# Kontribucije
>Pravila ovise o organizaciji tima i su često izdvojena u CONTRIBUTING.md



# 📝 Kodeks ponašanja [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
Kao studenti sigurno ste upoznati s minimumom prihvatljivog ponašanja definiran u [KODEKS PONAŠANJA STUDENATA FAKULTETA ELEKTROTEHNIKE I RAČUNARSTVA SVEUČILIŠTA U ZAGREBU](https://www.fer.hr/_download/repository/Kodeks_ponasanja_studenata_FER-a_procisceni_tekst_2016%5B1%5D.pdf), te dodatnim naputcima za timski rad na predmetu [Programsko inženjerstvo](https://wwww.fer.hr).
Očekujemo da ćete poštovati [etički kodeks IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html) koji ima važnu obrazovnu funkciju sa svrhom postavljanja najviših standarda integriteta, odgovornog ponašanja i etičkog ponašanja u profesionalnim aktivnosti. Time profesionalna zajednica programskih inženjera definira opća načela koja definiranju  moralni karakter, donošenje važnih poslovnih odluka i uspostavljanje jasnih moralnih očekivanja za sve pripadnike zajenice.

Kodeks ponašanja skup je provedivih pravila koja služe za jasnu komunikaciju očekivanja i zahtjeva za rad zajednice/tima. Njime se jasno definiraju obaveze, prava, neprihvatljiva ponašanja te  odgovarajuće posljedice (za razliku od etičkog kodeksa).

# 📝 Licenca
Važeča (1)
[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

Ovaj repozitorij sadrži otvoreni obrazovni sadržaji (eng. Open Educational Resources)  i licenciran je prema pravilima Creative Commons licencije koja omogućava da preuzmete djelo, podijelite ga s drugima uz 
uvjet da navođenja autora, ne upotrebljavate ga u komercijalne svrhe te dijelite pod istim uvjetima [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License HR][cc-by-nc-sa].
>
> ### Napomena:
>
> Svi paketi distribuiraju se pod vlastitim licencama.
> Svi upotrijebleni materijali  (slike, modeli, animacije, ...) distribuiraju se pod vlastitim licencama.

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: https://creativecommons.org/licenses/by-nc/4.0/deed.hr 
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

Orginal [![cc0-1.0][cc0-1.0-shield]][cc0-1.0]
>
>COPYING: All the content within this repository is dedicated to the public domain under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.
>
[![CC0-1.0][cc0-1.0-image]][cc0-1.0]

[cc0-1.0]: https://creativecommons.org/licenses/by/1.0/deed.en
[cc0-1.0-image]: https://licensebuttons.net/l/by/1.0/88x31.png
[cc0-1.0-shield]: https://img.shields.io/badge/License-CC0--1.0-lightgrey.svg

### Reference na licenciranje repozitorija
