# Utility Scripts

*heavy breathing* 🫁 Utility Scripts - The mechanisms that maintain order.

## Overview

This directory contains TypeScript utility scripts for managing the tool registry, cross-referencing tools, and verifying directory structure redundancy.

## Available Scripts

### toolRegistry.ts

Centralized tool registration system.

**Functions:**
- `loadCatalog()` - Load the master catalog
- `saveCatalog(data)` - Save the master catalog
- `registerTool(manufacturer, tool)` - Register a new tool
- `getToolsByManufacturer(manufacturer)` - Get all tools for a manufacturer
- `getToolsByCategory(category)` - Get all tools in a category
- `getToolsByApplication(application)` - Get all tools for an application
- `searchByModel(modelNumber)` - Search by model number
- `getManufacturers()` - Get all manufacturer keys
- `getCategories()` - Get all category names
- `getApplications()` - Get all application names
- `validateToolPaths(tool)` - Validate tool paths exist

**Usage:**
```bash
npx ts-node src/utils/toolRegistry.ts
```

### crossReference.ts

Cross-manufacturer tool comparison system.

**Functions:**
- `compareByCategory(category)` - Compare tools across manufacturers for a category
- `compareByApplication(application)` - Compare tools for an application
- `compareManufacturer(manufacturer)` - Get detailed manufacturer comparison
- `generateApplicationMatrix()` - Generate full application matrix
- `findEquivalentTools(toolName)` - Find equivalent tools across manufacturers
- `generateCrossReferenceReport()` - Generate formatted report

**Usage:**
```bash
npx ts-node src/utils/crossReference.ts
```

### redundancyCheck.ts

Directory structure verification system.

**Functions:**
- `runRedundancyCheck()` - Run complete redundancy check
- `generateRedundancyReport()` - Generate formatted report
- `isFullyRedundant()` - Quick check for 100% compliance

**Usage:**
```bash
npx ts-node src/utils/redundancyCheck.ts
```

## Data Directory

The `data/` directory contains:
- `catalog.json` - Master tool catalog with all cross-references

## Quality Standards

*heavy breathing* Utility scripts must:
- Have proper TypeScript types
- Include comprehensive error handling
- Follow consistent code style
- Include JSDoc documentation
- Handle edge cases gracefully

## Adding New Utilities

When adding new utility scripts:
1. Follow existing naming conventions
2. Include comprehensive JSDoc comments
3. Export functions for module usage
4. Include CLI usage with `require.main === module`
5. Add documentation to this README
