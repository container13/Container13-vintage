# Vinted copy engine V2 — isolated draft (NOT LIVE)
Status: DRAFT / NOT APPROVED. Production and WORKER_PENDING.js remain unchanged. No release bump.
## Data contract
Input: reviewed title, description, details, language, style, recent openings.
Output: JSON title, description, details. Preserve verified product facts. Never infer condition, age, fabric, rarity, authenticity or measurements.
## Separate style instructions
NEUTRAL: Plain listing. One factual sentence, optionally two. No marketing.
SELLING: Speak like a good human Vinted seller. Create genuine interest by choosing the two strongest VERIFIED details. Warm, confident and conversational. Natural positive words such as snygg, fin, härlig are allowed as subjective presentation, but no claims about condition. Two or three varied sentences; not a fixed length. No robotic summary.
MAX: Distinct punchy vintage/streetwear seller voice. A lively opening and a decisive follow-through, with energy and taste. Express attitude without claiming rarity, vintage origin, authenticity or quality. Do not simply reorder Neutral. Avoid padding and generic hype.
## Shared factual safety only
Keep verified brand, garment type, color, visible cut and details; preserve detail fields. Do not transfer features from examples to the user's garment. No invented measurements, condition or age. No claims about wearer.
## Independent quality checks
1. Every physical fact must appear in source input.
2. Neutral, Selling and Max must have recognizably different voice, not merely different length.
3. Selling and Max should create buyer interest without artificial phrases.
4. Remove factual repetition and administrative wording (e.g. 'enligt angiven tillverkare').
5. No hard minimum word count and no quality rejection solely because the text is short.
## Test fixture: Lee jeans
Source: Lee; light blue washed denim; straight legs; five-pocket design; rolled hems.
Neutral example: 'Ljusblå Lee-jeans i tvättad denim med raka ben, fem fickor och uppvikta benslut.'
Selling example: 'Snygga Lee-jeans i ljusblå tvätt med raka ben. De uppvikta bensluten ger en fin detalj till den klassiska femficksmodellen.'
Max example: 'Lee i ljusblå denim! Rak modell, fem fickor och uppvikta benslut. En snygg kombination av klassisk jeansdesign och ljus tvätt.'
Examples are style references, never facts to import. Test additional jacket, knitwear and sneaker fixtures before approval.
## Release gate
No active Worker changes or version increment until three styles have been generated from the same fixtures and reviewed. Record actual outputs and PASS/FAIL; no fabricated model-test results.
