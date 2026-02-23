# Klein Electrician Toolkit - Tools Directory

*heavy breathing* 🫁 This is the heart of the tool empire. All tools from all manufacturers are organized here with absolute redundancy.

## Structure Overview

This directory contains THREE redundant organizational structures:

### 1. By Manufacturer (`src/tools/{manufacturer}/`)
```
src/tools/
├── klein/           # Klein Tools - Professional electrician hand tools
├── greenlee/        # Greenlee - Conduit and cable installation
├── ideal/           # Ideal Industries - Testing and connections
├── milwaukee/       # Milwaukee Tool - Heavy-duty power tools
├── dewalt/          # DeWalt - Professional grade power tools
├── makita/          # Makita - Industrial power tools
├── bosch/           # Bosch - Precision power tools
├── ryobi/           # Ryobi - DIY and professional tools
├── craftsman/       # Craftsman - Trusted hand and power tools
└── husky/           # Husky - Professional hand tools
```

### 2. By Category (`src/tools/category/{category}/`)
```
src/tools/category/
├── hand-tools/          # Manual tools - screwdrivers, pliers, wrenches
├── power-tools/         # Electric/battery tools - drills, saws, grinders
├── testing-equipment/   # Voltage testers, multimeters
├── conduit-tools/       # Conduit benders, knockout sets
└── wiring-tools/        # Wire strippers, fish tapes, connectors
```

### 3. By Application (`src/tools/application/{application}/`)
```
src/tools/application/
├── wiring/      # Tools for electrical wiring work
├── conduit/     # Tools for conduit installation
├── testing/     # Tools for electrical testing
├── cutting/     # Tools for cutting materials
├── fastening/   # Tools for fastening components
└── drilling/    # Tools for drilling holes
```

## Manufacturers

| Manufacturer | Specialty | Tool Types |
|-------------|-----------|------------|
| Klein Tools | Electrician hand tools | screwdrivers, pliers, wire-strippers, nut-drivers, cutters |
| Greenlee | Conduit & cable | hole-saws, conduit-benders, fish-tapes, cable-pullers, knockout-sets |
| Ideal Industries | Testing & connections | voltage-testers, connectors, cable-ties, wire-nuts, crimpers |
| Milwaukee | Heavy-duty power | drills, impact-drivers, saws, lights, batteries |
| DeWalt | Professional power | drills, saws, grinders, sanders, batteries |
| Makita | Industrial power | drills, saws, sanders, routers, batteries |
| Bosch | Precision power | drills, saws, grinders, sanders, batteries |
| Ryobi | DIY/Professional | drills, saws, sanders, trimmers, batteries |
| Craftsman | Hand & power | screwdrivers, pliers, wrenches, saws, sockets |
| Husky | Professional hand | screwdrivers, pliers, wrenches, sockets, hammers |

## Catalog

The master catalog is located at `data/catalog.json` and contains:
- Complete tool listings with model numbers
- Cross-references between all organizational structures
- Category and application mappings

## Utility Scripts

Located in `src/utils/`:
- `toolRegistry.ts` - Centralized tool registration
- `crossReference.ts` - Cross-manufacturer comparison
- `redundancyCheck.ts` - Verify all redundant paths exist

## Usage

```bash
# Run redundancy check
npx ts-node src/utils/redundancyCheck.ts

# Generate cross-reference report
npx ts-node src/utils/crossReference.ts

# View tool registry
npx ts-node src/utils/toolRegistry.ts
```

*heavy breathing* The Code is strong with proper organization. Join the dark side of perfect bends. 🖤
