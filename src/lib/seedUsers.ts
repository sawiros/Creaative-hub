import { Member } from './supabase';

const vehicles = ['BYD Dolphin', 'BYD Atto 3', 'Tesla Model 3', 'Hyundai Kona Electric', 'Geely Geometry C', 'BYD Seal', 'Nissan Leaf', 'Tesla Model Y'];

const first = ['Abel', 'Sara', 'Mekdes', 'Yonas', 'Hanna', 'Dawit', 'Bethel', 'Natnael', 'Liya', 'Tigist', 'Ermias', 'Selam', 'Kalkidan', 'Michael', 'Ruth', 'Samuel', 'Tsion', 'Bereket', 'Mahlet', 'Girmay', 'Hiwot', 'Daniel', 'Bethlehem', 'Solomon', 'Meron', 'Fikru', 'Rahel', 'Amanuel', 'Helen', 'Yosef', 'Kidist', 'Tewodros', 'Emebet', 'Zerihun', 'Selamawit', 'Alemayehu', 'Blossom', 'Getachew', 'Winta', 'Binyam', 'Lidia', 'Tekle', 'Abebech', 'Mulugeta', 'Azeb', 'Haile', 'Saba', 'Mohammed', 'Zewdie', 'Frehiwot', 'Ashenafi', 'Muluken', 'Biruk', 'Fitsum', 'Gadise', 'Abate', 'Kiya', 'Leul', 'Robi'];

function phone(i: number) {
  // Ethiopian mobile format: 09 XX XX XX XX
  const n = (Math.floor((i * 7) % 89) + 10).toString().padStart(2, '0');
  const m = (Math.floor((i * 13) % 89) + 10).toString().padStart(2, '0');
  const k = (Math.floor((i * 29) % 89) + 10).toString().padStart(2, '0');
  return `09 ${n} ${m} ${k}`;
}

export function seedUsers(): Member[] {
  return first.map((name, i) => ({
    id: 'seed-' + i,
    full_name: name,
    phone: phone(i),
    email: `${name.toLowerCase()}.${i}@demo.chargeshare.et`,
    vehicle: vehicles[i % vehicles.length],
    battery: 12 + ((i * 17) % 85),
    is_seed: true,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}
