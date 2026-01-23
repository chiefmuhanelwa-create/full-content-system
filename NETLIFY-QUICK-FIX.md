# ⚡ QUICK FIX: Scripts Not Generating on Netlify

**Site**: https://nochillcontentengine.netlify.app/
**Issue**: Script generation failing
**Solution**: 2 minutes to fix

---

## 🚨 IMMEDIATE ACTION REQUIRED

### **Step 1: Add Environment Variable** (60 seconds)

1. **Go to Netlify Dashboard**:
   ```
   https://app.netlify.com/sites/nochillcontentengine/settings/deploys#environment-variables
   ```

2. **Click "Add a variable"**

3. **Add your API key**:
   ```
   Key: ANTHROPIC_API_KEY
   Value: [Paste your API key - it starts with sk-ant-api03-]
   Scopes: ✅ All (check all boxes)
   ```

4. **Click "Create variable"**

---

### **Step 2: Trigger Redeploy** (30 seconds)

1. **Go to Deploys**:
   ```
   https://app.netlify.com/sites/nochillcontentengine/deploys
   ```

2. **Click "Trigger deploy"** (top right)

3. **Select "Deploy site"**

4. **Wait 2-3 minutes** for deployment to complete

---

### **Step 3: Test It Works** (30 seconds)

1. **Open your site**:
   ```
   https://nochillcontentengine.netlify.app/dashboard/scripts
   ```

2. **Open Browser Console** (Press F12)

3. **Generate a test script**:
   - Enter: "How to grow on Instagram"
   - Click "Generate Script"

4. **Check Console** - You should see:
   ```
   ✅ "Script generation API called"
   ✅ "Calling Claude API..."
   ✅ "Claude API call successful"
   ```

---

## ✅ SUCCESS INDICATORS

**It's working if:**
- ✅ Script generates within 15-30 seconds
- ✅ You see the 10-step framework with clear divisions
- ✅ No error messages in console
- ✅ Script displays properly

**Still broken if:**
- ❌ Error: "API configuration error"
- ❌ Error: "Failed to generate script"
- ❌ Console shows: "ANTHROPIC_API_KEY environment variable is not set"

---

## 🐛 If Still Not Working

### **Check 1: Environment Variable**

Go to:
```
https://app.netlify.com/sites/nochillcontentengine/settings/deploys#environment-variables
```

**Verify:**
- Variable name is exactly: `ANTHROPIC_API_KEY` (case sensitive)
- Value starts with: `sk-ant-api03-`
- Scopes include: Production, Deploy Previews, Branch deploys
- Variable is not empty

### **Check 2: Netlify Function Logs**

Go to:
```
https://app.netlify.com/sites/nochillcontentengine/functions
```

**Look for:**
- Function name: `scripts-generate`
- Click it to see logs
- Look for error messages

### **Check 3: Re-add API Key**

If still not working:
1. Delete the existing `ANTHROPIC_API_KEY` variable
2. Add it again (Step 1)
3. Make sure to copy the FULL key (they're long!)
4. Redeploy (Step 2)

---

## 📞 Need Help?

**Check the comprehensive guide**:
- Read: `NETLIFY-DEPLOYMENT-GUIDE.md` in your project
- Has full troubleshooting section

**Common Issues**:
1. **Typo in variable name**: Must be `ANTHROPIC_API_KEY` exactly
2. **Wrong scopes**: Must check ALL scope boxes
3. **Didn't redeploy**: Must trigger new deploy after adding variable
4. **Invalid API key**: Check it works locally first

---

## 🎯 What I Fixed

**New Files Added:**
1. ✅ `netlify.toml` - Netlify configuration
2. ✅ Enhanced error logging in API
3. ✅ API key validation
4. ✅ Detailed deployment guide

**What Changed:**
- API now checks for ANTHROPIC_API_KEY at start
- Better error messages if key is missing
- Console logging to help debug
- Netlify-specific configuration file

**Next Deploy Will:**
- Show helpful error if API key missing
- Log each step of script generation
- Guide you to add API key in Netlify
- Work perfectly once API key is added

---

**Time to Fix**: 2 minutes
**Difficulty**: Easy
**Required**: Just add one environment variable

✅ **Follow Steps 1-3 above and your scripts will generate!**
