# FlashData GH — Netlify website

## Included in this package
- Terms & Conditions screen shown before registration (acceptance version is stored in the browser).
- Registration form with full name, Ghana phone number and email.
- Telegram registration alert containing date/time, device type, browser and user-agent string.
- Rewards wheel visibly labelled 2GB, 6GB, 8GB and 10GB, with an optional spin sound.
- 24-hour return timer after a claim is successfully submitted.
- Claim confirmation popup showing pending status and the next eligible spin time.
- MTN MoMoPay merchant details loaded securely from a Netlify Function.
- Professionally formatted Telegram claim alerts with Approve and Reject inline buttons.
- Open Graph/Twitter metadata and a FlashData GH social sharing preview image.

## Deploy to Netlify
1. Extract this ZIP.
2. Deploy the extracted `flashdata-gh` folder using Netlify's manual deploy, or connect the folder through a Git repository.
3. In Netlify Site configuration → Environment variables, add:
   - `MTN_MERCHANT_NAME` — exact MTN merchant name.
   - `MTN_MERCHANT_ID` — MTN MoMoPay merchant ID.
   - `TELEGRAM_BOT_TOKEN` — Telegram bot token (keep private).
   - `TELEGRAM_CHAT_ID` — administrator's private Telegram chat ID.
4. Save and redeploy.
5. Configure the Telegram bot webhook to receive approval button presses. After the site is deployed, open this URL in a browser, replacing the placeholders:
   `https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://YOUR-SITE.netlify.app/.netlify/functions/telegram-action`
   Keep the bot token private. A successful response should contain `"ok":true`.
6. Test a registration and a claim. Check both Telegram notification formats and test each inline button.

## Payment review
Paid bundle claims cost GH₵10 as displayed. The customer enters the MoMo sender name, sender number and transaction reference. The Telegram notification is marked PENDING. Verify payment in the MTN merchant account or statement before approving or fulfilling. The Telegram buttons update the claim message to show the administrator's decision; they do not independently verify payment or send data bundles.

## Important limitations — read before launch
- The 24-hour cooldown and Terms acceptance are stored in the visitor's browser local storage. Clearing browser data or using another device/browser can bypass them. This is not secure account-wide enforcement.
- Registration/sign-in is still a front-end session flow, not real secure account authentication. The wheel result is selected in the browser, not by a trusted server. Do not treat this package as a production-grade rewards or lottery system without backend authentication, server-side eligibility/reward selection, persistent claim storage and abuse controls.
- Claim decisions are reflected in Telegram messages only. There is no customer-facing live status portal or automatic data bundle delivery.
- Social preview images may take time to refresh after sharing because WhatsApp, Facebook and other platforms cache previews. The image URL is `/share-preview.png`; set the `og:image` and `twitter:image` values to the full absolute HTTPS URL of your deployed site if your social platform requires absolute URLs.
- Telegram user-agent strings can contain technical browser/device information. Limit administrator access to the bot and do not share notification screenshots publicly.

## Safety
Never ask customers for MoMo PINs, OTPs, passwords, Ghana Card numbers or payment screenshots. Keep the Telegram bot token and merchant settings in Netlify environment variables, never in public HTML or source control.
