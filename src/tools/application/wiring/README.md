# Wiring Application

*heavy breathing* 🫁 Wiring - The lifeblood of electrical systems.

## Overview

Wiring applications involve the installation, termination, and management of electrical conductors. This is the core work of every electrician.

## Manufacturers with Wiring Tools

| Manufacturer | Wiring Tools |
|-------------|--------------|
| Klein Tools | Pliers, wire strippers, cutters |
| Greenlee | Fish tapes, cable pullers |
| Ideal Industries | Connectors, wire nuts, cable ties, crimpers |
| Craftsman | Pliers |
| Husky | Pliers |

## Directory Structure

```
wiring/
├── klein/           # Klein wiring tools
├── greenlee/        # Greenlee wiring tools
├── ideal/           # Ideal wiring tools
├── craftsman/       # Craftsman wiring tools
└── husky/           # Husky wiring tools
```

## Common Wiring Tasks

### Wire Preparation
- Stripping insulation
- Cutting to length
- Bending for terminations

### Wire Installation
- Pulling through conduit
- Fishing through walls
- Cable management

### Wire Termination
- Connecting to devices
- Splicing conductors
- Grounding connections

## Cross-References

- **By Manufacturer**: `src/tools/{manufacturer}/`
- **By Category**: 
  - `src/tools/category/hand-tools/`
  - `src/tools/category/wiring-tools/`

## NEC Requirements

*heavy breathing* Wiring must comply with:
- NEC Article 300 - Wiring Methods
- NEC Article 310 - Conductors
- NEC Article 110 - Requirements for Electrical Installations
- Proper wire bending radii
- Conduit fill calculations

## Safety Requirements

⚠️ **ALWAYS** de-energize circuits before working
⚠️ **USE** proper PPE for the task
⚠️ **FOLLOW** lockout/tagout procedures
