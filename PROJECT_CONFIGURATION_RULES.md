# Project Configuration Rules & Guidelines

## 🎯 Objective
This document establishes rules and guidelines to preserve the existing working configuration while allowing safe modifications and tweaks to the project.

## 📋 Current Working Configuration

### ✅ What's Working (DO NOT BREAK)

#### 1. VJSON File Loading System
- **File Location**: `public/ss-0121.vjson`
- **Path Reference**: `/ss-0121.vjson` in `src/webgiInit.ts`
- **Vite Plugin**: `vjsonPlugin` configured in `vite.config.js`
- **Status**: ✅ Working - Scene loads successfully

#### 2. WebGI Viewer Integration
- **Entry Point**: `src/webgiInit.ts`
- **Viewer Component**: `src/WebgiViewer.tsx`
- **Dependencies**: Custom webgi package from specific URL
- **Status**: ✅ Working - 3D viewer displays correctly

#### 3. Development Server Configuration
- **Port**: 5173 (Vite default)
- **Static Files**: Served from `public/` directory
- **Hot Reload**: Enabled
- **Status**: ✅ Working - Development server runs without errors

#### 4. UI Component System
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui components in `src/components/ui/`
- **Status**: ✅ Working - UI components render properly

#### 5. Build System
- **Bundler**: Vite
- **Package Manager**: npm/pnpm (both lock files present)
- **TypeScript**: Configured with `tsconfig.json`
- **ESLint**: Configured with `eslint.config.js`
- **Status**: ✅ Working - Build process completes successfully

## 🚨 CRITICAL RULES (NEVER BREAK)

### Rule 1: VJSON File Integrity
- **NEVER** move `ss-0121.vjson` from `public/` directory
- **NEVER** change the path `/ss-0121.vjson` in `webgiInit.ts`
- **NEVER** remove the `vjsonPlugin` from `vite.config.js`
- **ALWAYS** test VJSON loading after any changes

### Rule 2: WebGI Dependencies
- **NEVER** change the webgi package source URL
- **NEVER** update webgi dependencies without thorough testing
- **ALWAYS** use `--legacy-peer-deps` for npm installs if needed

### Rule 3: File Structure Preservation
- **NEVER** move files from `public/` directory
- **NEVER** change the `src/` directory structure
- **NEVER** rename critical files without updating all references

### Rule 4: Build Configuration
- **NEVER** remove plugins from `vite.config.js`
- **NEVER** change TypeScript configuration without testing
- **NEVER** modify ESLint rules that prevent errors

## 🔧 SAFE MODIFICATION GUIDELINES

### Allowed Tweaks (With Precautions)

#### 1. UI/UX Improvements
- ✅ Modify component styling in `src/components/ui/`
- ✅ Add new UI components
- ✅ Update CSS classes and Tailwind utilities
- ✅ Change layout and positioning
- **Precaution**: Test on different screen sizes

#### 2. Functionality Enhancements
- ✅ Add new features to existing components
- ✅ Extend WebGI viewer functionality
- ✅ Add new hooks in `src/hooks/`
- ✅ Create new utility functions in `src/lib/`
- **Precaution**: Maintain backward compatibility

#### 3. Code Organization
- ✅ Refactor code within existing files
- ✅ Add new TypeScript interfaces
- ✅ Improve error handling
- ✅ Add comments and documentation
- **Precaution**: Don't change function signatures without updating all callers

#### 4. Performance Optimizations
- ✅ Optimize component rendering
- ✅ Improve bundle size
- ✅ Add lazy loading
- ✅ Optimize asset loading
- **Precaution**: Test performance impact

## 🧪 Testing Protocol

### Before Making Changes
1. **Create Backup**: Commit current working state
2. **Document Current State**: Note what's working
3. **Plan Changes**: Write down what you're going to modify

### During Changes
1. **Incremental Changes**: Make small, testable changes
2. **Frequent Testing**: Test after each significant change
3. **Console Monitoring**: Watch for errors in browser console

### After Changes
1. **Functionality Test**: Verify VJSON loading still works
2. **UI Test**: Check all components render correctly
3. **Build Test**: Ensure `npm run build` succeeds
4. **Development Test**: Verify `npm run dev` works

## 🚨 Emergency Rollback Plan

### If Something Breaks
1. **Immediate**: Stop making changes
2. **Check Console**: Look for error messages
3. **Revert Last Change**: Undo the most recent modification
4. **Test**: Verify functionality is restored
5. **Document**: Note what caused the issue

### Rollback Commands
```bash
# If using git
git reset --hard HEAD~1

# If not using git, restore from backup
# (Keep regular backups of working state)
```

## 📝 Change Documentation

### Required Documentation for Any Change
- **What**: What was changed
- **Why**: Why the change was needed
- **How**: How the change was implemented
- **Testing**: What was tested
- **Impact**: Any side effects or dependencies

### Update This File
- Add new working configurations to the "What's Working" section
- Update rules if new critical dependencies are discovered
- Document any new safe modification guidelines

## 🔍 Monitoring Checklist

### Daily Development Checklist
- [ ] VJSON file loads without errors
- [ ] WebGI viewer displays correctly
- [ ] All UI components render properly
- [ ] Development server starts without errors
- [ ] No console errors in browser
- [ ] Build process completes successfully

### Before Committing Checklist
- [ ] All tests pass
- [ ] No breaking changes introduced
- [ ] Documentation updated
- [ ] Code follows project conventions
- [ ] Performance not degraded

## 📞 When in Doubt

### Questions to Ask Before Making Changes
1. **Is this change necessary?**
2. **Could this break existing functionality?**
3. **Do I understand the current working state?**
4. **Have I tested this change thoroughly?**
5. **Do I have a rollback plan?**

### Safe Default Actions
- **When unsure**: Don't make the change
- **When testing**: Use a separate branch
- **When experimenting**: Create a backup first
- **When in doubt**: Consult this document

---

**Last Updated**: [Current Date]
**Project Status**: ✅ Stable and Working
**Next Review**: After any significant changes 