# News Data Directory

Place daily news files here as `YYYY-MM-DD.json`.

## File Format

```json
{
  "date": "2026-04-07",
  "featured": {
    "id": "featured-XXX",
    "title": "Headline text",
    "summary": "Full description paragraph...",
    "image": "https://...",
    "source": "Source Name",
    "url": "https://...",
    "tags": ["Tag1", "Tag2"],
    "timestamp": "2026-04-07T08:00:00Z"
  },
  "articles": [
    {
      "id": "art-XXX",
      "title": "Article title",
      "summary": "Short summary shown in list and detail view...",
      "image": "https://...",
      "source": "Source Name",
      "url": "https://...",
      "tags": ["Tag1", "Tag2"],
      "timestamp": "2026-04-07T07:00:00Z"
    }
  ]
}
```

## After adding a new file

1. Add the date to `AVAILABLE_DATES` in `js/data.js` (newest first)
2. Run the bundle script to regenerate `js/news-data-bundle.js`:

```bash
cd /path/to/robots-news
python3 -c "
import json, os
dates_file = open('js/data.js').read()
# Or just re-run the bundle script:
exec(open('scripts/bundle.py').read())
"
```

Or use the provided helper script:

```bash
python3 scripts/bundle.py
```

> The `news-data-bundle.js` file embeds all JSON data so the site works when opened
> directly via file:// (no server needed). Always regenerate it after editing JSON files.
