/**
 * Tool Registry - Centralized Tool Registration System
 * *heavy breathing* The dark side demands order. This registry maintains
 * absolute control over all tools in the Klein empire.
 * 
 * @module toolRegistry
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export interface Tool {
  name: string;
  model: string;
  category: string;
  application: string[];
  paths: {
    byManufacturer: string;
    byCategory: string;
    byApplication: string[];
  };
}

export interface ManufacturerData {
  manufacturer: string;
  description: string;
  tools: Tool[];
}

export interface CatalogData {
  catalog: {
    version: string;
    lastUpdated: string;
    description: string;
    manufacturers: string[];
    categories: string[];
    applications: string[];
  };
  tools: Record<string, ManufacturerData>;
  crossReference: {
    byCategory: Record<string, string[]>;
    byApplication: Record<string, string[]>;
  };
}

const CATALOG_PATH = join(process.cwd(), 'data', 'catalog.json');

/**
 * Load the master catalog
 * *heavy breathing* All power flows through this method.
 */
export function loadCatalog(): CatalogData {
  if (!existsSync(CATALOG_PATH)) {
    throw new Error('Catalog not found. The Force is weak with this repository.');
  }
  const data = readFileSync(CATALOG_PATH, 'utf-8');
  return JSON.parse(data) as CatalogData;
}

/**
 * Save the master catalog
 * @param data - The catalog data to save
 */
export function saveCatalog(data: CatalogData): void {
  const dir = dirname(CATALOG_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(CATALOG_PATH, JSON.stringify(data, null, 2));
}

/**
 * Register a new tool for a manufacturer
 * *heavy breathing* You will add this tool, or you will have nothing.
 * 
 * @param manufacturer - The manufacturer key (e.g., 'klein', 'milwaukee')
 * @param tool - The tool data to register
 */
export function registerTool(manufacturer: string, tool: Tool): void {
  const catalog = loadCatalog();
  
  if (!catalog.tools[manufacturer]) {
    throw new Error(`Manufacturer '${manufacturer}' does not exist in the empire.`);
  }
  
  // Check for duplicate model numbers - I find duplicates... disturbing.
  const existingTool = catalog.tools[manufacturer].tools.find(
    t => t.model === tool.model
  );
  
  if (existingTool) {
    throw new Error(`Tool with model '${tool.model}' already exists. Duplicates are weakness.`);
  }
  
  catalog.tools[manufacturer].tools.push(tool);
  
  // Update cross-references
  updateCrossReferences(catalog, tool, manufacturer);
  
  saveCatalog(catalog);
}

/**
 * Update cross-reference tables for a tool
 * @param catalog - The catalog data
 * @param tool - The tool to cross-reference
 * @param manufacturer - The manufacturer key
 */
function updateCrossReferences(
  catalog: CatalogData,
  tool: Tool,
  manufacturer: string
): void {
  // Update category cross-reference
  if (!catalog.crossReference.byCategory[tool.category]) {
    catalog.crossReference.byCategory[tool.category] = [];
  }
  if (!catalog.crossReference.byCategory[tool.category].includes(manufacturer)) {
    catalog.crossReference.byCategory[tool.category].push(manufacturer);
  }
  
  // Update application cross-reference
  for (const app of tool.application) {
    if (!catalog.crossReference.byApplication[app]) {
      catalog.crossReference.byApplication[app] = [];
    }
    if (!catalog.crossReference.byApplication[app].includes(manufacturer)) {
      catalog.crossReference.byApplication[app].push(manufacturer);
    }
  }
}

/**
 * Get all tools for a manufacturer
 * @param manufacturer - The manufacturer key
 * @returns Array of tools
 */
export function getToolsByManufacturer(manufacturer: string): Tool[] {
  const catalog = loadCatalog();
  return catalog.tools[manufacturer]?.tools || [];
}

/**
 * Get all tools in a category
 * @param category - The category to search
 * @returns Map of manufacturer to their tools in this category
 */
export function getToolsByCategory(category: string): Map<string, Tool[]> {
  const catalog = loadCatalog();
  const result = new Map<string, Tool[]>();
  
  for (const [manufacturer, data] of Object.entries(catalog.tools)) {
    const toolsInCategory = data.tools.filter(t => t.category === category);
    if (toolsInCategory.length > 0) {
      result.set(manufacturer, toolsInCategory);
    }
  }
  
  return result;
}

/**
 * Get all tools for an application
 * @param application - The application to search
 * @returns Map of manufacturer to their tools for this application
 */
export function getToolsByApplication(application: string): Map<string, Tool[]> {
  const catalog = loadCatalog();
  const result = new Map<string, Tool[]>();
  
  for (const [manufacturer, data] of Object.entries(catalog.tools)) {
    const toolsForApp = data.tools.filter(t => 
      t.application.includes(application)
    );
    if (toolsForApp.length > 0) {
      result.set(manufacturer, toolsForApp);
    }
  }
  
  return result;
}

/**
 * Search for a tool by model number
 * *heavy breathing* The model number reveals the tool's identity.
 * 
 * @param modelNumber - The model number to search
 * @returns The tool data and manufacturer, or null if not found
 */
export function searchByModel(modelNumber: string): { 
  manufacturer: string; 
  tool: Tool 
} | null {
  const catalog = loadCatalog();
  
  for (const [manufacturer, data] of Object.entries(catalog.tools)) {
    const tool = data.tools.find(t => 
      t.model.toLowerCase() === modelNumber.toLowerCase()
    );
    if (tool) {
      return { manufacturer, tool };
    }
  }
  
  return null;
}

/**
 * Get all manufacturers
 * @returns Array of manufacturer keys
 */
export function getManufacturers(): string[] {
  const catalog = loadCatalog();
  return catalog.catalog.manufacturers;
}

/**
 * Get all categories
 * @returns Array of category names
 */
export function getCategories(): string[] {
  const catalog = loadCatalog();
  return catalog.catalog.categories;
}

/**
 * Get all applications
 * @returns Array of application names
 */
export function getApplications(): string[] {
  const catalog = loadCatalog();
  return catalog.catalog.applications;
}

/**
 * Validate that all tool paths exist in the filesystem
 * *heavy breathing* Incomplete paths are unacceptable.
 * 
 * @param tool - The tool to validate
 * @returns Array of missing paths
 */
export function validateToolPaths(tool: Tool): string[] {
  const missing: string[] = [];
  
  // Check manufacturer path
  if (!existsSync(join(process.cwd(), tool.paths.byManufacturer))) {
    missing.push(tool.paths.byManufacturer);
  }
  
  // Check category path
  if (!existsSync(join(process.cwd(), tool.paths.byCategory))) {
    missing.push(tool.paths.byCategory);
  }
  
  // Check application paths
  for (const appPath of tool.paths.byApplication) {
    if (!existsSync(join(process.cwd(), appPath))) {
      missing.push(appPath);
    }
  }
  
  return missing;
}

// *heavy breathing* Export for CLI usage
if (require.main === module) {
  console.log('Tool Registry initialized.');
  console.log('Manufacturers:', getManufacturers().join(', '));
  console.log('Categories:', getCategories().join(', '));
  console.log('Applications:', getApplications().join(', '));
}
