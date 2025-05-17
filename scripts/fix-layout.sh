#!/bin/bash
# Script to fix horizontal scrolling issues
# filepath: /home/kaue/developer/quewuicom/retro-quewui/scripts/fix-layout.sh

echo "Checking for layout issues in CSS files..."

# Add overflow-x: hidden to all view containers
find ./src/views -name "*.css" -exec sed -i 's/\..*-view {/&\n  overflow-x: hidden;/g' {} \;
find ./src/components -name "*.css" -exec sed -i 's/\..*-container {/&\n  overflow-x: hidden;/g' {} \;

# Add box-sizing: border-box to all containers
find ./src -name "*.css" -exec sed -i 's/\.container {/&\n  box-sizing: border-box;/g' {} \;
find ./src -name "*.css" -exec sed -i 's/\..*-container {/&\n  box-sizing: border-box;/g' {} \;

# Add max-width: 100% to prevent overflow
find ./src -name "*.css" -exec sed -i 's/width: 100%;/width: 100%;\n  max-width: 100%;/g' {} \;

# Add word-wrap to text containers
find ./src -name "*.css" -exec sed -i 's/\..*-text {/&\n  word-wrap: break-word;/g' {} \;
find ./src -name "*.css" -exec sed -i 's/\..*-description {/&\n  word-wrap: break-word;/g' {} \;

echo "Layout fixes applied. Please review changes."
