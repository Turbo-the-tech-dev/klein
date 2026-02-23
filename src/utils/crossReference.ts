/**
 * Cross-Reference Tool Comparison System
 * *heavy breathing* Compare tools across manufacturers. Find the strongest.
 * Eliminate the weak.
 * 
 * @module crossReference
 */

import { 
  loadCatalog, 
  CatalogData, 
  Tool, 
  ManufacturerData 
} from './toolRegistry';

export interface ToolComparison {
  category: string;
  application: string;
  tools: Array<{
    manufacturer: string;
    tool: Tool;
  }>;
}

export interface ManufacturerComparison {
  manufacturer: string;
  description: string;
  toolCount: number;
  categories: string[];
  applications: string[];
  tools: Tool[];
}

export interface ApplicationMatrix {
  application: string;
  manufacturers: Array<{
    manufacturer: string;
    tools: Tool[];
    count: number;
  }>;
}

/**
 * Compare tools across all manufacturers for a specific category
 * *heavy breathing* Only the strongest tools survive comparison.
 * 
 * @param category - The category to compare
 * @returns Comparison data with all tools from all manufacturers
 */
export function compareByCategory(category: string): ToolComparison {
  const catalog = loadCatalog();
  const result: ToolComparison = {
    category,
    application: '',
    tools: []
  };
  
  for (const [manufacturer, data] of Object.entries(catalog.tools)) {
    for (const tool of data.tools) {
      if (tool.category === category) {
        result.tools.push({
          manufacturer,
          tool
        });
        // Collect all applications for this category
        for (const app of tool.application) {
          if (!result.application.includes(app)) {
            result.application = result.application 
              ? `${result.application}, ${app}` 
              : app;
          }
        }
      }
    }
  }
  
  // Sort by manufacturer name for consistency
  result.tools.sort((a, b) => 
    a.manufacturer.localeCompare(b.manufacturer)
  );
  
  return result;
}

/**
 * Compare tools across all manufacturers for a specific application
 * @param application - The application to compare
 * @returns Comparison data with all tools from all manufacturers
 */
export function compareByApplication(application: string): ToolComparison {
  const catalog = loadCatalog();
  const result: ToolComparison = {
    category: '',
    application,
    tools: []
  };
  
  const categories = new Set<string>();
  
  for (const [manufacturer, data] of Object.entries(catalog.tools)) {
    for (const tool of data.tools) {
      if (tool.application.includes(application)) {
        result.tools.push({
          manufacturer,
          tool
        });
        categories.add(tool.category);
      }
    }
  }
  
  result.category = Array.from(categories).join(', ');
  
  // Sort by manufacturer name for consistency
  result.tools.sort((a, b) => 
    a.manufacturer.localeCompare(b.manufacturer)
  );
  
  return result;
}

/**
 * Get a comprehensive comparison of a specific manufacturer
 * *heavy breathing* Know your enemy. Know your ally. Know the tools.
 * 
 * @param manufacturer - The manufacturer to analyze
 * @returns Detailed manufacturer comparison data
 */
export function compareManufacturer(manufacturer: string): ManufacturerComparison | null {
  const catalog = loadCatalog();
  const data = catalog.tools[manufacturer];
  
  if (!data) {
    return null;
  }
  
  const categories = new Set<string>();
  const applications = new Set<string>();
  
  for (const tool of data.tools) {
    categories.add(tool.category);
    for (const app of tool.application) {
      applications.add(app);
    }
  }
  
  return {
    manufacturer: data.manufacturer,
    description: data.description,
    toolCount: data.tools.length,
    categories: Array.from(categories).sort(),
    applications: Array.from(applications).sort(),
    tools: data.tools
  };
}

/**
 * Generate a full application matrix showing all manufacturers per application
 * @returns Complete application matrix
 */
export function generateApplicationMatrix(): ApplicationMatrix[] {
  const catalog = loadCatalog();
  const matrix: ApplicationMatrix[] = [];
  
  for (const application of catalog.catalog.applications) {
    const appMatrix: ApplicationMatrix = {
      application,
      manufacturers: []
    };
    
    for (const [manufacturer, data] of Object.entries(catalog.tools)) {
      const toolsForApp = data.tools.filter(t => 
        t.application.includes(application)
      );
      
      if (toolsForApp.length > 0) {
        appMatrix.manufacturers.push({
          manufacturer: data.manufacturer,
          tools: toolsForApp,
          count: toolsForApp.length
        });
      }
    }
    
    // Sort manufacturers by tool count (descending) - strength matters
    appMatrix.manufacturers.sort((a, b) => b.count - a.count);
    
    matrix.push(appMatrix);
  }
  
  // Sort applications alphabetically
  matrix.sort((a, b) => a.application.localeCompare(b.application));
  
  return matrix;
}

/**
 * Find equivalent tools across manufacturers
 * *heavy breathing* Similar tools. Different masters. Choose wisely.
 * 
 * @param toolName - Partial name to match
 * @returns Array of matching tools from different manufacturers
 */
export function findEquivalentTools(toolName: string): ToolComparison[] {
  const catalog = loadCatalog();
  const results: ToolComparison[] = [];
  const seenModels = new Set<string>();
  
  for (const [manufacturer, data] of Object.entries(catalog.tools)) {
    for (const tool of data.tools) {
      if (
        tool.name.toLowerCase().includes(toolName.toLowerCase()) &&
        !seenModels.has(tool.model)
      ) {
        seenModels.add(tool.model);
        
        // Find similar tools in same category
        const similar: ToolComparison = {
          category: tool.category,
          application: tool.application.join(', '),
          tools: []
        };
        
        // Add the original tool
        similar.tools.push({ manufacturer, tool });
        
        // Find similar tools from other manufacturers
        for (const [otherMfg, otherData] of Object.entries(catalog.tools)) {
          if (otherMfg !== manufacturer) {
            for (const otherTool of otherData.tools) {
              if (
                otherTool.category === tool.category &&
                otherTool.name.toLowerCase().includes(toolName.toLowerCase()) &&
                !seenModels.has(otherTool.model)
              ) {
                seenModels.add(otherTool.model);
                similar.tools.push({
                  manufacturer: otherMfg,
                  tool: otherTool
                });
              }
            }
          }
        }
        
        if (similar.tools.length > 1) {
          results.push(similar);
        }
      }
    }
  }
  
  return results;
}

/**
 * Generate a cross-reference report
 * *heavy breathing* The report reveals all. Nothing is hidden.
 * 
 * @returns Formatted report string
 */
export function generateCrossReferenceReport(): string {
  const catalog = loadCatalog();
  const lines: string[] = [];
  
  lines.push('='.repeat(60));
  lines.push('CROSS-REFERENCE REPORT - KLEIN TOOLKIT EMPIRE');
  lines.push('='.repeat(60));
  lines.push('');
  
  // Summary
  lines.push('SUMMARY');
  lines.push('-'.repeat(40));
  lines.push(`Total Manufacturers: ${catalog.catalog.manufacturers.length}`);
  lines.push(`Total Categories: ${catalog.catalog.categories.length}`);
  lines.push(`Total Applications: ${catalog.catalog.applications.length}`);
  
  let totalTools = 0;
  for (const data of Object.values(catalog.tools)) {
    totalTools += data.tools.length;
  }
  lines.push(`Total Tools: ${totalTools}`);
  lines.push('');
  
  // Manufacturers
  lines.push('MANUFACTURERS');
  lines.push('-'.repeat(40));
  for (const [key, data] of Object.entries(catalog.tools)) {
    lines.push(`${data.manufacturer} (${key})`);
    lines.push(`  ${data.description}`);
    lines.push(`  Tools: ${data.tools.length}`);
  }
  lines.push('');
  
  // Category Distribution
  lines.push('CATEGORY DISTRIBUTION');
  lines.push('-'.repeat(40));
  for (const [category, manufacturers] of Object.entries(catalog.crossReference.byCategory)) {
    lines.push(`${category}: ${manufacturers.join(', ')}`);
  }
  lines.push('');
  
  // Application Distribution
  lines.push('APPLICATION DISTRIBUTION');
  lines.push('-'.repeat(40));
  for (const [app, manufacturers] of Object.entries(catalog.crossReference.byApplication)) {
    lines.push(`${app}: ${manufacturers.join(', ')}`);
  }
  lines.push('');
  
  lines.push('='.repeat(60));
  lines.push('END OF REPORT');
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}

// *heavy breathing* Export for CLI usage
if (require.main === module) {
  console.log(generateCrossReferenceReport());
}
