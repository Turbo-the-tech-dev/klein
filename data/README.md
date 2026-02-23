# Data Directory

*heavy breathing* 🫁 Data Directory - The knowledge repository.

## Overview

This directory contains structured data files that power the Klein Electrician Toolkit application.

## Files

### catalog.json

The master tool catalog containing:
- Complete tool listings for all manufacturers
- Model numbers and descriptions
- Cross-references between organizational structures
- Category and application mappings

**Structure:**
```json
{
  "catalog": {
    "version": "1.0.0",
    "manufacturers": [...],
    "categories": [...],
    "applications": [...]
  },
  "tools": {
    "{manufacturer}": {
      "manufacturer": "Name",
      "description": "Description",
      "tools": [...]
    }
  },
  "crossReference": {
    "byCategory": {...},
    "byApplication": {...}
  }
}
```

## Tool Entry Structure

Each tool entry contains:
```json
{
  "name": "Tool Name",
  "model": "MODEL-NUMBER",
  "category": "category-name",
  "application": ["app1", "app2"],
  "paths": {
    "byManufacturer": "src/tools/manufacturer/tool-type",
    "byCategory": "src/tools/category/category/manufacturer",
    "byApplication": ["src/tools/application/app/manufacturer"]
  }
}
```

## Quality Standards

*heavy breathing* Data files must:
- Be valid JSON
- Include all required fields
- Have consistent formatting
- Be properly cross-referenced
- Include version information

## Updating the Catalog

When adding new tools:
1. Add tool entry to appropriate manufacturer
2. Update cross-reference tables
3. Increment version number
4. Update lastUpdated date
5. Run redundancy check to verify paths

## Validation

Use the utility scripts to validate data:
```bash
# Check catalog integrity
npx ts-node src/utils/toolRegistry.ts

# Generate cross-reference report
npx ts-node src/utils/crossReference.ts

# Verify all paths exist
npx ts-node src/utils/redundancyCheck.ts
```
