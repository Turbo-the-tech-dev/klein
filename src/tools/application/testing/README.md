# Testing Application

*heavy breathing* 🫁 Testing - Verify before you trust.

## Overview

Testing applications involve verifying electrical systems are safe and functional. Testing is critical before energizing any circuit.

## Manufacturers with Testing Tools

| Manufacturer | Testing Tools |
|-------------|---------------|
| Ideal Industries | Voltage testers |
| Milwaukee | Work lights |

## Directory Structure

```
testing/
├── ideal/           # Ideal testing tools
└── milwaukee/       # Milwaukee testing lights
```

## Common Testing Tasks

### Voltage Detection
- Non-contact voltage detection
- Contact voltage testing
- Phase verification

### Circuit Testing
- Continuity testing
- Resistance measurement
- Current measurement

### System Verification
- GFCI testing
- AFCI testing
- Ground testing

### Visual Inspection
- Work lighting
- Thermal imaging
- Visual verification

## Cross-References

- **By Manufacturer**: `src/tools/{manufacturer}/`
- **By Category**: `src/tools/category/testing-equipment/`
- **By Category**: `src/tools/category/power-tools/`

## NEC Requirements

*heavy breathing* Testing must comply with:
- NEC Article 110 - Testing requirements
- NEC Article 210 - Branch circuit testing
- NFPA 70E - Electrical Safety
- Proper CAT ratings for equipment

## Testing Sequence

1. **Verify** tester works on known voltage
2. **Test** the circuit to be worked on
3. **Verify** tester still works
4. **Document** all test results

## Safety Requirements

⚠️ **NEVER** assume a circuit is de-energized
⚠️ **ALWAYS** test your tester before and after
⚠️ **USE** proper CAT-rated equipment
⚠️ **FOLLOW** NFPA 70E safety procedures
