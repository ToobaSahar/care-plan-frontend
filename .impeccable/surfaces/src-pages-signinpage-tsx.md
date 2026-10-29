---
version: 1
slug: "src-pages-signinpage-tsx"
primary_target: "src/pages/SignInPage.tsx"
related_targets: []
---

# Sign in

Scope: the sign-in page at `/sign-in`, Operate mode with a brand panel. Audience: care staff signing in (assessors on tablets, office staff), and prospects arriving from the home page's "Start an assessment" during demos. Job: get a staff member in quickly and safely, and show a prospect the product they are about to enter. No self-registration and no "create an account" link: accounts are issued by an administrator.

Behaviour kept exactly: the provider's two checks (credential, then active staff row), the redirect to `state.from` or `/assessments` once ready, the single "not recognised" message for a wrong address or password.

## Direction contract

THESIS: The doorway to the case file. The brand panel shows one sample record's plan being made (signed, analysed, planned, reviewed), so the product is visible before you enter it; the form says where you will land and names each check it makes.

OWN-WORLD: CentiCare on oat. A full-height Slate Teal panel (user decision: teal, with berry only where it means a person) carrying the light lockup, the brand line in white, one white 14px sample sheet with the product's own marks on a hairline, and a staff-only assurance. The form sits directly on oat in a 400px column, no card, the product's own Field, Input and Button.

FIRST VIEWPORT: Desktop split 5/7. Left: light lockup linking home; "Less writing. Safer care plans."; the sample sheet (Edith Marlow, mulberry avatar; four steps whose marks fill in turn, each with the reader's note); staff-only line at the foot. Right: "Back to home" at the top; greeting; destination line ("Next: …", from the guarded route that sent you); work email; password with show/hide and a Caps Lock notice; Sign in with a status naming each check; the administrator note. Below 1024px the panel gives way to an oat top bar (lockup to home, Home link) and a compact assurance under the form.

FORM: Signature interaction: the plan path fills once on arrival, mark by mark down a hairline, in the reader channels (Sea Mist, Deep Sea, Slate Teal). Reduced motion shows every mark filled. Nothing readable waits on it.

FINISH: detector clean, captured at 1440 and 390, signed-out flow verified in the browser.
