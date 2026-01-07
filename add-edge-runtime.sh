#!/bin/bash

# Script to add Edge Runtime to all API routes and dynamic pages for Cloudflare Pages

echo "🔧 Adding Edge Runtime to all routes..."

# Find all route.ts files in app/api
api_routes=$(find app/api -name "route.ts" -type f)

# Find dynamic pages
dynamic_pages=(
  "app/admin/page.tsx"
  "app/admin/inventory/page.tsx"
  "app/admin/inventory/add/page.tsx"
  "app/admin/inventory/edit/[id]/page.tsx"
  "app/admin/rentals/page.tsx"
  "app/admin/reports/page.tsx"
  "app/admin/requests/page.tsx"
  "app/admin/requests/[id]/page.tsx"
  "app/admin/settings/page.tsx"
  "app/rentals/[id]/page.tsx"
  "app/vehicle/[id]/page.tsx"
)

count=0

# Process API routes
for file in $api_routes; do
  if [ -f "$file" ]; then
    # Check if already has runtime export
    if ! grep -q "export const runtime" "$file"; then
      # Add runtime export after imports
      # Find the first line that doesn't start with import or is empty
      awk '
        BEGIN { added = 0 }
        {
          print
          if (!added && !/^import / && !/^$/ && !/^\/\//) {
            print "\nexport const runtime = '\''edge'\'';\n"
            added = 1
          }
        }
      ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
      echo "✅ Added to: $file"
      ((count++))
    else
      echo "⏭️  Already has runtime: $file"
    fi
  fi
done

# Process dynamic pages
for file in "${dynamic_pages[@]}"; do
  if [ -f "$file" ]; then
    if ! grep -q "export const runtime" "$file"; then
      # For .tsx files, add at the top after imports
      sed -i '' '1a\
export const runtime = '\''edge'\'';
' "$file" 2>/dev/null || sed -i '1a export const runtime = '\''edge'\'';' "$file"
      echo "✅ Added to: $file"
      ((count++))
    else
      echo "⏭️  Already has runtime: $file"
    fi
  fi
done

echo ""
echo "✨ Completed! Updated $count files with Edge Runtime"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Add Edge Runtime for Cloudflare'"
echo "3. git push"
