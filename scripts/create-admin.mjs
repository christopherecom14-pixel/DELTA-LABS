// Creates (or resets the password of) a recruitment dashboard user.
//
//   node --env-file=.env.local scripts/create-admin.mjs you@deltalabs.tech "Your Name" admin
//
// Roles: admin | recruiter | viewer. The password is read from ADMIN_PASSWORD
// or prompted for (input hidden). Uses the same scrypt format as lib/server/auth.ts.
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { createInterface } from "node:readline";
import { promisify } from "node:util";
import { MongoClient } from "mongodb";

const scrypt = promisify(scryptCb);
const [email, name, role = "admin"] = process.argv.slice(2);

if (!email || !name || !["admin", "recruiter", "viewer"].includes(role)) {
  console.error('Usage: node --env-file=.env.local scripts/create-admin.mjs <email> "<name>" [admin|recruiter|viewer]');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : "");
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = process.env.ADMIN_PASSWORD || (await promptHidden("Password (12+ characters): "));
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await scrypt(password, salt, 64);
const passwordHash = `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;

const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const users = client.db(process.env.MONGODB_DATABASE || "deltalabs").collection("admin_users");
  await users.createIndex({ email: 1 }, { unique: true });
  const result = await users.updateOne(
    { email: email.toLowerCase() },
    { $set: { name, role, passwordHash, active: true }, $setOnInsert: { email: email.toLowerCase(), createdAt: new Date() } },
    { upsert: true },
  );
  console.log(result.upsertedCount ? `Created ${role} ${email}.` : `Updated ${email} (role ${role}, password reset).`);
} finally {
  await client.close();
}
