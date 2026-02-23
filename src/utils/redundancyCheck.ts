/**
 * Redundancy Check System
 * *heavy breathing* All paths must exist. All redundancies must be verified.
 * Incomplete structures are... pathetic.
 * 
 * @module redundancyCheck
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { loadCatalog, Tool } from './toolRegistry';

export interface PathStatus {
  path: string;
  exists: boolean;
  type: 'manufacturer' | 'category' | 'application';
  manufacturer?: string;
  toolType?: string;
}

export interface RedundancyReport {
  totalPaths: number;
  existingPaths: number;
  missingPaths: number;
  complianceRate: number;
  byManufacturer: Record<string, ManufacturerStatus>;
  byCategory: Record<string, CategoryStatus>;
  byApplication: Record<string, ApplicationStatus>;
  missingDetails: PathStatus[];
}

export interface ManufacturerStatus {
  name: string;
  expectedPaths: number;
  existingPaths: number;
  missingPaths: number;
  toolTypes: Record<string, boolean>;
}

export interface CategoryStatus {
  name: string;
  expectedManufacturers: number;
  existingManufacturers: number;
  missingManufacturers: string[];
}

export interface ApplicationStatus {
  name: string;
  expectedManufacturers: number;
  existingManufacturers: number;
  missingManufacturers: string[];
}

const BASE_PATH = join(process.cwd(), 'src', 'tools');

/**
 * Check if a directory exists
 * @param path - The path to check
 * @returns True if exists
 */
function directoryExists(path: string): boolean {
  return existsSync(path) && statSync(path).isDirectory();
}

/**
 * Verify all manufacturer tool-type directories exist
 * *heavy breathing* The foundation of our empire must be complete.
 * 
 * @returns Array of path statuses
 */
function checkManufacturerPaths(): PathStatus[] {
  const catalog = loadCatalog();
  const statuses: PathStatus[] = [];
  
  for (const [manufacturer, data] of Object.entries(catalog.tools)) {
    const mfgPath = join(BASE_PATH, manufacturer);
    
    // Check manufacturer base directory
    statuses.push({
      path: `src/tools/${manufacturer}`,
      exists: directoryExists(mfgPath),
      type: 'manufacturer',
      manufacturer
    });
    
    // Check each tool type directory
    for (const tool of data.tools) {
      const toolTypePath = join(mfgPath, tool.paths.byManufacturer.split('/').pop() || '');
      statuses.push({
        path: tool.paths.byManufacturer,
        exists: directoryExists(toolTypePath),
        type: 'manufacturer',
        manufacturer,
        toolType: tool.paths.byManufacturer.split('/').pop()
      });
    }
  }
  
  return statuses;
}

/**
 * Verify all category directories exist for all manufacturers
 * @returns Array of path statuses
 */
function checkCategoryPaths(): PathStatus[] {
  const catalog = loadCatalog();
  const statuses: PathStatus[] = [];
  
  for (const category of catalog.catalog.categories) {
    const categoryPath = join(BASE_PATH, 'category', category);
    
    // Check category base directory
    statuses.push({
      path: `src/tools/category/${category}`,
      exists: directoryExists(categoryPath),
      type: 'category'
    });
    
    // Check each manufacturer subdirectory
    for (const manufacturer of catalog.catalog.manufacturers) {
      const mfgPath = join(categoryPath, manufacturer);
      statuses.push({
        path: `src/tools/category/${category}/${manufacturer}`,
        exists: directoryExists(mfgPath),
        type: 'category',
        manufacturer
      });
    }
  }
  
  return statuses;
}

/**
 * Verify all application directories exist for all manufacturers
 * @returns Array of path statuses
 */
function checkApplicationPaths(): PathStatus[] {
  const catalog = loadCatalog();
  const statuses: PathStatus[] = [];
  
  for (const application of catalog.catalog.applications) {
    const appPath = join(BASE_PATH, 'application', application);
    
    // Check application base directory
    statuses.push({
      path: `src/tools/application/${application}`,
      exists: directoryExists(appPath),
      type: 'application'
    });
    
    // Check each manufacturer subdirectory
    for (const manufacturer of catalog.catalog.manufacturers) {
      const mfgPath = join(appPath, manufacturer);
      statuses.push({
        path: `src/tools/application/${application}/${manufacturer}`,
        exists: directoryExists(mfgPath),
        type: 'application',
        manufacturer
      });
    }
  }
  
  return statuses;
}

/**
 * Run complete redundancy check
 * *heavy breathing* Nothing escapes my inspection.
 * 
 * @returns Complete redundancy report
 */
export function runRedundancyCheck(): RedundancyReport {
  const catalog = loadCatalog();
  
  // Gather all path statuses
  const manufacturerStatuses = checkManufacturerPaths();
  const categoryStatuses = checkCategoryPaths();
  const applicationStatuses = checkApplicationPaths();
  
  const allStatuses = [
    ...manufacturerStatuses,
    ...categoryStatuses,
    ...applicationStatuses
  ];
  
  // Calculate totals
  const totalPaths = allStatuses.length;
  const existingPaths = allStatuses.filter(s => s.exists).length;
  const missingPaths = totalPaths - existingPaths;
  const complianceRate = totalPaths > 0 ? (existingPaths / totalPaths) * 100 : 0;
  
  // Build manufacturer status report
  const byManufacturer: Record<string, ManufacturerStatus> = {};
  for (const [key, data] of Object.entries(catalog.tools)) {
    const mfgStatuses = manufacturerStatuses.filter(
      s => s.manufacturer === key && s.type === 'manufacturer'
    );
    const toolTypes: Record<string, boolean> = {};
    
    for (const tool of data.tools) {
      const toolTypeName = tool.paths.byManufacturer.split('/').pop() || '';
      const toolStatus = mfgStatuses.find(s => s.toolType === toolTypeName);
      toolTypes[toolTypeName] = toolStatus?.exists || false;
    }
    
    byManufacturer[key] = {
      name: data.manufacturer,
      expectedPaths: mfgStatuses.length,
      existingPaths: mfgStatuses.filter(s => s.exists).length,
      missingPaths: mfgStatuses.filter(s => !s.exists).length,
      toolTypes
    };
  }
  
  // Build category status report
  const byCategory: Record<string, CategoryStatus> = {};
  for (const category of catalog.catalog.categories) {
    const catStatuses = categoryStatuses.filter(
      s => s.path.includes(`category/${category}`) && s.manufacturer
    );
    const existingMfgs = catStatuses.filter(s => s.exists).map(s => s.manufacturer!);
    const missingMfgs = catalog.catalog.manufacturers.filter(
      m => !existingMfgs.includes(m)
    );
    
    byCategory[category] = {
      name: category,
      expectedManufacturers: catalog.catalog.manufacturers.length,
      existingManufacturers: existingMfgs.length,
      missingManufacturers: missingMfgs
    };
  }
  
  // Build application status report
  const byApplication: Record<string, ApplicationStatus> = {};
  for (const application of catalog.catalog.applications) {
    const appStatuses = applicationStatuses.filter(
      s => s.path.includes(`application/${application}`) && s.manufacturer
    );
    const existingMfgs = appStatuses.filter(s => s.exists).map(s => s.manufacturer!);
    const missingMfgs = catalog.catalog.manufacturers.filter(
      m => !existingMfgs.includes(m)
    );
    
    byApplication[application] = {
      name: application,
      expectedManufacturers: catalog.catalog.manufacturers.length,
      existingManufacturers: existingMfgs.length,
      missingManufacturers: missingMfgs
    };
  }
  
  // Collect missing details
  const missingDetails = allStatuses.filter(s => !s.exists);
  
  return {
    totalPaths,
    existingPaths,
    missingPaths,
    complianceRate,
    byManufacturer,
    byCategory,
    byApplication,
    missingDetails
  };
}

/**
 * Generate formatted redundancy report
 * *heavy breathing* The weak paths will be exposed.
 * 
 * @returns Formatted report string
 */
export function generateRedundancyReport(): string {
  const report = runRedundancyCheck();
  const lines: string[] = [];
  
  lines.push('='.repeat(70));
  lines.push('REDUNDANCY CHECK REPORT - KLEIN TOOLKIT EMPIRE');
  lines.push('='.repeat(70));
  lines.push('');
  
  // Overall Status
  lines.push('OVERALL STATUS');
  lines.push('-'.repeat(50));
  lines.push(`Total Paths Checked: ${report.totalPaths}`);
  lines.push(`Existing Paths: ${report.existingPaths}`);
  lines.push(`Missing Paths: ${report.missingPaths}`);
  lines.push(`Compliance Rate: ${report.complianceRate.toFixed(1)}%`);
  lines.push('');
  
  // Status indicator
  if (report.complianceRate === 100) {
    lines.push('✓ ALL PATHS EXIST - The empire is complete.');
  } else if (report.complianceRate >= 90) {
    lines.push('⚠ MINOR GAPS - Acceptable, but improvement is needed.');
  } else if (report.complianceRate >= 70) {
    lines.push('⚠ SIGNIFICANT GAPS - The structure is weak.');
  } else {
    lines.push('✗ CRITICAL - The structure is pathetic. Rebuild immediately.');
  }
  lines.push('');
  
  // By Manufacturer
  lines.push('MANUFACTURER STATUS');
  lines.push('-'.repeat(50));
  for (const [key, status] of Object.entries(report.byManufacturer)) {
    const indicator = status.missingPaths === 0 ? '✓' : '✗';
    lines.push(`${indicator} ${status.name} (${key})`);
    lines.push(`  Tool Types: ${status.existingPaths}/${status.expectedPaths}`);
    
    if (status.missingPaths > 0) {
      const missing = Object.entries(status.toolTypes)
        .filter(([_, exists]) => !exists)
        .map(([name, _]) => name)
        .join(', ');
      lines.push(`  Missing: ${missing}`);
    }
  }
  lines.push('');
  
  // By Category
  lines.push('CATEGORY STATUS');
  lines.push('-'.repeat(50));
  for (const [key, status] of Object.entries(report.byCategory)) {
    const indicator = status.missingManufacturers.length === 0 ? '✓' : '⚠';
    lines.push(`${indicator} ${status.name}`);
    lines.push(`  Manufacturers: ${status.existingManufacturers}/${status.expectedManufacturers}`);
    
    if (status.missingManufacturers.length > 0) {
      lines.push(`  Missing: ${status.missingManufacturers.join(', ')}`);
    }
  }
  lines.push('');
  
  // By Application
  lines.push('APPLICATION STATUS');
  lines.push('-'.repeat(50));
  for (const [key, status] of Object.entries(report.byApplication)) {
    const indicator = status.missingManufacturers.length === 0 ? '✓' : '⚠';
    lines.push(`${indicator} ${status.name}`);
    lines.push(`  Manufacturers: ${status.existingManufacturers}/${status.expectedManufacturers}`);
    
    if (status.missingManufacturers.length > 0) {
      lines.push(`  Missing: ${status.missingManufacturers.join(', ')}`);
    }
  }
  lines.push('');
  
  // Missing Paths Detail
  if (report.missingDetails.length > 0) {
    lines.push('MISSING PATHS DETAIL');
    lines.push('-'.repeat(50));
    for (const missing of report.missingDetails) {
      lines.push(`  ${missing.path}`);
    }
    lines.push('');
  }
  
  lines.push('='.repeat(70));
  lines.push('END OF REDUNDANCY REPORT');
  lines.push('='.repeat(70));
  
  return lines.join('\n');
}

/**
 * Quick check - returns true if all paths exist
 * @returns True if 100% compliance
 */
export function isFullyRedundant(): boolean {
  const report = runRedundancyCheck();
  return report.complianceRate === 100;
}

// *heavy breathing* Export for CLI usage
if (require.main === module) {
  console.log(generateRedundancyReport());
}
