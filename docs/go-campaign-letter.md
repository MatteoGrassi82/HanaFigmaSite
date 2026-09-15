# The /go campaign: the letter, the QR, the merge

Written for: Matteo, building the LettrLabs template and the 247-row merge.

Companion to the landing page at `/go` (`src/app/pages/Go.tsx`). The letter and the
page are one piece of writing split across two surfaces, so if you change the voice
of one, change the other. The page answers the letter; it does not restate it.

---

## 1. The letter

One page. Plain type, black on white, no logo block, no colour, no stock photo. The
whole argument of the piece is that it looks like a person wrote it, so anything
that looks designed works against it.

> {{practice_name}}
> {{address_line_1}}
> {{city}}, {{state}} {{zip}}
>
> Dear Dr. {{last_name}},
>
> This letter is plain on purpose. I wanted it to look like what it is, which is one
> person writing to you, not a campaign.
>
> You almost certainly have Medicare patients who qualify for chronic care management
> and are not enrolled in it. Most independent practices do. The codes have been
> billable since 2015. CCM 99490 pays about $66 per enrolled patient per calendar
> month, at the CY2026 national non-facility rate, before geographic adjustment.
>
> The reason it goes unbilled is not that you have not heard of it. It is that it is
> twenty minutes of phone work per patient per month, plus documentation good enough
> to bill, and there is nobody free to do it. That is not a performance problem in
> your practice. There are not enough hours in it.
>
> HANA gives a care coordinator assistants. Your team sets the work once and decides
> what happens with what comes back. The assistants do the groundwork, every month,
> and what returns is documented and ready for your team to review and bill. Nothing
> clinical is decided by software, and nothing bills until one of your people has
> looked at it.
>
> There is a short film that explains this better than another page of typing would.
> It is shorter than this letter.
>
> [ QR CODE ]
>
> The same code books twenty minutes with me, if it is worth twenty minutes. Or call
> me on +1 (517) 300-7189.
>
> Matteo Grassi
> Co-founder, HANA Health

### What is deliberately not in it

- **No patient, interaction or practice counts.** Same rule as the film. The one
  number is a published CMS rate, not capacity arithmetic.
- **No "AI calls your patients."** The word is *assistants*, and the sentence about
  who decides is load-bearing, not decoration. Keep both if you rewrite.
- **No second call to action.** The QR is the letter's only exit. A reply card, a
  website address and a QR code all competing is three exits and no conversion. The
  phone number is the fallback, not a second ask.
- **No em dashes.** House style.

### One thing to confirm before printing

The $66.13 figure is CY2026 national non-facility for 99490, sourced in
`src/app/components/lab/interactive/rates.ts` with its own caveats. That file also
says to re-verify when the CY2027 final rule lands, around **1 November 2026**. If
these letters post before then the figure is current. If they slip past it, check it
again, because 99490 moved about 9 percent between CY2025 and CY2026.

---

## 2. The QR code

Each letter gets its **own** QR code. That is the entire tracking design, and it is
the part that cannot be fixed after printing.

```
https://hana.health/go?r=1
https://hana.health/go?r=2
...
https://hana.health/go?r=247
```

- `r` is the row number in the merge, 1 to 247, one per recipient.
- Keep a column mapping `r` to the practice. Nothing on the page or in the database
  knows who `143` is; that join is yours and it is the whole point of the exercise.
- The page renders normally if `r` is missing or malformed, so a QR reader that
  strips the query string still lands somewhere sensible.
- **`hana.health/go` is permanent.** Once these are in the post the path can never
  move, be renamed, or be folded into another page.

Print at 2cm or larger with quiet space around it. Error correction level M is
enough for a URL this short.

---

## 3. What comes back

Every scan writes one row: `r`, timestamp, user agent, and the country the request
came from. Bots and link previewers are filtered out, so a row is a person.

The list to work is **scanned but did not book**. Those are practices that read the
letter, took out a phone, watched some of a film about their own week, and then
stopped. They are warmer than anyone who never scanned and easier to call than
anyone who booked, because you already know exactly what they saw.

```sql
-- the call list, most recent first
select r, seen_at, user_agent
from go_visits
order by seen_at desc;
```

---

## 4. If you want it as an email instead

The same copy works as an email with three changes. It is a worse channel for this
audience and this argument, so use it as a follow-up to a letter rather than
instead of one.

- **Subject:** `The codes you are not billing`
- Drop the address block and the line about the letter being plain, which only makes
  sense on paper.
- Replace the QR paragraph with a single link on its own line:
  `https://hana.health/go?r={{row}}`. Keep the `r`, it works identically.

Everything else stands, including the assistants sentence and the single exit.
