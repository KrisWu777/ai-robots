#!/usr/bin/env python3
"""
Migrate flat news/YYYY-MM-DD.json → news/YYYY-MM-DD/en-US.json

Run once after upgrading to i18n architecture.
Existing en-US.json files are not overwritten.
"""

import os
import shutil
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.dirname(SCRIPT_DIR)
NEWS_DIR   = os.path.join(ROOT_DIR, 'news')

migrated = 0
skipped  = 0

for fname in sorted(os.listdir(NEWS_DIR)):
    if not fname.endswith('.json'):
        continue
    date = fname[:-5]
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', date):
        continue

    src      = os.path.join(NEWS_DIR, fname)
    dest_dir = os.path.join(NEWS_DIR, date)
    dest     = os.path.join(dest_dir, 'en-US.json')

    os.makedirs(dest_dir, exist_ok=True)

    if os.path.exists(dest):
        print(f'  SKIP (exists): {date}/en-US.json')
        skipped += 1
    else:
        shutil.copy2(src, dest)
        print(f'  Migrated: {fname} → {date}/en-US.json')
        migrated += 1

print(f'\nDone. {migrated} migrated, {skipped} skipped.')
