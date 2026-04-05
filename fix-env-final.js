const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
let content = fs.readFileSync(envPath, 'utf8');

// The key body I've captured from previous view_file calls
const keyBody = `MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCuX7NjfkgkE3ei
Lr4p9RDY7IiOstUKkLRUMkmhc1vr6sKeTQDsfefJtZUAr8Qbc8Rbc2DolI0tRlby
qxshVk9r8tiQSxTLiN/DzvONcZsXg+QJ1R6KYD8RjQbXynScySRUHMbzmj31q9I6
hFx/BragY6fn/70eCmbc9TWuIQObRrWvQKGJtTvAI5diIk3PCXhApUKkcX7Ce8bi
b8TPp5NMTwRWKKhT7m4pirkk/YqBfzzIFaG8+4KdQ3ouRHmeYN0p/VA1p4TnGG1n
1G+X3LkfIqUVtqlyL5MY2+Q5HnuozdD0vX4JXZ6MKoy1A1QaBOfLX7QcORxPrBsb
fBY/vTUrAgMBAAECggEACBLpUPmHaJg4KVvFtVaiDZFCL21LXP5fQyjC7QVU48MO
eNry6IBZ66aLPClnSKgfFubsPUinksmXfAv9KRmAeuyXJ3M6hsQTLFNYRpvUhQ23
0Na738deFDd18ibvKFVN59EfSydAqC/o/4miaMVMTnfezeiy/oGXyrJV5naj3pwf
cegyfaTxeR8wpDeNcsY88BwHlAPrKnIVETUyAHG0Du9QhfVOXJjvZoSI/2vnPQJK
w0wPosRqv29cfKYwVhlPDwdxcqZVEgiipJnBAPhRaMFM3aIk4s4X+6/bHS7RfAdQ
WUlGfyJZpCRJV0xoKqeCmeNgqIpLyKkzItZhKhlsTQKBgQDg3NdAOmJXhjy3I4Ko
wIRqhuWZK/PpueqyKNloiGvUpNhYLxolVriumcNQpWieZY4wunvvac+Rjm2tabH+
idB6BWdqTzB1riC2VsQJEhug8RmCbct0k0ZE04BfO8UKBHvCT6qUtvNB54kpFDlB
1TKIaz8eRCY2TpvqWXLaUNE4LwKBgQDGhRSwKRzjoVE8VbkGLF5a7kR52Ag3vUBt
vuwZEjxrYEWTnz8T7uKmmBgZqia7BGbWWTRh0JKx1xqllI4CwRMNcZEXXxSsZwM3
PI/dSXMcZE5Cwv+e62YYwtGv18V08ejTE3Pc7Z1LQ9RuKpNdY5lytAc68x22N09l
RViT12tXxQKBgAoo0Czdtm2/6eRYXWHkeNcbSypVewq3VKxB/jij2UNdQ00Qq7y+
I0/4MIPnRUfKzNbUxh62CCPKbJgmK12Vum6Y6eg6tbTLbjzuxKKoR8lIu19SOJwG
v2kCqU0kNS3TsAfCc7GOZoU2wdKyUDfyOvtA5TQn3hYcDR1Ud0T328wPAoGAGKLJ
R3dCq4kIcMlelcKJzxUEkG5bzrcAuN3ZpN7beqPO3pwDkvCxVeVIEF9KQSkxreYS
FxVwLvu3xdairPrS53cxf0oAYcjC4Gb2n4qO63YTNDvIxysFV4tNxFmtmm6u6wrd
9QvT2lRHl4hXE17Z2x82Sn2DMWq5wqKRdH9mRdUCgYAZTLB/PypwXAvkKiXXpDGB
PjA8fJm5/VcHGvb2WtwHcyVZmeqHm984dQ2q1M/M1Z1Efkn25y8qCEeRukN54xkF
IcGo0jwFEiGDeYGYARslIS/ycQUCz1Kk2juXg4MTz4iZ8poWfX9fvbRCsfMi1vWq
HxjsFpKRn3vTXh9W0HkiSA==`;

const escapedKey = `-----BEGIN PRIVATE KEY-----\\n${keyBody.split('\n').join('\\n')}\\n-----END PRIVATE KEY-----\\n`;

// Replace the old block including quotes
const updatedContent = content.replace(/FIREBASE_PRIVATE_KEY=[\s\S]*?(?=\n#|\n\n|\n$)/, `FIREBASE_PRIVATE_KEY="${escapedKey}"`);

fs.writeFileSync(envPath, updatedContent);
console.log('RE-WRITTEN .env.local with standard escaped key format.');
