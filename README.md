<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pLMbLxinxxnYG7bZ3stlEK-X78hHL6Vy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Apply database schema:
   `npm run db:reset` or manually run [schema.sql](schema.sql) in your Supabase SQL editor
4. Run the app:
   `npm run dev`

## Database Fixes

If you encounter database errors, you can apply specific fixes:
- For general column mapping issues: Run [comprehensive_fix.sql](comprehensive_fix.sql)
- For category column specifically: Run [fix_category_column.sql](fix_category_column.sql)
- For part status column specifically: Run [fix_part_status_column.sql](fix_part_status_column.sql)