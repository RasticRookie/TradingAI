# 🚀 Deploying TradePredict Pro to GitHub Pages

This guide will help you deploy your TradePredict Pro app to GitHub Pages in just a few simple steps!

## 📋 Prerequisites

- A GitHub account
- Git installed on your computer
- This project downloaded/cloned on your local machine

## 🛠️ Setup Instructions

### Step 1: Update Configuration

Before deploying, you need to update two files with your GitHub username and repository name:

#### 1. Update `package.json`

Replace `YOUR_USERNAME` with your actual GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/TradePredict-Pro"
```

For example, if your GitHub username is `johndoe`:
```json
"homepage": "https://johndoe.github.io/TradePredict-Pro"
```

#### 2. Update `vite.config.ts`

If you want to use a different repository name (not `TradePredict-Pro`), update the `base` property:

```typescript
base: '/YOUR-REPO-NAME/',
```

#### 3. Update `src/App.tsx`

Make sure the basename matches your repository name:

```typescript
<Router basename="/YOUR-REPO-NAME">
```

**Note:** The repository name in all three files MUST match exactly (case-sensitive)!

---

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon in the top right → **New repository**
3. Name your repository: `TradePredict-Pro` (or your chosen name)
4. Make it **Public** (required for free GitHub Pages)
5. Do **NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

---

### Step 3: Initialize Git & Push Code

Open your terminal in the project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit - TradePredict Pro"

# Add your GitHub repo as remote (replace YOUR_USERNAME and YOUR-REPO-NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 4: Deploy to GitHub Pages

Run the deploy command:

```bash
npm run deploy
```

This will:
- Build your app (`npm run build`)
- Create/update the `gh-pages` branch
- Push the built files to GitHub

You should see output ending with:
```
Published
```

---

### Step 5: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `gh-pages` and `/ (root)`
   - Click **Save**

---

### Step 6: Access Your Live App! 🎉

Your app will be live at:
```
https://YOUR_USERNAME.github.io/TradePredict-Pro
```

**Note:** It may take 1-5 minutes for the site to go live after the first deployment.

---

## 🔄 Making Updates

After making changes to your code:

```bash
# Save and commit your changes
git add .
git commit -m "Description of your changes"
git push origin main

# Deploy the updates
npm run deploy
```

The live site will update in 1-2 minutes!

---

## ❓ Troubleshooting

### Blank Page or 404 Error

**Problem:** You see a blank page or 404 error when visiting your site.

**Solution:**
1. Check that the `base` in `vite.config.ts` matches your repo name exactly
2. Check that `basename` in `src/App.tsx` matches your repo name
3. Verify the `homepage` in `package.json` is correct
4. Make sure all three have the same repository name (case-sensitive)
5. Redeploy: `npm run deploy`

### Assets Not Loading

**Problem:** CSS/images not loading, or console shows 404 errors.

**Solution:**
1. The `base` path in `vite.config.ts` must have slashes: `/repo-name/`
2. Redeploy after fixing: `npm run deploy`

### Deploy Command Fails

**Problem:** `npm run deploy` shows an error.

**Solution:**
1. Make sure you've pushed to the `main` branch first:
   ```bash
   git push origin main
   ```
2. Check that `gh-pages` package is installed:
   ```bash
   npm install gh-pages --save-dev
   ```
3. Try again: `npm run deploy`

### GitHub Pages Not Enabled

**Problem:** GitHub Pages settings are missing or greyed out.

**Solution:**
1. Make sure your repository is **Public** (Settings → General → Danger Zone → Change visibility)
2. Make sure the `gh-pages` branch exists (run `npm run deploy` first)
3. Refresh the Settings page

---

## 🎨 Custom Domain (Optional)

Want to use your own domain like `tradepredictpro.com`?

1. Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
2. In your GitHub repo: Settings → Pages → Custom domain
3. Enter your domain and click Save
4. Configure DNS records with your registrar:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```
5. Wait 24-48 hours for DNS propagation

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the [GitHub Pages status](https://www.githubstatus.com/)
2. Review the troubleshooting section above
3. Check browser console for errors (F12)
4. Verify all config files match your repository name

---

Happy Trading! 📈🚀
