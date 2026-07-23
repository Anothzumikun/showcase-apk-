// Jalankan: node scripts/create-admin.mjs "admin@example.com" "password-kamu" "Nama Admin"
// Lalu copy hasil SQL yang dicetak dan jalankan di Supabase SQL Editor.
import bcrypt from "bcryptjs";

const [, , email, password, name = "Admin"] = process.argv;

if (!email || !password) {
  console.error('Cara pakai: node scripts/create-admin.mjs "email" "password" "Nama"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

console.log("\nJalankan SQL berikut di Supabase SQL Editor:\n");
console.log(
  `insert into admins (email, password_hash, name) values ('${email
    .toLowerCase()
    .trim()}', '${hash}', '${name.replace(/'/g, "''")}');`
);
